import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

const riskZones = [
  { lat: 26.5, lng: 56.3, risk: 85, name: "Strait of Hormuz", detail: "Military activity detected", color: "#FF6B6B" },
  { lat: 12.8, lng: 43.2, risk: 78, name: "Bab el-Mandeb", detail: "Houthi attack risk elevated", color: "#FF6B6B" },
  { lat: 30.0, lng: 32.5, risk: 35, name: "Suez Canal", detail: "Normal operations", color: "#2DDDA8" },
  { lat: 1.3, lng: 103.8, risk: 25, name: "Malacca Strait", detail: "Low risk — clear passage", color: "#2DDDA8" },
  { lat: 19.0, lng: 72.8, risk: 20, name: "Mumbai Port", detail: "Operational — 94% throughput", color: "#2DDDA8" },
  { lat: 22.3, lng: 70.0, risk: 15, name: "Jamnagar Refinery", detail: "Full capacity", color: "#2DDDA8" },
  { lat: 20.3, lng: 86.9, risk: 30, name: "Paradip Port", detail: "Minor congestion", color: "#A78BFA" },
  { lat: 9.9, lng: 76.3, risk: 18, name: "Kochi Refinery", detail: "Normal operations", color: "#2DDDA8" },
  { lat: 25.3, lng: 55.3, risk: 40, name: "UAE Supply Hub", detail: "Monitoring regional tensions", color: "#A78BFA" },
  { lat: 26.3, lng: 50.2, risk: 45, name: "Saudi Terminals", detail: "Elevated security posture", color: "#A78BFA" },
  { lat: 29.3, lng: 48.0, risk: 50, name: "Kuwait Port", detail: "Moderate risk zone", color: "#A78BFA" },
  { lat: 30.4, lng: 49.0, risk: 55, name: "Basra Terminal", detail: "Conflict proximity risk", color: "#FF6B6B" },
];

export default function RiskHeatmap() {
  return (
    <div className="glass rounded-2xl overflow-hidden h-[400px]">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Global Risk Heatmap</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-mint" /> Low</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lavender" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-coral" /> High</span>
        </div>
      </div>
      <MapContainer
        center={[20, 60]}
        zoom={3}
        className="h-[calc(100%-44px)] w-full"
        style={{ background: '#0A0A0A' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {riskZones.map((zone, i) => (
          <CircleMarker
            key={i}
            center={[zone.lat, zone.lng]}
            radius={Math.max(8, zone.risk / 5)}
            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3, weight: 1 }}
          >
            <Popup className="dark-popup">
              <div className="text-xs">
                <strong>{zone.name}</strong>
                <br />Risk Score: {zone.risk}
                <br />{zone.detail}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}