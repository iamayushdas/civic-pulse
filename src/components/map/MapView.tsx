'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Complaint, ComplaintStatus, CATEGORY_LABELS } from '@/types';

interface MapViewProps {
  complaints: Complaint[];
}

const STATUS_COLORS: Record<ComplaintStatus, string> = {
  SUBMITTED: '#777777',
  VERIFIED: '#3B82F6',
  ASSIGNED: '#8B5CF6',
  IN_PROGRESS: '#F59E0B',
  RESOLVED: '#10B981',
  REOPENED: '#E03A3E',
  REJECTED: '#EF4444',
  DUPLICATE: '#6B7280',
};

// Custom marker icon factory
function createCustomIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color}; 
        width: 24px; 
        height: 24px; 
        border-radius: 50%; 
        border: 3px solid #111111;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function createClusterIcon(count: number): L.DivIcon {
  const color = count >= 10 ? '#e03a3e' : count >= 5 ? '#f59e0b' : '#111111';
  return L.divIcon({
    className: 'complaint-cluster',
    html: `<div style="background:${color};color:#fff;width:42px;height:42px;border:4px solid #111;box-shadow:4px 4px 0 #111;display:flex;align-items:center;justify-content:center;font-weight:900;font-family:monospace">${count}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });
}

export default function MapView({ complaints }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const complaintsWithLocation = useMemo(() => {
    return complaints.filter(c => c.location);
  }, [complaints]);

  const clusters = useMemo(() => {
    const grouped = new Map<string, Complaint[]>();
    complaintsWithLocation.forEach((complaint) => {
      const latitude = Math.round(complaint.location!.lat * 100) / 100;
      const longitude = Math.round(complaint.location!.lng * 100) / 100;
      const key = `${latitude}:${longitude}`;
      grouped.set(key, [...(grouped.get(key) || []), complaint]);
    });
    return Array.from(grouped.values());
  }, [complaintsWithLocation]);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-civic-bg">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin mb-4"></div>
          <p className="font-bold uppercase">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={11}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ height: '100%', width: '100%', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {clusters.map((cluster) => {
        if (cluster.length > 1) {
          const latitude = cluster.reduce((sum, complaint) => sum + complaint.location!.lat, 0) / cluster.length;
          const longitude = cluster.reduce((sum, complaint) => sum + complaint.location!.lng, 0) / cluster.length;
          return (
            <Marker
              key={`cluster-${cluster.map((complaint) => complaint.complaintId).join('-')}`}
              position={[latitude, longitude]}
              icon={createClusterIcon(cluster.length)}
            >
              <Popup>
                <div className="min-w-[220px] font-sans">
                  <div className="mb-2 font-black uppercase">{cluster.length} ISSUES IN THIS AREA</div>
                  <div className="space-y-1">
                    {cluster.map((complaint) => (
                      <a key={complaint.complaintId} href={`/complaints/${complaint.complaintId}`} className="block text-xs font-bold underline">
                        {complaint.complaintId} · {complaint.title}
                      </a>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        }

        const complaint = cluster[0];
        const color = STATUS_COLORS[complaint.status];
        const customIcon = createCustomIcon(color);

        return (
          <Marker
            key={complaint.complaintId}
            position={[complaint.location!.lat, complaint.location!.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="font-sans min-w-[200px]">
                <div className="font-black text-sm mb-2 uppercase">
                  {complaint.complaintId}
                </div>
                <div className="text-xs font-bold mb-1 text-civic-primary">
                  {CATEGORY_LABELS[complaint.category]}
                </div>
                <div className="text-xs text-gray-700 mb-3 line-clamp-2">
                  {complaint.title}
                </div>
                <div className="text-xs font-bold mb-2">
                  Status: <span style={{ color }}>{complaint.status}</span>
                </div>
                <a
                  href={`/complaints/${complaint.complaintId}`}
                  className="inline-block px-3 py-1.5 bg-civic-accent text-white text-xs font-bold uppercase border-2 border-black hover:translate-x-0.5 hover:translate-y-0.5 transition-transform"
                >
                  VIEW DETAILS →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
