'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ComplaintLocationMapProps {
  location: { lat: number; lng: number; address?: string };
  complaintId: string;
  title: string;
}

// Custom marker icon for complaint location
const customIcon = L.divIcon({
  className: 'custom-marker-static',
  html: `
    <div style="
      background-color: #E03A3E; 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      border: 4px solid #111111;
      box-shadow: 0 4px 6px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function ComplaintLocationMap({ 
  location, 
  complaintId, 
  title 
}: ComplaintLocationMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-civic-bg border-2 border-civic-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full border-2 border-civic-black overflow-hidden">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            <div className="font-sans min-w-[180px]">
              <div className="font-black text-xs mb-1 uppercase">
                {complaintId}
              </div>
              <div className="text-xs text-gray-700 mb-2">
                {title}
              </div>
              {location.address && (
                <div className="text-xs text-gray-600">
                  {location.address}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
