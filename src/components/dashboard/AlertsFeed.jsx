import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, Shield } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

const sevBg = { critical: "bg-coral/10", high: "bg-coral/5", medium: "bg-lavender/5", low: "bg-mint/5" };
const sevText = { critical: "text-coral", high: "text-coral", medium: "text-lavender", low: "text-mint" };
const sevIcon = { critical: AlertTriangle, high: AlertCircle, medium: Info, low: Shield };

export default function AlertsFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.RiskEvent.filter({ status: 'active' }, '-event_date', 10)
      .then(data => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass rounded-2xl">
      <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Live Threat Alerts</h3>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-mint pulse-mint" />
          <span className="text-xs text-white/30">{events.length} active</span>
        </div>
      </div>
      <div className="divide-y divide-white/5 max-h-[360px] overflow-y-auto">
        {loading && (
          <div className="px-5 py-6 text-center text-white/30 text-sm">Loading alerts...</div>
        )}
        {!loading && events.length === 0 && (
          <div className="px-5 py-6 text-center text-white/30 text-sm">No active alerts</div>
        )}
        {events.map((ev) => {
          const Icon = sevIcon[ev.severity] || Info;
          const timeAgo = ev.event_date ? formatDistanceToNow(new Date(ev.event_date), { addSuffix: true }) : 'recently';
          return (
            <div key={ev.id} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
              <div className={`w-8 h-8 rounded-lg ${sevBg[ev.severity]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-4 h-4 ${sevText[ev.severity]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-sm leading-snug">{ev.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium uppercase ${sevText[ev.severity]}`}>{ev.severity}</span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className="text-white/30 text-xs">{ev.region}</span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className="text-white/30 text-xs">{timeAgo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}