import React from 'react';
import { RoadAlert } from '../types';
import { AlertCircle, ShieldCheck, Construction, Activity } from 'lucide-react';

interface RoadAlertsBannerProps {
  alerts: RoadAlert[];
}

export const RoadAlertsBanner: React.FC<RoadAlertsBannerProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span>Road Traffic & Hazard Advisory</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs"
          >
            {alert.type === 'patrol' ? (
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            ) : alert.type === 'roadwork' ? (
              <Construction className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-slate-200 font-medium">
                <span className="truncate">{alert.location}</span>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                  {alert.timeReported}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                {alert.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
