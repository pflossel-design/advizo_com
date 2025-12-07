"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cityCenters: any = {
  "Praha": [50.0755, 14.4378],
  "Brno": [49.1951, 16.6068],
  "Ostrava": [49.8209, 18.2625],
  "Plzeň": [49.7384, 13.3736],
  "Liberec": [50.7663, 15.0543],
  "Olomouc": [49.5938, 17.2509],
  "České Budějovice": [48.9745, 14.4743]
};

export default function LawyerMap({ lawyers, city }: { lawyers: any[], city: string }) {
  const center = cityCenters[city] || [49.8, 15.5]; 
  const zoom = city ? 13 : 7;
  
  // ZABEZPEČENÍ
  const safeLawyers = Array.isArray(lawyers) ? lawyers : [];

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-800 z-0 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
        key={city || "default"} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {safeLawyers.map((lawyer) => (
          lawyer.lat && lawyer.lng ? (
            <Marker key={lawyer.id} position={[lawyer.lat, lawyer.lng]} icon={icon}>
              <Popup>
                <div className="font-sans text-slate-900">
                  <h3 className="font-bold text-sm">{lawyer.name}</h3>
                  <p className="text-xs text-slate-500">{lawyer.address}</p>
                </div>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}