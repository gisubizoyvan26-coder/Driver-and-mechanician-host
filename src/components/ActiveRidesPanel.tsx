import React from 'react';
import { ActiveRide } from '../types';
import {
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Star,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface ActiveRidesPanelProps {
  activeRides: ActiveRide[];
  completedRides: ActiveRide[];
  onOpenRide: (ride: ActiveRide) => void;
  onSelectVehicleCategory: (category: any) => void;
}

export const ActiveRidesPanel: React.FC<ActiveRidesPanelProps> = ({
  activeRides,
  completedRides,
  onOpenRide,
  onSelectVehicleCategory,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Active Dispatches */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Current Dispatches in Transit
          </h3>
          <span className="text-xs text-slate-400 font-mono tabular-nums">
            {activeRides.length} active
          </span>
        </div>

        {activeRides.length === 0 ? (
          <div className="p-6 text-center bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <Car className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-medium text-slate-300">No vehicle currently dispatched</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select any cruising vehicle from the radar map or list below to hail instant on-road transport.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {activeRides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => onOpenRide(ride)}
                className="flex items-center justify-between p-4 bg-slate-900 border border-cyan-500/60 rounded-xl hover:border-cyan-400 transition-colors cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                    <img
                      src={ride.vehicle.image}
                      alt={ride.vehicle.model}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{ride.vehicle.model}</h4>
                      <span className="text-xs font-mono text-cyan-400">
                        {ride.vehicle.plateNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span className="truncate">{ride.pickupStreet}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-cyan-400 font-bold">En Route</span>
                    <div className="text-xs text-slate-400 font-mono tabular-nums">
                      ${ride.fareEstimate.toFixed(2)}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Road Rides History */}
      {completedRides.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Recent Road Trip Receipts
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              {completedRides.length} recorded
            </span>
          </div>

          <div className="grid gap-2.5">
            {completedRides.map((ride) => (
              <div
                key={ride.id}
                className="flex items-center justify-between p-3.5 bg-slate-900/50 border border-slate-800 rounded-xl text-xs"
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      {ride.vehicle.model} ({ride.vehicle.callsign})
                    </div>
                    <div className="text-slate-400">
                      {ride.pickupStreet} → {ride.dropoffStreet}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-white tabular-nums">
                    ${ride.fareEstimate.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
