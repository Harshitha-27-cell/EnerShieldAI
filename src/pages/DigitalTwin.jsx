import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, X, Activity, AlertTriangle, CheckCircle, Gauge, Zap, Brain, Route } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import WhatIfSimulator from '@/components/digital-twin/WhatIfSimulator';
import AIImpactPanel from '@/components/digital-twin/AIImpactPanel';

const nodes = [
  { id: 1, name: "Jamnagar Refinery", type: "refinery", lat: 22.47, lng: 70.06, capacity: 1.36, utilization: 94, status: "operational", risk: 15, throughput: 1.28, incoming: 8, delays: 0 },
  { id: 2, name: "Mumbai Port (JNPT)", type: "port", lat: 19.0, lng: 72.95, capacity: 0.8, utilization: 88, status: "operational", risk: 20, throughput: 0.7, incoming: 12, delays: 1 },
  { id: 3, name: "Paradip Port", type: "port", lat: 20.26, lng: 86.67, capacity: 0.5, utilization: 72, status: "degraded", risk: 45, throughput: 0.36, incoming: 4, delays: 3 },
  { id: 4, name: "Vizag Storage", type: "storage", lat: 17.69, lng: 83.22, capacity: 11.22, utilization: 90, status: "operational", risk: 10, throughput: 0, incoming: 0, delays: 0 },
  { id: 5, name: "Chennai Terminal", type: "terminal", lat: 13.08, lng: 80.29, capacity: 0.4, utilization: 82, status: "operational", risk: 18, throughput: 0.33, incoming: 5, delays: 0 },
  { id: 6, name: "Kochi Refinery", type: "refinery", lat: 9.93, lng: 76.27, capacity: 0.31, utilization: 91, status: "operational", risk: 12, throughput: 0.28, incoming: 3, delays: 0 },
  { id: 7, name: "Mangalore Refinery", type: "refinery", lat: 12.87, lng: 74.88, capacity: 0.36, utilization: 88, status: "operational", risk: 14, throughput: 0.32, incoming: 4, delays: 0 },
  { id: 8, name: "Padur Strategic Reserve", type: "storage", lat: 12.49, lng: 75.0, capacity: 17.28, utilization: 82, status: "filling", risk: 8, throughput: 0, incoming: 0, delays: 0 },
  { id: 9, name: "Mathura Refinery", type: "refinery", lat: 27.49, lng: 77.67, capacity: 0.16, utilization: 85, status: "operational", risk: 10, throughput: 0.14, incoming: 2, delays: 0 },
  { id: 10, name: "Panipat Refinery", type: "refinery", lat: 29.39, lng: 76.97, capacity: 0.3, utilization: 90, status: "operational", risk: 8, throughput: 0.27, incoming: 3, delays: 0 },
  { id: 11, name: "Mundra Port", type: "port", lat: 22.84, lng: 69.72, capacity: 0.6, utilization: 78, status: "operational", risk: 16, throughput: 0.47, incoming: 9, delays: 0 },
  { id: 12, name: "Kandla Port", type: "port", lat: 23.03, lng: 70.22, capacity: 0.45, utilization: 80, status: "operational", risk: 18, throughput: 0.36, incoming: 6, delays: 1 },
];

const pipelines = [
  [[22.47, 70.06], [19.0, 72.95]],
  [[19.0, 72.95], [17.69, 83.22]],
  [[17.69, 83.22], [20.26, 86.67]],
  [[19.0, 72.95], [13.08, 80.29]],
  [[13.08, 80.29], [9.93, 76.27]],
  [[9.93, 76.27], [12.87, 74.88]],
  [[12.87, 74.88], [12.49, 75.0]],
  [[22.47, 70.06], [27.49, 77.67]],
  [[27.49, 77.67], [29.39, 76.97]],
  [[22.84, 69.72], [22.47, 70.06]],
  [[23.03, 70.22], [22.47, 70.06]],
];

const typeColors = { refinery: "#2DDDA8", port: "#A78BFA", storage: "#6FE7C2", terminal: "#C4B3FB" };
const statusColors = { operational: "#2DDDA8", degraded: "#FF6B6B", filling: "#A78BFA", offline: "#FF4444", maintenance: "#EAB308" };

const BOTTLENECKS = [
  { nodeId: 3, label: "Congested", severity: "high" },
  { nodeId: 2, label: "High Traffic", severity: "medium" },
  { nodeId: 4, label: "Near Capacity", severity: "medium" },
];

export default function DigitalTwin() {
  const [selected, setSelected] = useState(null);
  const [affectedNodes, setAffectedNodes] = useState([]);
  const [activeDisruption, setActiveDisruption] = useState(null);
  const [showBottlenecks, setShowBottlenecks] = useState(true);
  const [liveNodes, setLiveNodes] = useState(nodes);

  // Simulate live utilization fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveNodes(prev => prev.map(n => ({
        ...n,
        utilization: Math.min(100, Math.max(50, n.utilization + (Math.random() - 0.5) * 2))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSimResult = (nodeIds, disruption) => {
    setAffectedNodes(nodeIds);
    setActiveDisruption(disruption);
    if (disruption) {
      setLiveNodes(prev => prev.map(n => ({
        ...n,
        status: nodeIds.includes(n.id) ? "degraded" : n.status,
        risk: nodeIds.includes(n.id) ? Math.min(n.risk + 40, 95) : n.status === "degraded" ? n.risk : n.risk,
      })));
    } else {
      setLiveNodes(nodes);
    }
  };

  const isAffected = (id) => affectedNodes.includes(id);
  const isBottleneck = (id) => showBottlenecks && BOTTLENECKS.some(b => b.nodeId === id);

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Supply Chain Digital Twin</h1>
          <p className="text-white/40 text-sm mt-1">AI-powered interactive replica of India's energy infrastructure</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <button
            onClick={() => setShowBottlenecks(b => !b)}
            className={`px-3 py-1.5 rounded-xl transition-colors border ${showBottlenecks ? 'border-coral/30 bg-coral/10 text-coral' : 'border-white/10 text-white/30'}`}
          >
            ⚠ Bottlenecks
          </button>
          {Object.entries({ refinery: "Refinery", port: "Port", storage: "Storage", terminal: "Terminal" }).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: typeColors[k] }} />
              <span className="text-white/40">{v}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="glass rounded-xl px-4 py-2.5 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-mint pulse-mint" /><span className="text-white/50">Live Network</span></div>
        <span className="text-white/20">|</span>
        <span className="text-white/40">{liveNodes.filter(n => n.status === 'operational').length} Operational</span>
        <span className="text-coral/80">{liveNodes.filter(n => n.status === 'degraded').length} Degraded</span>
        <span className="text-lavender/80">{liveNodes.filter(n => n.status === 'filling').length} Filling</span>
        {activeDisruption && (
          <span className="ml-auto px-2 py-0.5 bg-coral/10 border border-coral/30 text-coral rounded-full font-semibold animate-pulse">
            ⚡ {activeDisruption.name} Active
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        {/* Map — spans 3 cols */}
        <div className="lg:col-span-3 relative">
          <div className="glass rounded-2xl overflow-hidden h-[500px] lg:h-[600px]">
            <MapContainer
              center={[20.5, 78.9]}
              zoom={5}
              className="h-full w-full"
              style={{ background: '#0A0A0A' }}
              zoomControl={false}
              attributionControl={false}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

              {/* Pipelines — highlight affected */}
              {pipelines.map((coords, i) => (
                <Polyline
                  key={i}
                  positions={coords}
                  pathOptions={{
                    color: '#A78BFA',
                    weight: 1.5,
                    opacity: 0.3,
                    dashArray: '8 4'
                  }}
                />
              ))}

              {/* Nodes */}
              {liveNodes.map(node => {
                const affected = isAffected(node.id);
                const bottleneck = isBottleneck(node.id);
                const color = affected ? '#FF6B6B' : bottleneck ? '#F97316' : typeColors[node.type];
                return (
                  <CircleMarker
                    key={node.id}
                    center={[node.lat, node.lng]}
                    radius={affected ? 14 : node.status === 'degraded' ? 11 : 9}
                    pathOptions={{
                      color,
                      fillColor: color,
                      fillOpacity: affected ? 0.7 : 0.4,
                      weight: affected ? 3 : 2,
                    }}
                    eventHandlers={{ click: () => setSelected(node) }}
                  >
                    <Popup>
                      <div className="text-xs font-medium">{node.name}</div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Bottleneck overlay labels */}
            {showBottlenecks && (
              <div className="absolute top-4 left-4 space-y-1.5 z-[999]">
                {BOTTLENECKS.map(b => {
                  const node = nodes.find(n => n.id === b.nodeId);
                  return (
                    <div key={b.nodeId} className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-orange-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span className="text-orange-400 text-xs font-medium">{node?.name}</span>
                      <span className="text-white/30 text-xs">— {b.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Node Detail Panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-72 glass rounded-2xl overflow-hidden z-[1000]"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{selected.name}</h3>
                      <span className="text-xs capitalize px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: typeColors[selected.type] + '20', color: typeColors[selected.type] }}>
                        {selected.type}
                      </span>
                    </div>
                    <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {[
                      { label: "Status", value: selected.status, color: selected.status === 'operational' ? 'text-mint' : selected.status === 'degraded' ? 'text-coral' : 'text-lavender' },
                      { label: "Risk Score", value: `${selected.risk}/100`, color: selected.risk >= 40 ? 'text-coral' : selected.risk >= 25 ? 'text-lavender' : 'text-mint' },
                      { label: "Capacity", value: `${selected.capacity} ${selected.type === 'storage' ? 'MMT' : 'M bpd'}`, color: 'text-white' },
                      { label: "Utilization", value: `${Math.round(liveNodes.find(n => n.id === selected.id)?.utilization || selected.utilization)}%`, color: 'text-white' },
                      { label: "Incoming Ships", value: `${selected.incoming}`, color: 'text-lavender' },
                      { label: "Delays", value: selected.delays > 0 ? `${selected.delays} vessel(s)` : "None", color: selected.delays > 0 ? 'text-coral' : 'text-mint' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="bg-white/[0.03] rounded-xl p-2.5">
                        <p className="text-white/30">{label}</p>
                        <p className={`font-semibold capitalize ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/30">Utilization</span>
                      <span className="text-white/50">{Math.round(liveNodes.find(n => n.id === selected.id)?.utilization || selected.utilization)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${selected.utilization}%`, backgroundColor: typeColors[selected.type] }} />
                    </div>
                  </div>

                  {selected.throughput > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-white/30 text-xs">Throughput</p>
                      <p className="text-lg font-bold text-white">{selected.throughput} M bpd</p>
                    </div>
                  )}

                  {isAffected(selected.id) && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <p className="text-coral text-xs font-semibold flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" />Disruption Affected</p>
                      <p className="text-white/40 text-xs mt-1">This asset is currently impacted by the active simulation scenario.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <WhatIfSimulator nodes={liveNodes} onSimulationResult={handleSimResult} />
          {activeDisruption && affectedNodes.length > 0 && (
            <AIImpactPanel disruption={activeDisruption} affectedNodeIds={affectedNodes} nodes={liveNodes} />
          )}
        </div>
      </div>
    </div>
  );
}