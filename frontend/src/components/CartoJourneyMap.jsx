import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Train, Building2, MapPin, Layers, Navigation, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CartoJourneyMap({ activeDisruption, disruptedTicket, itinerary }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'terrain' | 'carto'
  const [selectedRoute, setSelectedRoute] = useState(disruptedTicket ? 'uploaded' : 'india');

  // Synchronize when disruptedTicket changes
  useEffect(() => {
    if (disruptedTicket) {
      setSelectedRoute('uploaded');
    }
  }, [disruptedTicket]);

  // Carto API Key from .env if user wants Carto layer
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || '';

  // Dynamic route for uploaded document
  const uploadedRoute = React.useMemo(() => {
    if (!disruptedTicket) return null;
    const origName = disruptedTicket.origin || "Origin Hub";
    const destName = disruptedTicket.destination || "Destination Hub";
    const carrier = disruptedTicket.carrier || "Transit";
    const service = disruptedTicket.service_number || "Service";
    const delay = disruptedTicket.delay_minutes || 45;

    const origLat = disruptedTicket.origin_coords?.lat ?? 19.0896;
    const origLng = disruptedTicket.origin_coords?.lng ?? 72.8656;
    const destLat = disruptedTicket.dest_coords?.lat ?? 28.5562;
    const destLng = disruptedTicket.dest_coords?.lng ?? 77.1000;

    const isTrain = (carrier.toLowerCase().includes("rail") || carrier.toLowerCase().includes("train") || service.includes("#"));

    return {
      name: `${origName} → ${destName}`,
      center: [(origLat + destLat) / 2, (origLng + destLng) / 2],
      zoom: 6,
      waypoints: [
        {
          id: 1,
          name: origName,
          coords: [origLat, origLng],
          type: isTrain ? "rail" : "flight",
          badge: isTrain ? "RAIL DEPARTURE" : "FLIGHT DEPARTURE",
          title: `${origName} Terminal`,
          status: `Delayed +${delay}m (Disruption Reported)`,
          color: "#ea4335",
          info: `${carrier} ${service} • Uploaded Document`
        },
        {
          id: 2,
          name: destName,
          coords: [destLat, destLng],
          type: isTrain ? "rail" : "transfer",
          badge: "DESTINATION TRANSIT",
          title: `${destName} Arrival Station / Airport`,
          status: "Downstream Connection Alert",
          color: "#fbbc05",
          info: `Buffer impacted by +${delay}m delay`
        }
      ],
      legs: [
        {
          from: [origLat, origLng],
          to: [destLat, destLng],
          label: `${service}: ${origName} → ${destName}`,
          color: "#ea4335",
          dashArray: "8, 8",
          weight: 4.5
        }
      ]
    };
  }, [disruptedTicket]);

  // Multi-modal routes data
  const routes = {
    india: {
      name: "Mumbai → Delhi → Jaipur",
      center: [23.5, 75.8],
      zoom: 6,
      waypoints: [
        {
          id: 1,
          name: "Mumbai (BOM)",
          coords: [19.0896, 72.8656],
          type: "flight",
          badge: "FLIGHT DEPARTURE",
          title: "Chhatrapati Shivaji Maharaj Int'l (T2)",
          status: activeDisruption ? "Delayed +45m (ETA 18:35)" : "On-Time (Dep 15:30)",
          color: activeDisruption ? "#ea4335" : "#34a853",
          info: "Air India AI 882 • Gate 44 • A321neo"
        },
        {
          id: 2,
          name: "Delhi Airport (DEL)",
          coords: [28.5562, 77.1000],
          type: "transfer",
          badge: "AIRPORT METRO",
          title: "Indira Gandhi Int'l T3 → NDLS Metro",
          status: activeDisruption ? "Buffer Critical (10m left)" : "Buffer Nominal (+45m)",
          color: activeDisruption ? "#fbbc05" : "#4285f4",
          info: "Airport Express Line • Travel time 55m"
        },
        {
          id: 3,
          name: "New Delhi Rail (NDLS)",
          coords: [28.6415, 77.2194],
          type: "rail",
          badge: "RAIL CONNECTION",
          title: "New Delhi Railway Station",
          status: activeDisruption ? "Connection at Risk (Dep 19:20)" : "Confirmed (Track 16)",
          color: activeDisruption ? "#ea4335" : "#4285f4",
          info: "Vande Bharat Express #20978 to Jaipur"
        },
        {
          id: 4,
          name: "Jaipur (JAI)",
          coords: [26.9196, 75.7878],
          type: "hotel",
          badge: "HOTEL ANCHOR",
          title: "Heritage Boutique Hotel Jaipur",
          status: "Late Arrival Protected (Held till 23:59)",
          color: "#34a853",
          info: "2 Nights • Check-in preserved via Concierge API"
        }
      ],
      legs: [
        {
          from: [19.0896, 72.8656],
          to: [28.5562, 77.1000],
          label: "Flight: BOM → DEL",
          color: activeDisruption ? "#ea4335" : "#34a853",
          dashArray: "8, 8",
          weight: 4
        },
        {
          from: [28.5562, 77.1000],
          to: [28.6415, 77.2194],
          label: "Airport Express: DEL → NDLS",
          color: activeDisruption ? "#fbbc05" : "#4285f4",
          dashArray: "4, 6",
          weight: 4
        },
        {
          from: [28.6415, 77.2194],
          to: [26.9196, 75.7878],
          label: "Rail: NDLS → Jaipur Junction",
          color: activeDisruption ? "#ea4335" : "#4285f4",
          dashArray: "6, 6",
          weight: 4.5
        }
      ]
    },
    alpine: {
      name: "London → Zurich → Zermatt",
      center: [48.5, 4.0],
      zoom: 5,
      waypoints: [
        {
          id: 1,
          name: "London (LHR)",
          coords: [51.4700, -0.4543],
          type: "flight",
          badge: "FLIGHT DEPARTURE",
          title: "London Heathrow Terminal 5",
          status: activeDisruption ? "Delayed +65m" : "On-Time",
          color: activeDisruption ? "#ea4335" : "#34a853",
          info: "British Airways BA 712"
        },
        {
          id: 2,
          name: "Zurich (ZRH)",
          coords: [47.4582, 8.5555],
          type: "transfer",
          badge: "AIR-RAIL TRANSIT",
          title: "Zurich Kloten Airport Station",
          status: activeDisruption ? "Transfer Margin Breached" : "Slack +45m",
          color: activeDisruption ? "#fbbc05" : "#4285f4",
          info: "Transit to Zurich HB"
        },
        {
          id: 3,
          name: "Visp Hub",
          coords: [46.2933, 7.8817],
          type: "rail",
          badge: "RAIL SWITCH",
          title: "SBB InterCity IC 8 transfer point",
          status: activeDisruption ? "Ghost Hold Active" : "Nominal",
          color: activeDisruption ? "#ea4335" : "#4285f4",
          info: "Connection to Matterhorn Gotthard Bahn"
        },
        {
          id: 4,
          name: "Zermatt",
          coords: [45.9765, 7.7491],
          type: "hotel",
          badge: "LODGING ANCHOR",
          title: "Matterhorn Lodge Destination Anchor",
          status: "Late check-in held until 23:59",
          color: "#34a853",
          info: "Check-in window secured"
        }
      ],
      legs: [
        {
          from: [51.4700, -0.4543],
          to: [47.4582, 8.5555],
          label: "Flight: LHR → ZRH (BA 712)",
          color: activeDisruption ? "#ea4335" : "#34a853",
          dashArray: "8, 8",
          weight: 4
        },
        {
          from: [47.4582, 8.5555],
          to: [46.2933, 7.8817],
          label: "SBB Rail: Zurich → Visp",
          color: activeDisruption ? "#ea4335" : "#4285f4",
          dashArray: "6, 6",
          weight: 4
        },
        {
          from: [46.2933, 7.8817],
          to: [45.9765, 7.7491],
          label: "MGB Regional: Visp → Zermatt",
          color: activeDisruption ? "#fbbc05" : "#34a853",
          dashArray: "6, 6",
          weight: 4
        }
      ]
    },
    ...(uploadedRoute ? { uploaded: uploadedRoute } : {})
  };

  const currentRouteData = routes[selectedRoute] || (uploadedRoute || routes.india);

  // Tile layer generator matching user's requested Google Maps look
  const getTileConfig = (type) => {
    switch (type) {
      case 'satellite':
        return {
          url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20
        };
      case 'terrain':
        return {
          url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20
        };
      case 'carto':
        return {
          url: cartoApiKey 
            ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?api_key=${cartoApiKey}`
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          maxZoom: 19
        };
      case 'roadmap':
      default:
        // Google Maps Official Standard Roadmap Tiles
        return {
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20
        };
    }
  };

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Destroy existing Leaflet map safely to prevent "Map container is already initialized"
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    const tileConf = getTileConfig(mapType);

    const map = L.map(container, {
      center: currentRouteData.center,
      zoom: currentRouteData.zoom,
      minZoom: 3,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer (Google Maps by default)
    L.tileLayer(tileConf.url, {
      subdomains: tileConf.subdomains,
      maxZoom: tileConf.maxZoom
    }).addTo(map);

    // Google Maps Style Zoom Controls (Bottom Right)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Draw Route Polylines
    currentRouteData.legs.forEach(leg => {
      const line = L.polyline([leg.from, leg.to], {
        color: leg.color,
        weight: leg.weight,
        opacity: 0.9,
        dashArray: leg.dashArray,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      line.bindTooltip(leg.label, {
        permanent: false,
        direction: 'center',
        className: 'bg-white text-[#181E4B] text-[11px] font-sans font-semibold px-2.5 py-1 rounded-md shadow-md border border-slate-200'
      });
    });

    // Add Google Maps Style Markers (Classic teardrop pin with white circle & number)
    currentRouteData.waypoints.forEach((wp) => {
      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(0, -100%);">
          <!-- Google Maps Teardrop Pin -->
          <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
            <path d="M17 0C7.61116 0 0 7.61116 0 17C0 29.75 17 46 17 46C17 46 34 29.75 34 17C34 7.61116 26.3888 0 17 0Z" fill="${wp.color}"/>
            <circle cx="17" cy="16" r="9" fill="white"/>
            <text x="17" y="20" font-size="12" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" fill="#181E4B" text-anchor="middle">${wp.id}</text>
          </svg>
          <!-- Label Pill -->
          <div style="margin-top: 2px; background: #ffffff; padding: 2px 7px; border-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.25); font-size: 11px; font-weight: 700; font-family: system-ui, sans-serif; color: #1f2937; white-space: nowrap; border: 1px solid #e5e7eb;">
            ${wp.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'google-maps-pin-marker',
        iconSize: [34, 46],
        iconAnchor: [17, 46]
      });

      const marker = L.marker(wp.coords, { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 6px 2px; min-width: 210px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; background: #f3f4f6; color: #374151;">
              ${wp.badge}
            </span>
            <span style="font-size: 11px; font-weight: 600; color: #4b5563;">
              Stop ${wp.id} of 4
            </span>
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #111827;">${wp.name}</h4>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #4b5563; line-height: 1.4;">${wp.title}</p>
          <div style="margin-top: 8px; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; background: ${wp.color}15; color: ${wp.color}; border: 1px solid ${wp.color}35;">
            ${wp.status}
          </div>
          <div style="margin-top: 6px; font-size: 11px; color: #6b7280;">
            ${wp.info}
          </div>
        </div>
      `);
    });

    // Auto-fit bounds to waypoints so map dynamically centers and zooms to the route
    if (currentRouteData.waypoints && currentRouteData.waypoints.length > 0) {
      try {
        const bounds = L.latLngBounds(currentRouteData.waypoints.map(wp => wp.coords));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
      } catch (err) {
        console.warn("fitBounds warning:", err);
      }
    }

    // Automatic Invalidate Size for Instant Render
    const invalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const t1 = setTimeout(invalidate, 50);
    const t2 = setTimeout(invalidate, 200);
    const t3 = setTimeout(invalidate, 500);

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        invalidate();
      });
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedRoute, activeDisruption, mapType, cartoApiKey, uploadedRoute]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      
      {/* Top Google Maps Bar: Route & Style Controls */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Route Selector (Google style rounded card) */}
        <div className="pointer-events-auto flex items-center bg-white shadow-md border border-slate-200 rounded-xl px-1.5 py-1 text-xs">
          {uploadedRoute && (
            <button
              onClick={() => setSelectedRoute('uploaded')}
              className={`px-3 py-1.5 rounded-lg font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedRoute === 'uploaded'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ticket: {uploadedRoute.name}</span>
            </button>
          )}
          <button
            onClick={() => setSelectedRoute('india')}
            className={`px-3 py-1.5 rounded-lg font-sans font-semibold transition-all cursor-pointer ${
              selectedRoute === 'india'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mumbai → Delhi → Jaipur
          </button>
          <button
            onClick={() => setSelectedRoute('alpine')}
            className={`px-3 py-1.5 rounded-lg font-sans font-semibold transition-all cursor-pointer ${
              selectedRoute === 'alpine'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            London → Zermatt
          </button>
        </div>

        {/* Map Layer Switcher (Google Roadmap / Satellite / Terrain) */}
        <div className="pointer-events-auto flex items-center bg-white shadow-md border border-slate-200 rounded-xl px-1 py-1 text-xs">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg font-sans font-semibold text-[11px] transition-all cursor-pointer ${
              mapType === 'roadmap' ? 'bg-[#181E4B] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Google Maps Roadmap view"
          >
            Map
          </button>
          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg font-sans font-semibold text-[11px] transition-all cursor-pointer ${
              mapType === 'satellite' ? 'bg-[#181E4B] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Google Satellite view"
          >
            Satellite
          </button>
          <button
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg font-sans font-semibold text-[11px] transition-all cursor-pointer ${
              mapType === 'terrain' ? 'bg-[#181E4B] text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Google Terrain view"
          >
            Terrain
          </button>
        </div>

      </div>

      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '440px', minHeight: '440px', position: 'relative', zIndex: 1 }} 
      />

      {/* Bottom Google Maps Legend Bar */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-sans text-slate-700 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 bg-[#34a853] rounded-full inline-block" />
          <span className="font-medium text-[11px]">Flight Leg</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-1.5 bg-[#4285f4] rounded-full inline-block" />
          <span className="font-medium text-[11px]">Transit &amp; Rail</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-500 text-[11px]">
          Click Google Map pins to view timing &amp; connection status
        </span>
      </div>

    </div>
  );
}
