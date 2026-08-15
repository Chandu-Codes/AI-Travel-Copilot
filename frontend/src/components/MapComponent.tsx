import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Custom Leaflet Pin Icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPoint {
  name: string;
  lat: number;
  lon: number;
  description?: string;
  category?: string;
  cost?: string | number;
}

interface Props {
  center?: [number, number];
  zoom?: number;
  markers?: MapPoint[];
  showRoute?: boolean;
}

export const MapComponent: React.FC<Props> = ({
  center = [15.4989, 73.8278], // Default to Goa
  zoom = 11,
  markers = [
    { name: "Baga Beach", lat: 15.5553, lon: 73.7516, description: "Nightlife, beach shacks, watersports", category: "Beach" },
    { name: "Fort Aguada", lat: 15.4921, lon: 73.7736, description: "17th-century Portuguese fortress", category: "Heritage" },
    { name: "Basilica of Bom Jesus", lat: 15.5009, lon: 73.9116, description: "UNESCO World Heritage Baroque Church", category: "Culture" }
  ],
  showRoute = true
}) => {
  const polylinePositions = markers.map(m => [m.lat, m.lon] as [number, number]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-10">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((point, index) => (
          <Marker 
            key={`${point.name}-${index}`} 
            position={[point.lat, point.lon]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {point.category || "Attraction"}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{point.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{point.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {showRoute && polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#2563eb" 
            weight={3} 
            dashArray="6, 8" 
          />
        )}
      </MapContainer>
    </div>
  );
};
