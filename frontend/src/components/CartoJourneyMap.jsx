import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Train, Building2, MapPin, Layers, Navigation, AlertTriangle, CheckCircle2, CloudRain, Cloud, Sun } from 'lucide-react';
import { getApiUrl } from '../api';

const KNOWN_AIRPORT_COORDS = {
  // Indian Railway Hubs & Junctions
  ami: [20.9374, 77.7796],
  amravati: [20.9374, 77.7796],
  bsl: [21.0455, 75.8011],
  bhusaval: [21.0455, 75.8011],
  bhusawal: [21.0455, 75.8011],
  bd: [20.8569, 77.7289],
  badnera: [20.8569, 77.7289],
  ak: [20.7059, 77.0219],
  akola: [20.7059, 77.0219],
  wr: [20.7453, 78.6022],
  wardha: [20.7453, 78.6022],
  ngp: [21.1524, 79.0888],
  nagpur: [21.1524, 79.0888],
  nag: [21.1524, 79.0888],
  jl: [21.0077, 75.5626],
  jalgaon: [21.0077, 75.5626],
  mmr: [20.2520, 74.4410],
  manmad: [20.2520, 74.4410],
  nk: [19.9572, 73.8340],
  nashik: [19.9572, 73.8340],
  kyn: [19.2437, 73.1355],
  kalyan: [19.2437, 73.1355],
  tna: [19.1860, 72.9759],
  thane: [19.1860, 72.9759],
  dr: [19.0178, 72.8478],
  dadar: [19.0178, 72.8478],
  csmt: [18.9401, 72.8351],
  cst: [18.9401, 72.8351],
  bct: [18.9696, 72.8193],
  pune: [18.5284, 73.8744],
  pnq: [18.5822, 73.9197],
  bpl: [23.2684, 77.4126],
  bhopal: [23.2684, 77.4126],
  bho: [23.2875, 77.3374],
  et: [21.9213, 77.7554],
  itarsi: [21.9213, 77.7554],
  jbp: [23.1686, 79.9547],
  jabalpur: [23.1686, 79.9547],
  hwh: [22.5839, 88.3426],
  howrah: [22.5839, 88.3426],
  ccu: [22.5726, 88.3639],
  r: [21.2514, 81.6296],
  raipur: [21.2514, 81.6296],
  durg: [21.1904, 81.2849],
  bsp: [22.0797, 82.1409],
  bilaspur: [22.0797, 82.1409],
  ndls: [28.6415, 77.2194],
  delhi: [28.5562, 77.1000],
  del: [28.5562, 77.1000],
  mumbai: [19.0896, 72.8656],
  bom: [19.0896, 72.8656],
  blr: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  bengaluru: [12.9716, 77.5946],
  sbc: [12.9778, 77.5713],
  hyd: [17.2403, 78.4294],
  hyderabad: [17.2403, 78.4294],
  secunderabad: [17.4344, 78.5011],
  sc: [17.4344, 78.5011],
  jai: [26.9124, 75.7873],
  jaipur: [26.9124, 75.7873],
  jp: [26.9196, 75.7878],
  maa: [13.0827, 80.2707],
  chennai: [13.0827, 80.2707],
  mas: [13.0827, 80.2757],
  amd: [23.0734, 72.6347],
  ahmedabad: [23.0734, 72.6347],
  adi: [23.0232, 72.6006],
  st: [21.2049, 72.8407],
  surat: [21.2049, 72.8407],
  brc: [22.3107, 73.1812],
  vadodara: [22.3362, 73.2263],
  bdq: [22.3362, 73.2263],
  goi: [15.3800, 73.8318],
  cok: [10.1518, 76.3930],
  lko: [26.7606, 80.8893],
  ixc: [30.6735, 76.7885],
  vns: [25.4524, 82.8590],
  pat: [25.5913, 85.0880],
  atq: [31.7096, 74.7973],
  bbi: [20.2444, 85.8178],
  gau: [26.1061, 91.5859],
  idr: [22.7217, 75.8011],
  cjb: [11.0299, 77.0434],
  ixe: [12.9613, 74.8901],
  trv: [8.4821, 76.9200],
  vtz: [17.7215, 83.2245],
  sxr: [33.9871, 74.7741],
  bza: [16.5304, 80.7968],
  lhr: [51.4700, -0.4543],
  zrh: [47.4582, 8.5555],
  cdg: [49.0097, 2.5479],
  fra: [50.0379, 8.5622],
  dxb: [25.2532, 55.3657],
  sin: [1.3644, 103.9915],
  jfk: [40.6413, -73.7781],
  sfo: [37.6213, -122.3790],
  hnd: [35.5494, 139.7798]
};

function resolveCoords(name, coords, defaultFallback = [20.9374, 77.7796]) {
  if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number' && (coords.lat !== 0 || coords.lng !== 0)) {
    // Check if coordinates were accidentally set to the old blr/hyd defaults when name clearly indicates other stations
    const isOldBlrDefault = Math.abs(coords.lat - 12.9716) < 0.01 && Math.abs(coords.lng - 77.5946) < 0.01;
    const isOldHydDefault = Math.abs(coords.lat - 17.2403) < 0.01 && Math.abs(coords.lng - 78.4294) < 0.01;
    const lowerName = (name || '').toLowerCase();
    
    if ((isOldBlrDefault || isOldHydDefault) && !lowerName.includes('blr') && !lowerName.includes('bangalore') && !lowerName.includes('hyd') && !lowerName.includes('hyderabad')) {
      // Overwrite accidental default with genuine name lookup
      for (const [code, c] of Object.entries(KNOWN_AIRPORT_COORDS)) {
        if (lowerName.includes(code)) return c;
      }
    } else {
      return [coords.lat, coords.lng];
    }
  }
  if (!name) return defaultFallback;
  const lower = name.toLowerCase();
  for (const [code, c] of Object.entries(KNOWN_AIRPORT_COORDS)) {
    const rx = new RegExp(`\\b${code}\\b`, 'i');
    if (rx.test(lower) || lower.includes(code)) return c;
  }
  return defaultFallback;
}

export default function CartoJourneyMap({ 
  activeDisruption, 
  disruptedTicket, 
  disruptedTickets = [],
  itinerary,
  simulatedWeather = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite' | 'terrain' | 'carto'
  const hasUploaded = Boolean(disruptedTicket || (disruptedTickets && disruptedTickets.length > 0));
  const [selectedRoute, setSelectedRoute] = useState(hasUploaded ? 'uploaded' : 'empty');

  // Live weather state for map overlays
  const [waypointWeather, setWaypointWeather] = useState({}); // { hub: { condition, icon, precipitation_mm } }
  const [showWeatherRadar, setShowWeatherRadar] = useState(true);
  const [radarPath, setRadarPath] = useState(null);

  // Fetch real-time RainViewer weather radar timestamp
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(r => r.json())
      .then(data => {
        if (data?.radar?.past?.length > 0) {
          const latestPath = data.radar.past[data.radar.past.length - 1].path;
          setRadarPath(latestPath);
        }
      })
      .catch(() => {});
  }, []);


  // Synchronize when disruptedTicket or disruptedTickets change
  useEffect(() => {
    if (disruptedTicket || (disruptedTickets && disruptedTickets.length > 0)) {
      setSelectedRoute('uploaded');
    } else {
      setSelectedRoute('empty');
    }
  }, [disruptedTicket, disruptedTickets]);

  // Fetch live weather for each major waypoint hub
  useEffect(() => {
    const hubs = new Set();
    // From ticket origin/destination
    if (disruptedTicket?.origin) hubs.add(disruptedTicket.origin.split(' ')[0].toUpperCase());
    if (disruptedTicket?.destination) hubs.add(disruptedTicket.destination.split(' ')[0].toUpperCase());
    disruptedTickets.forEach(t => {
      if (t.origin) hubs.add(t.origin.split(' ')[0].toUpperCase());
      if (t.destination) hubs.add(t.destination.split(' ')[0].toUpperCase());
    });
    // Always add default route hubs
    ['BOM', 'DEL', 'LHR', 'ZRH'].forEach(h => hubs.add(h));

    const fetchAll = async () => {
      const results = {};
      for (const hub of Array.from(hubs).slice(0, 6)) {
        try {
          const res = await fetch(getApiUrl(`/api/weather/live?location=${encodeURIComponent(hub)}`));
          if (res.ok) {
            const data = await res.json();
            results[hub] = data;
          }
        } catch (_) {}
      }
      setWaypointWeather(results);
    };
    fetchAll();
  }, [disruptedTicket, disruptedTickets]);

  // Carto API Key from .env if user wants Carto layer

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY || '';

  // Dynamic route for uploaded document(s)
  const uploadedRoute = React.useMemo(() => {
    const ticketList = (disruptedTickets && disruptedTickets.length > 0) 
      ? disruptedTickets 
      : (disruptedTicket ? [disruptedTicket] : []);

    if (ticketList.length === 0) return null;

    if (ticketList.length > 1) {
      // Multi-leg journey across multiple uploaded documents
      const waypoints = [];
      const legs = [];
      const allCoords = [];

      ticketList.forEach((t, idx) => {
        const origName = t.origin || `Leg ${idx + 1} Origin`;
        const destName = t.destination || `Leg ${idx + 1} Destination`;
        const carrier = t.carrier || "Transit";
        const service = t.service_number || `Transit ${idx + 1}`;
        const delay = t.delay_minutes || 0;
        const isTrain = (carrier.toLowerCase().includes("rail") || carrier.toLowerCase().includes("train") || service.includes("#"));

        const oCoords = resolveCoords(origName, t.origin_coords, [12.9716, 77.5946]);
        const dCoords = resolveCoords(destName, t.dest_coords, [17.2403, 78.4294]);

        allCoords.push(oCoords);
        allCoords.push(dCoords);

        // Add Origin Waypoint if first leg or distinct
        if (idx === 0) {
          waypoints.push({
            id: 1,
            name: origName,
            coords: oCoords,
            type: isTrain ? "rail" : "flight",
            badge: isTrain ? "RAIL DEPARTURE" : "FLIGHT DEPARTURE",
            title: `${origName} Departure Terminal`,
            status: delay > 0 ? `Delayed +${delay}m` : "On Schedule",
            color: delay > 0 ? "#ea4335" : "#34a853",
            info: `${carrier} ${service} • Leg 1`
          });
        }

        // Add Destination Waypoint for this leg
        waypoints.push({
          id: waypoints.length + 1,
          name: destName,
          coords: dCoords,
          type: idx === ticketList.length - 1 ? "hotel" : "transfer",
          badge: idx === ticketList.length - 1 ? "FINAL DESTINATION" : "CONNECTION TRANSFER",
          title: `${destName} Terminal / Transfer Link`,
          status: idx === ticketList.length - 1 ? "Protected Arrival" : "Connection Window",
          color: idx === ticketList.length - 1 ? "#34a853" : "#fbbc05",
          info: `Leg ${idx + 1} Arrival • ${carrier} ${service}`
        });

        legs.push({
          from: oCoords,
          to: dCoords,
          label: `${service}: ${origName} → ${destName}`,
          color: delay > 0 ? "#ea4335" : "#4285f4",
          dashArray: "8, 8",
          weight: 4.5
        });
      });

      const avgLat = allCoords.reduce((acc, c) => acc + c[0], 0) / allCoords.length;
      const avgLng = allCoords.reduce((acc, c) => acc + c[1], 0) / allCoords.length;
      const firstOrigin = ticketList[0].origin || "Origin";
      const lastDest = ticketList[ticketList.length - 1].destination || "Destination";

      return {
        name: `${firstOrigin} ➔ ... ➔ ${lastDest}`,
        center: [avgLat, avgLng],
        zoom: 6,
        waypoints,
        legs
      };
    }

    // Single uploaded ticket
    const single = ticketList[0];
    const origName = single.origin || "Origin Hub";
    const destName = single.destination || "Destination Hub";
    const carrier = single.carrier || "Transit";
    const service = single.service_number || "Service";
    const actualDelay = typeof single.delay_minutes === 'number' ? single.delay_minutes : 0;
    const isDisrupted = actualDelay > 15 || Boolean(single.is_cancellation);
    const isPast = Boolean(single.is_past_journey);

    const origCoords = resolveCoords(origName, single.origin_coords, [20.9374, 77.7796]);
    const destCoords = resolveCoords(destName, single.dest_coords, [21.0455, 75.8011]);

    const isTrain = (carrier.toLowerCase().includes("rail") || carrier.toLowerCase().includes("train") || service.includes("#"));

    return {
      name: `${origName} → ${destName}`,
      center: [(origCoords[0] + destCoords[0]) / 2, (origCoords[1] + destCoords[1]) / 2],
      zoom: 7,
      waypoints: [
        {
          id: 1,
          name: origName,
          coords: origCoords,
          type: isTrain ? "rail" : "flight",
          badge: isTrain ? "RAIL DEPARTURE" : "FLIGHT DEPARTURE",
          title: `${origName} Departure Terminal`,
          status: isPast 
            ? "Journey Completed (Historical Run)" 
            : (isDisrupted ? `Delayed +${actualDelay}m` : "On Schedule (Running Right Time)"),
          color: isPast ? "#5E6282" : (isDisrupted ? "#ea4335" : "#34a853"),
          info: `${carrier} ${service} • ${isPast ? "Past Travel Document" : "Live Trajectory"}`
        },
        {
          id: 2,
          name: destName,
          coords: destCoords,
          type: isTrain ? "rail" : "transfer",
          badge: "DESTINATION TRANSIT",
          title: `${destName} Arrival Terminal / Station`,
          status: isPast 
            ? "Service Run Finished" 
            : (isDisrupted ? "Downstream Connection Alert" : "Connection Window Nominal"),
          color: isPast ? "#5E6282" : (isDisrupted ? "#fbbc05" : "#34a853"),
          info: isDisrupted ? `Buffer impacted by +${actualDelay}m delay` : "On schedule • Protected arrival"
        }
      ],
      legs: [
        {
          from: origCoords,
          to: destCoords,
          label: `${service}: ${origName} → ${destName}`,
          color: isPast ? "#84829A" : (isDisrupted ? "#ea4335" : "#4285f4"),
          dashArray: "8, 8",
          weight: 4.5
        }
      ]
    };
  }, [disruptedTicket, disruptedTickets]);

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

  const emptyRoute = {
    name: "Neutral Map",
    center: [21.5, 78.5],
    zoom: 5,
    waypoints: [],
    legs: []
  };

  const currentRouteData = uploadedRoute || (hasUploaded ? (routes[selectedRoute] || emptyRoute) : emptyRoute);

  // Tile layer generator matching user's requested Google Maps look
  const getTileConfig = (type) => {
    switch (type) {
      case 'satellite':
        return {
          url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20,
          maxNativeZoom: 20
        };
      case 'terrain':
        return {
          url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20,
          maxNativeZoom: 20
        };
      case 'carto':
        return {
          url: cartoApiKey 
            ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?api_key=${cartoApiKey}`
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd'],
          maxZoom: 20,
          maxNativeZoom: 19
        };
      case 'roadmap':
      default:
        // Google Maps Official Standard Roadmap Tiles
        return {
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          maxZoom: 20,
          maxNativeZoom: 20
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
      minZoom: 2,
      maxZoom: 20,
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer (Google Maps by default)
    L.tileLayer(tileConf.url, {
      subdomains: tileConf.subdomains,
      maxZoom: 20,
      maxNativeZoom: tileConf.maxNativeZoom || 20,
      errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC'
    }).addTo(map);

    // Live Precipitation & Cloud Weather Radar Layer (RainViewer Global Radar)
    // RainViewer API only produces tiles up to zoom level 12.
    // Setting maxNativeZoom: 12 instructs Leaflet to auto-scale tiles for zoom levels 13-20
    // completely eliminating the "zoom level not supported" tile error!
    if (showWeatherRadar && radarPath) {
      L.tileLayer(`https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`, {
        opacity: 0.70,
        minZoom: 1,
        maxNativeZoom: 12,
        maxZoom: 20,
        zIndex: 100,
        errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAAElFTkSuQmCC'
      }).addTo(map);
    }

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
        console.warn('fitBounds warning:', err);
      }
    }

    // ===== WEATHER OVERLAYS =====
    // Add floating weather emoji badges at each waypoint based on live Open-Meteo data or Digital Twin simulation
    if (currentRouteData.waypoints && currentRouteData.waypoints.length > 0) {
      currentRouteData.waypoints.forEach((wp) => {
        // Try to match this waypoint name to a hub key in waypointWeather
        const wpLower = (wp.name || '').toLowerCase();
        let weatherData = null;
        for (const [hub, wd] of Object.entries(waypointWeather)) {
          if (wpLower.includes(hub.toLowerCase()) || wpLower.includes(hub.slice(0, 3).toLowerCase())) {
            weatherData = wd;
            break;
          }
        }

        // Apply simulated weather from Digital Twin if active
        if (simulatedWeather) {
          const simRain = simulatedWeather.rainfall ?? 0;
          const simTemp = simulatedWeather.temperature ?? 24;
          const simWind = simulatedWeather.windSpeed ?? 20;

          if (simTemp <= 0) {
            weatherData = {
              condition: 'Snowfall / Blizzard',
              precipitation_mm: simRain,
              temperature_c: simTemp,
              wind_speed_kmh: simWind
            };
          } else if (simRain > 40) {
            weatherData = {
              condition: 'Severe Thunderstorm',
              precipitation_mm: simRain,
              temperature_c: simTemp,
              wind_speed_kmh: simWind
            };
          } else if (simRain > 0) {
            weatherData = {
              condition: 'Rain / Downpour',
              precipitation_mm: simRain,
              temperature_c: simTemp,
              wind_speed_kmh: simWind
            };
          } else {
            weatherData = {
              condition: 'Clear Sky',
              precipitation_mm: 0,
              temperature_c: simTemp,
              wind_speed_kmh: simWind
            };
          }
        } else if (!weatherData) {
          weatherData = waypointWeather['BOM'] || { condition: 'Clear Sky', temperature_c: 28, precipitation_mm: 0 };
        }

        const cond = (weatherData.condition || '').toLowerCase();
        const isSnow = cond.includes('snow') || cond.includes('blizzard') || cond.includes('sleet') || (weatherData.temperature_c <= 0);
        const isStorm = cond.includes('thunder') || cond.includes('storm');
        const isRain = cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower') || (weatherData.precipitation_mm > 0);
        const isCloudy = cond.includes('cloud') || cond.includes('overcast') || cond.includes('fog') || cond.includes('mist');
        const isClear = cond.includes('clear') || cond.includes('sunny');

        let emoji = '⛅';
        let bgColor = '#f0f9ff';
        let borderColor = '#bae6fd';
        let extraText = '';

        if (isStorm)  { emoji = '⛈️'; bgColor = '#fdf4ff'; borderColor = '#e879f9'; extraText = `${weatherData.precipitation_mm}mm/h`; }
        else if (isSnow)  { emoji = '❄️'; bgColor = '#eff6ff'; borderColor = '#93c5fd'; extraText = `Snow ${Math.round(weatherData.temperature_c)}°C`; }
        else if (isRain)  { emoji = '🌧️'; bgColor = '#eff6ff'; borderColor = '#60a5fa'; extraText = `${weatherData.precipitation_mm}mm/h`; }
        else if (isCloudy){ emoji = '☁️'; bgColor = '#f8fafc'; borderColor = '#cbd5e1'; extraText = 'Cloudy'; }
        else if (isClear) { emoji = '☀️'; bgColor = '#fffbeb'; borderColor = '#fcd34d'; extraText = `${Math.round(weatherData.temperature_c || 0)}°C`; }

        const weatherHtml = `
          <div style="
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: ${bgColor};
            border: 1.5px solid ${borderColor};
            border-radius: 10px;
            padding: 3px 8px 3px 6px;
            font-size: 13px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            font-family: system-ui, sans-serif;
            pointer-events: none;
          ">
            <span style="font-size:16px;">${emoji}</span>
            <span style="font-size:11px; font-weight:800; color:#1f2937;">${extraText}</span>
          </div>
        `;

        // Draw atmospheric weather halo around affected waypoints (clouds, rain, snow)
        if (showWeatherRadar) {
          let haloColor = '#3b82f6';
          let haloFill = '#93c5fd';
          let haloOpacity = 0.25;
          let haloRadius = 28000; // meters

          if (isStorm) {
            haloColor = '#9333ea';
            haloFill = '#c084fc';
            haloOpacity = 0.35;
            haloRadius = 38000;
          } else if (isSnow) {
            haloColor = '#0284c7';
            haloFill = '#bae6fd';
            haloOpacity = 0.32;
            haloRadius = 32000;
          } else if (isRain) {
            haloColor = '#2563eb';
            haloFill = '#60a5fa';
            haloOpacity = 0.30;
            haloRadius = 30000;
          } else if (isCloudy) {
            haloColor = '#64748b';
            haloFill = '#cbd5e1';
            haloOpacity = 0.22;
            haloRadius = 25000;
          } else if (isClear) {
            haloColor = '#eab308';
            haloFill = '#fef08a';
            haloOpacity = 0.20;
            haloRadius = 22000;
          }

          L.circle(wp.coords, {
            radius: haloRadius,
            color: haloColor,
            weight: 1.5,
            fillColor: haloFill,
            fillOpacity: haloOpacity,
            dashArray: isRain || isStorm ? '4, 4' : null,
            interactive: false
          }).addTo(map);
        }

        // Place weather badge slightly offset from the waypoint
        const weatherIcon = L.divIcon({
          html: weatherHtml,
          className: 'weather-overlay-badge',
          iconSize: [85, 30],
          iconAnchor: [-10, 56]
        });

        L.marker(wp.coords, { icon: weatherIcon, interactive: false }).addTo(map);
      });
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
  }, [selectedRoute, activeDisruption, mapType, cartoApiKey, uploadedRoute, waypointWeather, simulatedWeather, showWeatherRadar, radarPath]);


  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
      
      {/* Top Google Maps Bar: Map Layer Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-2 pointer-events-none">

        {/* Live Weather Radar Toggle Button */}
        <div className="pointer-events-auto flex items-center bg-white shadow-md border border-slate-200 rounded-xl px-1 py-1 text-xs">
          <button
            onClick={() => setShowWeatherRadar(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg font-sans font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
              showWeatherRadar ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 bg-white'
            }`}
            title="Toggle Live Precipitation Weather Radar & Clouds (RainViewer API)"
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather Radar</span>
            <span className={`w-1.5 h-1.5 rounded-full ${showWeatherRadar ? 'bg-emerald-300 animate-ping' : 'bg-slate-300'}`} />
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

      {/* Bottom Google Maps Legend Bar / Cleared Status Indicator */}
      {currentRouteData.waypoints && currentRouteData.waypoints.length > 0 ? (
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
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/80">
            <span title="Clear Sky">☀️ Clear</span>
            <span className="text-slate-300">•</span>
            <span title="Precipitation / Rain">🌧️ Rain</span>
            <span className="text-slate-300">•</span>
            <span title="Snowfall / Frost">❄️ Snow</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-[11px]">
            Click pins to view timing &amp; connection status
          </span>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-sans text-slate-600 flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-[11px]">Map Ready • No active ticket markings</span>
        </div>
      )}

    </div>
  );
}
