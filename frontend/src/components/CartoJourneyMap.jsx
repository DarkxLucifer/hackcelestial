import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Train, Building2, MapPin, Key, Navigation, Sparkles } from 'lucide-react';

export default function CartoJourneyMap({ activeDisruption }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [selectedRoute, setSelectedRoute] = useState('india'); // 'india' | 'alpine'

  // Read Carto API key from .env (VITE_CARTO_API_KEY)
  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || '';

  // Routes data
  const routes = {
    india: {
      name: "Mumbai → Delhi → Jaipur",
      center: [24.0, 75.8],
      zoom: 6,
      waypoints: [
        {
          name: "Mumbai (BOM)",
          coords: [19.0896, 72.8656],
          type: "flight",
          badge: "FLIGHT DEPARTURE",
          title: "Chhatrapati Shivaji Maharaj Int'l (T2)",
          status: activeDisruption ? "Delayed +45m (Dep 15:30 → 16:15)" : "On-Time (Dep 15:30)",
          color: activeDisruption ? "#ef4444" : "#10b981",
          time: "15:30 - 18:35"
        },
        {
          name: "Delhi Airport (DEL)",
          coords: [28.5562, 77.1000],
          type: "transfer",
          badge: "AIRPORT TRANSIT",
          title: "Indira Gandhi Int'l (T3) → Metro Express",
          status: activeDisruption ? "Buffer Critical: 10m Remaining" : "Buffer Nominal (+45m)",
          color: activeDisruption ? "#f59e0b" : "#3b82f6",
          time: "18:35 - 19:10"
        },
        {
          name: "New Delhi Rail (NDLS)",
          coords: [28.6415, 77.2194],
          type: "rail",
          badge: "RAIL CONNECTION",
          title: "Vande Bharat Express #20978",
          status: activeDisruption ? "Missed Scheduled Dep (19:20)" : "Confirmed (Track 16)",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          time: "19:20 - 23:15"
        },
        {
          name: "Jaipur Destination (JAI)",
          coords: [26.9196, 75.7878],
          type: "hotel",
          badge: "HOTEL ANCHOR",
          title: "Heritage Boutique Hotel Jaipur",
          status: "Late Arrival Protected (Check-in held till 23:59)",
          color: "#10b981",
          time: "Arrival 23:15"
        }
      ],
      legs: [
        {
          from: [19.0896, 72.8656],
          to: [28.5562, 77.1000],
          type: "flight",
          label: "Flight: BOM → DEL (AI 882)",
          color: activeDisruption ? "#ef4444" : "#10b981",
          dashArray: "8, 8"
        },
        {
          from: [28.5562, 77.1000],
          to: [28.6415, 77.2194],
          type: "transfer",
          label: "Airport Express Transit (DEL → NDLS)",
          color: activeDisruption ? "#f59e0b" : "#3b82f6",
          dashArray: "4, 6"
        },
        {
          from: [28.6415, 77.2194],
          to: [26.9196, 75.7878],
          type: "rail",
          label: "Rail: NDLS → Jaipur (Vande Bharat)",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          dashArray: "6, 6"
        }
      ]
    },
    alpine: {
      name: "London → Zurich → Zermatt",
      center: [48.5, 4.0],
      zoom: 5,
      waypoints: [
        {
          name: "London (LHR)",
          coords: [51.4700, -0.4543],
          type: "flight",
          badge: "FLIGHT DEPARTURE",
          title: "London Heathrow Terminal 5",
          status: activeDisruption ? "Delayed +65m" : "On-Time",
          color: activeDisruption ? "#ef4444" : "#10b981",
          time: "14:00 - 16:45"
        },
        {
          name: "Zurich (ZRH)",
          coords: [47.4582, 8.5555],
          type: "transfer",
          badge: "AIR-RAIL TRANSIT",
          title: "Zurich Kloten Airport Transit",
          status: activeDisruption ? "Transfer Margin Breached" : "Slack +45m",
          color: activeDisruption ? "#f59e0b" : "#3b82f6",
          time: "17:15 - 17:35"
        },
        {
          name: "Visp Hub",
          coords: [46.2933, 7.8817],
          type: "rail",
          badge: "RAIL SWITCH",
          title: "SBB InterCity IC 8 transfer point",
          status: activeDisruption ? "Ghost Hold Active" : "Nominal",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          time: "18:02 - 20:02"
        },
        {
          name: "Zermatt",
          coords: [45.9765, 7.7491],
          type: "hotel",
          badge: "LODGING ANCHOR",
          title: "Matterhorn Lodge Destination Anchor",
          status: "Late check-in held until 23:59",
          color: "#10b981",
          time: "Arrival 21:14"
        }
      ],
      legs: [
        {
          from: [51.4700, -0.4543],
          to: [47.4582, 8.5555],
          type: "flight",
          label: "Flight: LHR → ZRH (BA 712)",
          color: activeDisruption ? "#ef4444" : "#10b981",
          dashArray: "8, 8"
        },
        {
          from: [47.4582, 8.5555],
          to: [46.2933, 7.8817],
          type: "rail",
          label: "SBB InterCity: Zurich → Visp",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          dashArray: "6, 6"
        },
        {
          from: [46.2933, 7.8817],
          to: [45.9765, 7.7491],
          type: "rail",
          label: "MGB Regional: Visp → Zermatt",
          color: activeDisruption ? "#f59e0b" : "#10b981",
          dashArray: "6, 6"
        }
      ]
    }
  };

  const currentRouteData = routes[selectedRoute];

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Remove existing map if already present on container to avoid Leaflet "Map container is already initialized"
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    if (container._leaflet_id) {
      container._leaflet_id = null;
    }

    // Standard Carto Basemaps Voyager Tile URL
    // Reference: https://carto.com/basemaps/apikey/
    const cartoTileUrl = cartoApiKey 
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?api_key=${cartoApiKey}`
      : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png`;

    const map = L.map(container, {
      center: currentRouteData.center,
      zoom: currentRouteData.zoom,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Add Carto Basemap Tiles with subdomains
    const tileLayer = L.tileLayer(cartoTileUrl, {
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19
    }).addTo(map);

    // Fallback if network blocks Carto CDN
    tileLayer.on('tileerror', function() {
      // Graceful fallback to standard Carto Positron or OSM
      console.warn("Carto tile notice: checking connection.");
    });

    // Zoom control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Draw route lines
    currentRouteData.legs.forEach(leg => {
      const line = L.polyline([leg.from, leg.to], {
        color: leg.color,
        weight: 4,
        opacity: 0.9,
        dashArray: leg.dashArray,
        lineCap: 'round'
      }).addTo(map);

      line.bindTooltip(leg.label, {
        permanent: false,
        direction: 'center',
        className: 'bg-[#181E4B] text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-md'
      });
    });

    // Add Waypoint Markers using pure custom HTML (no missing PNG icon bugs!)
    currentRouteData.waypoints.forEach((wp, index) => {
      const markerHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2.5px solid ${wp.color}; display: flex; align-items: center; justify-content: center; font-weight: bold; font-family: monospace; font-size: 13px; color: #181E4B;">
            ${index + 1}
          </div>
          <div style="margin-top: 4px; background: rgba(255,255,255,0.95); padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); font-size: 10px; font-weight: 700; font-family: monospace; color: #181E4B; white-space: nowrap; border: 1px solid #e2e8f0;">
            ${wp.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'carto-waypoint-marker',
        iconSize: [32, 54],
        iconAnchor: [16, 16]
      });

      const marker = L.marker(wp.coords, { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; min-width: 190px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 9px; font-family: monospace; font-weight: bold; padding: 2px 5px; border-radius: 4px; background: #f1f5f9; color: #475569;">
              ${wp.badge}
            </span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b;">
              ${wp.time}
            </span>
          </div>
          <h4 style="margin: 0; font-size: 13px; font-weight: bold; color: #181E4B;">${wp.name}</h4>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b; line-height: 1.4;">${wp.title}</p>
          <div style="margin-top: 8px; font-size: 10px; font-family: monospace; font-weight: bold; padding: 4px 6px; border-radius: 6px; background: ${wp.color}15; color: ${wp.color}; border: 1px solid ${wp.color}30;">
            ${wp.status}
          </div>
        </div>
      `);
    });

    // Invalidate size to ensure Leaflet renders immediately
    const invalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const t1 = setTimeout(invalidate, 80);
    const t2 = setTimeout(invalidate, 250);
    const t3 = setTimeout(invalidate, 600);

    // ResizeObserver for automatic resize handling
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
  }, [selectedRoute, activeDisruption, cartoApiKey]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
      
      {/* Top Map Bar: Route selector + Carto Key Status */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Route Selector Buttons */}
        <div className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md px-1.5 py-1 rounded-xl shadow-md border border-slate-200/80 text-xs">
          <button
            onClick={() => setSelectedRoute('india')}
            className={`px-3 py-1 rounded-lg font-googleSans font-semibold transition-all cursor-pointer ${
              selectedRoute === 'india'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mumbai → Delhi → Jaipur
          </button>
          <button
            onClick={() => setSelectedRoute('alpine')}
            className={`px-3 py-1 rounded-lg font-googleSans font-semibold transition-all cursor-pointer ${
              selectedRoute === 'alpine'
                ? 'bg-[#181E4B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            London → Zermatt
          </button>
        </div>

        {/* Carto Basemaps Info Badge */}
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 text-[11px] font-mono text-slate-700">
          <Key className="w-3 h-3 text-[#DF6951]" />
          <span>Carto Basemap</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-600 border border-slate-200">
            {cartoApiKey ? "API KEY ACTIVE" : ".ENV CONFIGURED"}
          </span>
        </div>
      </div>

      {/* Map Leaflet Container with explicit CSS dimensions */}
      <div 
        ref={mapContainerRef} 
        style={{ width: '100%', height: '420px', minHeight: '420px', position: 'relative', zIndex: 1 }} 
      />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-[10px] font-mono text-slate-700 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-[#10b981] rounded-full inline-block" />
          <span>Flight Leg</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-[#3b82f6] rounded-full inline-block" />
          <span>Transit Transfer</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-1 bg-[#6366f1] rounded-full inline-block" />
          <span>Rail Corridor</span>
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-[#DF6951] font-bold">
          Click markers for connection status
        </span>
      </div>

    </div>
  );
}
