import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Info, Plane, Train, Building2, Key } from 'lucide-react';

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
      center: [23.8, 75.5],
      zoom: 5,
      waypoints: [
        {
          name: "Mumbai (BOM)",
          coords: [19.0896, 72.8656],
          type: "flight_origin",
          desc: "Chhatrapati Shivaji Maharaj International Airport (Flight BA 712 / AI 882)",
          status: activeDisruption ? "Delayed +45m" : "On-Time"
        },
        {
          name: "Delhi Airport (DEL)",
          coords: [28.5562, 77.1000],
          type: "transfer",
          desc: "Indira Gandhi International Airport — Ground Transit to NDLS",
          status: activeDisruption ? "Buffer Critical (10m)" : "Nominal"
        },
        {
          name: "New Delhi Railway (NDLS)",
          coords: [28.6415, 77.2194],
          type: "rail",
          desc: "New Delhi Railway Station — SBB / Vande Bharat connection to Jaipur",
          status: activeDisruption ? "Missed Dep 19:20" : "On-Time"
        },
        {
          name: "Jaipur (JAI)",
          coords: [26.9196, 75.7878],
          type: "hotel",
          desc: "Jaipur Destination & Boutique Hotel (Protected Check-in)",
          status: "Protected Arrival"
        }
      ],
      legs: [
        {
          from: [19.0896, 72.8656],
          to: [28.5562, 77.1000],
          type: "flight",
          label: "Flight: BOM → DEL",
          color: activeDisruption ? "#ef4444" : "#10b981",
          dashArray: "6, 8"
        },
        {
          from: [28.5562, 77.1000],
          to: [28.6415, 77.2194],
          type: "transfer",
          label: "Airport Express: DEL → NDLS",
          color: activeDisruption ? "#f59e0b" : "#3b82f6",
          dashArray: "3, 6"
        },
        {
          from: [28.6415, 77.2194],
          to: [26.9196, 75.7878],
          type: "rail",
          label: "Express Rail: NDLS → JAI",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          dashArray: "5, 5"
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
          type: "flight_origin",
          desc: "London Heathrow — BA 712",
          status: activeDisruption ? "Delayed +65m" : "On-Time"
        },
        {
          name: "Zurich (ZRH)",
          coords: [47.4582, 8.5555],
          type: "transfer",
          desc: "Zurich Kloten Airport Transit Shuttle",
          status: activeDisruption ? "Connection Breached" : "Slack +45m"
        },
        {
          name: "Visp (Rail Hub)",
          coords: [46.2933, 7.8817],
          type: "rail",
          desc: "SBB InterCity IC 8 transfer point",
          status: activeDisruption ? "Ghost Hold Active" : "Nominal"
        },
        {
          name: "Zermatt (Lodge)",
          coords: [45.9765, 7.7491],
          type: "hotel",
          desc: "Matterhorn Lodge Destination Anchor",
          status: "Late check-in preserved"
        }
      ],
      legs: [
        {
          from: [51.4700, -0.4543],
          to: [47.4582, 8.5555],
          type: "flight",
          label: "Flight: LHR → ZRH",
          color: activeDisruption ? "#ef4444" : "#10b981",
          dashArray: "6, 8"
        },
        {
          from: [47.4582, 8.5555],
          to: [46.2933, 7.8817],
          type: "rail",
          label: "SBB Rail: Zurich → Visp",
          color: activeDisruption ? "#dc2626" : "#6366f1",
          dashArray: "5, 5"
        },
        {
          from: [46.2933, 7.8817],
          to: [45.9765, 7.7491],
          type: "rail",
          label: "MGB Rail: Visp → Zermatt",
          color: activeDisruption ? "#f59e0b" : "#10b981",
          dashArray: "5, 5"
        }
      ]
    }
  };

  const currentRouteData = routes[selectedRoute];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize or re-center Leaflet Map
    if (!mapInstanceRef.current) {
      // Carto Basemaps URL template (Voyager Style)
      // Reference: https://carto.com/basemaps/apikey/
      const cartoTileUrl = cartoApiKey 
        ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoApiKey}`
        : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`;

      const map = L.map(mapContainerRef.current, {
        center: currentRouteData.center,
        zoom: currentRouteData.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Add Carto Basemap Tiles
      L.tileLayer(cartoTileUrl, {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add small custom zoom control bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(currentRouteData.center, currentRouteData.zoom);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers/lines
    const layersToClear = [];
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        layersToClear.push(layer);
      }
    });
    layersToClear.forEach(l => map.removeLayer(l));

    // Draw route lines
    currentRouteData.legs.forEach(leg => {
      const line = L.polyline([leg.from, leg.to], {
        color: leg.color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: leg.dashArray,
        lineCap: 'round'
      }).addTo(map);

      line.bindTooltip(leg.label, {
        permanent: false,
        direction: 'center',
        className: 'bg-[#181E4B] text-white text-[11px] font-mono px-2 py-0.5 rounded shadow-md'
      });
    });

    // Add Waypoint Markers
    currentRouteData.waypoints.forEach(wp => {
      const markerHtml = `
        <div class="relative flex items-center justify-center">
          <div class="w-7 h-7 rounded-full bg-white shadow-lg border-2 border-[#181E4B] flex items-center justify-center text-[#181E4B] font-bold text-xs">
            ${wp.name.split(' ')[0].charAt(0)}
          </div>
          <span class="absolute -bottom-5 whitespace-nowrap bg-white/95 px-2 py-0.5 rounded shadow-sm text-[10px] font-bold font-mono text-[#181E4B] border border-slate-200">
            ${wp.name}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-carto-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker(wp.coords, { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div class="font-poppins p-1 max-w-[200px]">
          <h4 class="font-bold text-xs text-[#181E4B]">${wp.name}</h4>
          <p class="text-[11px] text-slate-600 mt-1">${wp.desc}</p>
          <div class="mt-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
            Status: ${wp.status}
          </div>
        </div>
      `);
    });

  }, [selectedRoute, activeDisruption, cartoApiKey]);

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
      
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
            {cartoApiKey ? "API KEY ACTIVE" : ".ENV READY"}
          </span>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#10b981] inline-block" />
          <span>Flight Leg</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#6366f1] inline-block" />
          <span>Rail Corridor</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#181E4B] inline-block" />
          <span>Transit Vertex</span>
        </span>
      </div>

    </div>
  );
}
