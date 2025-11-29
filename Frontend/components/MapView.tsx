
import React, { useEffect, useRef } from 'react';
import { Product } from '../types';
import { Loader2 } from 'lucide-react';

// Declare Leaflet global
declare const L: any;

interface MapViewProps {
  products: Product[];
  userLocation: { lat: number; lng: number } | null;
  onSelectStore: (storeName: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ products, userLocation, onSelectStore }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center (Warsaw) if no user location yet
    const initialLat = userLocation ? userLocation.lat : 52.2297;
    const initialLng = userLocation ? userLocation.lng : 21.0122;
    const initialZoom = 13;

    // Initialize Map if not already done
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], initialZoom);

      // Use CartoDB Positron (Light/Clean) tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      // Custom Zoom Control
      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current);
    } else {
      // If map exists and user location changes, fly to it
      if (userLocation) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14);
      }
    }

    // --- Add Markers ---
    
    // Clear existing layers first
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // 1. User Marker (Clean Blue Pulse)
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-icon',
        html: `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="
              position: absolute; top: 0; left: 0; width: 100%; height: 100%;
              background-color: #2563eb; 
              border-radius: 50%; 
              opacity: 0.3;
              animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            "></div>
            <div style="
              position: absolute; top: 6px; left: 6px; width: 12px; height: 12px;
              background-color: #2563eb; 
              border-radius: 50%; 
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            "></div>
          </div>
          <style>
            @keyframes pulse-ring {
              0% { transform: scale(0.8); opacity: 0.5; }
              100% { transform: scale(2.5); opacity: 0; }
            }
          </style>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 })
        .addTo(mapInstanceRef.current)
        .bindPopup("<b>To Ty</b><br>Jesteś tutaj.");
    }

    // 2. Store Markers (Paper Labels)
    const stores = new Map();
    products.forEach(p => {
      if (p.coordinates && !stores.has(p.storeName)) {
        stores.set(p.storeName, { 
          name: p.storeName, 
          location: p.storeLocation,
          coords: p.coordinates 
        });
      }
    });

    stores.forEach((store) => {
      // Create a "Paper Label" style marker
      const storeIcon = L.divIcon({
        className: 'paper-label-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            
            <!-- The Dot on the map -->
            <div style="
              width: 12px; 
              height: 12px; 
              background: #d94e33; 
              border: 2px solid #2d2a26; 
              border-radius: 50%;
              box-shadow: 1px 1px 0px rgba(0,0,0,0.2);
            "></div>
            
            <!-- The Label -->
            <div style="
              background: #fdfbf7;
              border: 1px solid #2d2a26;
              padding: 4px 8px;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: bold;
              font-size: 11px;
              color: #2d2a26;
              box-shadow: 3px 3px 0px rgba(45,42,38,1);
              white-space: nowrap;
              transform: rotate(-2deg);
            ">
              ${store.name}
            </div>
          </div>
        `,
        iconSize: [120, 30], // Approximate size
        iconAnchor: [6, 15], // Anchor at the dot
        popupAnchor: [0, -20]
      });

      const marker = L.marker([store.coords.lat, store.coords.lng], { icon: storeIcon })
        .addTo(mapInstanceRef.current);

      // Simple Click Action
      marker.on('click', () => {
        onSelectStore(store.name);
      });
    });

  }, [products, userLocation, onSelectStore]);

  return (
    <div className="w-full h-[600px] border-2 border-ink shadow-paper relative mt-4 overflow-hidden">
      <div id="map" ref={mapContainerRef} className="w-full h-full bg-[#fdfbf7] z-0"></div>
      
      {/* Subtle paper texture overlay on map container */}
      <div className="map-warmth-overlay"></div>
      
      {!userLocation && (
         <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-paper/90 border border-ink p-2 z-[1000] flex items-center gap-2 shadow-sm rounded-full px-4">
           <Loader2 size={16} className="animate-spin text-accent" />
           <span className="text-xs font-bold">Szukam satelity...</span>
         </div>
      )}
    </div>
  );
};

export default MapView;
