import networkx as nx
from typing import Dict, List, Tuple, Any, Optional
from datetime import datetime, timedelta
from .models import (
    Itinerary, ItineraryNode, ItineraryEdge, NodeStatus, NodeType,
    DisruptionEvent, DownstreamImpact
)

import re

def time_to_minutes(time_str: str) -> int:
    """Converts HH:MM, HH:MM IST, or ISO timestamp to integer minutes from start of day."""
    if not time_str or not isinstance(time_str, str):
        return 0
    clean_str = time_str.strip()
    # Check for ISO timestamp with date like 2026-09-27T15:30:00
    if "T" in clean_str and "-" in clean_str:
        try:
            dt = datetime.fromisoformat(clean_str.replace("Z", "+00:00"))
            return dt.hour * 60 + dt.minute
        except Exception:
            pass
    # Extract HH:MM using regex
    m = re.search(r'(\d{1,2}):(\d{2})', clean_str)
    if m:
        try:
            return int(m.group(1)) * 60 + int(m.group(2))
        except Exception:
            pass
    return 0

def minutes_to_time(minutes: int) -> str:
    """Converts minutes back to HH:MM format."""
    hours = (minutes // 60) % 24
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"

class GraphEngine:
    """
    Spatio-Temporal Directed Acyclic Graph (TDAG) engine.
    Calculates Critical Path Method (CPM) slacks, Minimum Connection Time (MCT) safety margins,
    and ripples disruption cascades across all downstream dependencies.
    """

    def __init__(self, itinerary: Itinerary):
        self.itinerary = itinerary
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        self.graph.clear()
        for node in self.itinerary.nodes:
            start_m = time_to_minutes(node.start_time)
            end_m = time_to_minutes(node.end_time)
            duration = node.duration_minutes or max(1, end_m - start_m)
            self.graph.add_node(
                node.id,
                data=node,
                duration=duration,
                start_m=start_m,
                end_m=end_m,
                status=node.status
            )

        for edge in self.itinerary.edges:
            self.graph.add_edge(
                edge.source_id,
                edge.target_id,
                mct=edge.min_connection_time,
                transfer=edge.transfer_duration,
                data=edge
            )

    def calculate_cpm_and_slacks(self) -> Dict[str, Dict[str, float]]:
        """
        Executes Forward and Backward Critical Path passes.
        Computes ES, EF, LS, LF, and Slack for each node.
        """
        if not nx.is_directed_acyclic_graph(self.graph):
            # In case of cycles, break back edges to allow topological sort
            try:
                cycles = list(nx.simple_cycles(self.graph))
                for cycle in cycles:
                    if len(cycle) >= 2:
                        if self.graph.has_edge(cycle[-1], cycle[0]):
                            self.graph.remove_edge(cycle[-1], cycle[0])
            except Exception:
                pass

        try:
            topo_order = list(nx.topological_sort(self.graph))
        except Exception:
            topo_order = list(self.graph.nodes())
        if not topo_order:
            return {}

        # 1. Forward Pass (Earliest Start / Earliest Finish)
        es = {}
        ef = {}
        for node_id in topo_order:
            node_data = self.graph.nodes[node_id]
            pred_finish_times = []
            for pred in self.graph.predecessors(node_id):
                edge_data = self.graph[pred][node_id]
                transfer = edge_data.get('transfer', 0)
                pred_finish_times.append(ef[pred] + transfer)

            if pred_finish_times:
                es[node_id] = max(node_data['start_m'], max(pred_finish_times))
            else:
                es[node_id] = node_data['start_m']

            ef[node_id] = es[node_id] + node_data['duration']

        # 2. Backward Pass (Latest Start / Latest Finish)
        reversed_topo = list(reversed(topo_order))
        lf = {}
        ls = {}
        max_finish = max(ef.values()) if ef else 0

        for node_id in reversed_topo:
            node_data = self.graph.nodes[node_id]
            succ_start_times = []
            for succ in self.graph.successors(node_id):
                edge_data = self.graph[node_id][succ]
                transfer = edge_data.get('transfer', 0)
                succ_start_times.append(ls[succ] - transfer)

            if succ_start_times:
                lf[node_id] = min(succ_start_times)
            else:
                lf[node_id] = max(node_data['end_m'], ef[node_id])

            ls[node_id] = lf[node_id] - node_data['duration']

        # 3. Calculate Slacks & Update Nodes/Edges
        results = {}
        for node_id in self.graph.nodes:
            slack = ls[node_id] - es[node_id]
            results[node_id] = {
                "es": es[node_id],
                "ef": ef[node_id],
                "ls": ls[node_id],
                "lf": lf[node_id],
                "slack": slack
            }
            # Update internal model object if present
            for node in self.itinerary.nodes:
                if node.id == node_id:
                    node.slack_minutes = slack
                    node.earliest_start = es[node_id]
                    node.latest_start = ls[node_id]

        # Calculate edge slacks: t_start(v_j) - t_end(v_i) - (mct + transfer)
        for edge in self.itinerary.edges:
            src_node = next((n for n in self.itinerary.nodes if n.id == edge.source_id), None)
            tgt_node = next((n for n in self.itinerary.nodes if n.id == edge.target_id), None)
            if src_node and tgt_node:
                src_end = time_to_minutes(src_node.end_time)
                tgt_start = time_to_minutes(tgt_node.start_time)
                available_buffer = tgt_start - src_end
                required_buffer = edge.min_connection_time + edge.transfer_duration
                edge.slack = available_buffer - required_buffer
                edge.is_breached = edge.slack < 0

        return results

    def propagate_disruption(self, disruption: DisruptionEvent) -> DownstreamImpact:
        """
        Simulates upstream disruption (delay in minutes or cancellation)
        and traces ripple cascade across all downstream descendants.
        """
        disrupted_id = disruption.node_id
        delay = disruption.delay_minutes

        blast_radius = []
        missed_connections = []
        at_risk_reservations = []
        financial_loss = 0.0

        if disrupted_id not in self.graph:
            return DownstreamImpact(
                disrupted_node_id=disrupted_id,
                delay_minutes=delay,
                blast_radius_node_ids=[],
                missed_connection_node_ids=[],
                at_risk_reservation_ids=[],
                total_downstream_delay=0,
                estimated_financial_loss=0.0,
                domino_risk_index_before=self.itinerary.domino_risk_index,
                domino_risk_index_after=self.itinerary.domino_risk_index,
                summary="Disrupted node not found."
            )

        node_map = {n.id: n for n in self.itinerary.nodes}

        # Baseline CPM
        self.calculate_cpm_and_slacks()

        # Mark disrupted node
        disrupted_node = node_map.get(disrupted_id)
        if not disrupted_node:
            return DownstreamImpact(
                disrupted_node_id=disrupted_id,
                delay_minutes=delay,
                blast_radius_node_ids=[],
                missed_connection_node_ids=[],
                at_risk_reservation_ids=[],
                total_downstream_delay=0,
                estimated_financial_loss=0.0,
                domino_risk_index_before=self.itinerary.domino_risk_index,
                domino_risk_index_after=self.itinerary.domino_risk_index,
                summary="Disrupted node not found."
            )

        if disruption.is_cancellation:
            disrupted_node.status = NodeStatus.CANCELLED
        else:
            disrupted_node.status = NodeStatus.DELAYED

        # Current arrival minutes of disrupted node
        current_arrival = time_to_minutes(disrupted_node.end_time) + delay
        disrupted_node.details["revised_end_time"] = minutes_to_time(current_arrival)

        # Topological traversal of descendants
        descendants = list(nx.descendants(self.graph, disrupted_id))
        # Sort descendants topologically
        subgraph = self.graph.subgraph([disrupted_id] + descendants)
        try:
            ordered_desc = [n for n in nx.topological_sort(subgraph) if n != disrupted_id]
        except Exception:
            ordered_desc = [n for n in descendants if n != disrupted_id]

        node_arrival_times = {disrupted_id: current_arrival}

        for desc_id in ordered_desc:
            desc_node = node_map.get(desc_id)
            if not desc_node:
                continue
            blast_radius.append(desc_id)

            # Find the predecessor with maximum arrival + transfer
            max_inbound_time = 0
            breached = False
            for pred_id in self.graph.predecessors(desc_id):
                pred_node = node_map.get(pred_id)
                pred_fallback = time_to_minutes(pred_node.end_time) if pred_node else 0
                pred_arrival = node_arrival_times.get(pred_id, pred_fallback)
                edge_data = self.graph[pred_id][desc_id]
                mct = edge_data.get('mct', 45)
                transfer = edge_data.get('transfer', 20)

                required_arrival = pred_arrival + mct + transfer
                max_inbound_time = max(max_inbound_time, required_arrival)

                # Check connection validity
                scheduled_start = time_to_minutes(desc_node.start_time)
                if pred_arrival + mct + transfer > scheduled_start:
                    breached = True

            # If it's a transport node and connection was breached:
            if desc_node.type == NodeType.TRANSPORT and breached:
                desc_node.status = NodeStatus.MISSED
                missed_connections.append(desc_id)
                financial_loss += desc_node.cost

            # If it's a reservation node:
            if desc_node.type == NodeType.RESERVATION:
                cutoff_m = time_to_minutes(desc_node.checkin_cutoff or "23:59")
                if max_inbound_time > cutoff_m:
                    desc_node.status = NodeStatus.AT_RISK
                    at_risk_reservations.append(desc_id)
                    financial_loss += desc_node.cost
                elif breached:
                    desc_node.status = NodeStatus.AT_RISK
                    at_risk_reservations.append(desc_id)

            # Update arrival time for subsequent propagation
            node_duration = desc_node.duration_minutes
            node_start = max(time_to_minutes(desc_node.start_time), max_inbound_time)
            node_arrival_times[desc_id] = node_start + node_duration
            desc_node.details["revised_start_time"] = minutes_to_time(node_start)
            desc_node.details["revised_end_time"] = minutes_to_time(node_arrival_times[desc_id])

        # Calculate final arrival delay
        last_node_id = ordered_desc[-1] if ordered_desc else disrupted_id
        last_node = node_map.get(last_node_id)
        original_final_time = time_to_minutes(last_node.end_time) if last_node else 0
        revised_final_time = node_arrival_times.get(last_node_id, original_final_time)
        total_delay = max(0, revised_final_time - original_final_time)

        # Update edges slack
        for edge in self.itinerary.edges:
            if edge.source_id in node_arrival_times or edge.target_id in node_arrival_times:
                s_node = node_map.get(edge.source_id)
                s_fallback = time_to_minutes(s_node.end_time) if s_node else 0
                src_end = node_arrival_times.get(edge.source_id, s_fallback)
                t_node = node_map.get(edge.target_id)
                tgt_start = time_to_minutes(t_node.start_time) if t_node else 0
                edge.slack = tgt_start - (src_end + edge.min_connection_time + edge.transfer_duration)
                edge.is_breached = edge.slack < 0

        summary = (
            f"Disruption on '{disrupted_node.name}' (+{delay}m delay) cascades across {len(blast_radius)} downstream nodes. "
            f"Directly caused {len(missed_connections)} missed connections and placed {len(at_risk_reservations)} reservations at risk."
        )

        return DownstreamImpact(
            disrupted_node_id=disrupted_id,
            delay_minutes=delay,
            blast_radius_node_ids=blast_radius,
            missed_connection_node_ids=missed_connections,
            at_risk_reservation_ids=at_risk_reservations,
            total_downstream_delay=total_delay,
            estimated_financial_loss=financial_loss,
            domino_risk_index_before=self.itinerary.domino_risk_index,
            domino_risk_index_after=min(98.5, self.itinerary.domino_risk_index + 42.0),
            summary=summary
        )
