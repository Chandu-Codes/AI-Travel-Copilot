import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix standard Leaflet default marker icons for Webpack/Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export interface MapPoint {
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

// Controller component to smoothly fly/recenter and invalidate map container dimensions
const MapRecenterController: React.FC<{ center: [number, number]; zoom: number; markers: MapPoint[] }> = ({
  center,
  zoom,
  markers
}) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size so tiles render properly on mount / tab switch
    const timer1 = setTimeout(() => map.invalidateSize(), 50);
    const timer2 = setTimeout(() => map.invalidateSize(), 300);

    const validMarkers = markers.filter(
      m => typeof m.lat === 'number' && !isNaN(m.lat) && 
           typeof m.lon === 'number' && !isNaN(m.lon) && 
           (m.lat !== 0 || m.lon !== 0)
    );

    if (validMarkers.length > 1) {
      const bounds = L.latLngBounds(validMarkers.map(m => [m.lat, m.lon]));
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.0, maxZoom: 13 });
    } else if (validMarkers.length === 1) {
      map.flyTo([validMarkers[0].lat, validMarkers[0].lon], 12, { duration: 1.0 });
    } else if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.flyTo(center, zoom, { duration: 1.0 });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [center, zoom, markers, map]);

  return null;
};

export const MapComponent: React.FC<Props> = ({
  center = [15.4989, 73.8278],
  zoom = 11,
  markers = [],
  showRoute = true
}) => {
  const validMarkers = markers.filter(
    m => typeof m.lat === 'number' && !isNaN(m.lat) && 
         typeof m.lon === 'number' && !isNaN(m.lon) && 
         (m.lat !== 0 || m.lon !== 0)
  );

  const effectiveCenter: [number, number] = validMarkers.length > 0
    ? [validMarkers[0].lat, validMarkers[0].lon]
    : center;

  const polylinePositions = validMarkers.map(m => [m.lat, m.lon] as [number, number]);

  return (
    <div className="w-full h-full min-h-[440px] rounded-3xl overflow-hidden shadow-warm-sm border border-[#D8CABA] relative z-10">
      <MapContainer
        center={effectiveCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[440px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenterController center={effectiveCenter} zoom={zoom} markers={validMarkers} />

        {validMarkers.map((point, index) => (
          <Marker 
            key={`${point.name}-${point.lat}-${point.lon}-${index}`} 
            position={[point.lat, point.lon]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1.5 max-w-[220px] space-y-1 bg-[#FAF5EC] rounded-xl font-sans">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#943A1C] bg-[#FBECE7] px-2 py-0.5 rounded-full">
                  {point.category || "Attraction"}
                </span>
                <h4 className="font-serif font-bold text-xs text-[#161309] leading-tight pt-1">{point.name}</h4>
                {point.description && (
                  <p className="text-[11px] text-[#615139] leading-normal">{point.description}</p>
                )}
                {point.cost !== undefined && (
                  <p className="text-[11px] font-extrabold text-[#943A1C] pt-0.5">
                    {typeof point.cost === 'number' ? (point.cost > 0 ? `₹${point.cost.toLocaleString('en-IN')}` : 'Free Entry') : point.cost}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {showRoute && polylinePositions.length > 1 && (
          <Polyline 
            positions={polylinePositions} 
            color="#943A1C" 
            weight={3.5} 
            dashArray="6, 8" 
          />
        )}
      </MapContainer>
    </div>
  );
};
