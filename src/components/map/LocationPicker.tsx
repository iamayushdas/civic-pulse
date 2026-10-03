'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  location: { lat: number; lng: number; address: string };
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

// Custom marker icon for location selection
const customIcon = L.divIcon({
  className: 'custom-marker-picker',
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
});

function LocationMarker({ location, onLocationChange }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng>(L.latLng(location.lat, location.lng));

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      fetchAddress(e.latlng.lat, e.latlng.lng);
    },
  });

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      // Using Nominatim reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      const address = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      
      onLocationChange({
        lat,
        lng,
        address,
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      onLocationChange({
        lat,
        lng,
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    }
  };

  return <Marker position={position} icon={customIcon} />;
}

export default function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        )
          .then((res) => res.json())
          .then((data) => {
            onLocationChange({
              lat,
              lng,
              address: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            });
          })
          .catch(() => {
            onLocationChange({
              lat,
              lng,
              address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            });
          })
          .finally(() => {
            setIsLocating(false);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please select a location on the map.');
        setIsLocating(false);
      }
    );
  }, [onLocationChange]);

  if (!isMounted) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-civic-bg border-2 border-civic-black">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin mb-4"></div>
          <p className="font-bold uppercase text-sm">Loading Map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block label-mono">SELECT LOCATION ON MAP</label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3 py-2 bg-civic-accent text-civic-white font-bold text-xs border-2 border-civic-black hover:translate-x-0.5 hover:translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapPin size={16} />
          {isLocating ? 'LOCATING...' : 'USE MY LOCATION'}
        </button>
      </div>

      <div className="border-2 border-civic-black overflow-hidden" style={{ height: '350px' }}>
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          key={`${location.lat}-${location.lng}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker location={location} onLocationChange={onLocationChange} />
        </MapContainer>
      </div>

      {location.address && (
        <div className="bg-civic-bg border-2 border-civic-black p-3">
          <div className="label-mono text-xs mb-1">SELECTED LOCATION</div>
          <div className="text-sm font-medium">{location.address}</div>
        </div>
      )}

      <div className="text-xs text-civic-muted">
        Click anywhere on the map to select the complaint location
      </div>
    </div>
  );
}
