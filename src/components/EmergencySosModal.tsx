import React, { useState } from 'react';
import { Vehicle } from '../types';
import {
  ShieldAlert,
  X,
  AlertTriangle,
  Wrench,
  BatteryCharging,
  Fuel,
  Car,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Clock,
} from 'lucide-react';

interface EmergencySosModalProps {
  onClose: () => void;
  userStreet: string;
  roadsideVehicles: Vehicle[];
  onDispatchEmergency: (issueType: string, vehicle: Vehicle) => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  onClose,
  userStreet,
  roadsideVehicles,
  onDispatchEmergency,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('flat_tire');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the closest roadside vehicle
  const nearestPatrol = roadsideVehicles[0] || null;

  const emergencyTypes = [
    { id: 'flat_tire', label: 'Flat Tire / Puncture', icon: Wrench, time: '3-5 min' },
    { id: 'battery_dead', label: 'Dead Battery / Jumpstart', icon: BatteryCharging, time: '4-6 min' },
    { id: 'towing', label: 'Mechanical Stall / Towing', icon: Car, time: '5-8 min' },
    { id: 'out_of_fuel', label: 'Emergency Fuel / EV Boost', icon: Fuel, time: '4-7 min' },
    { id: 'collision', label: 'Accident / Vehicle Recovery', icon: AlertTriangle, time: 'Immediate' },
  ];

  const handleDispatch = () => {
    if (!nearestPatrol) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onDispatchEmergency(selectedIssue, nearestPatrol);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-rose-900/60 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Urgent Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-950/80 border-b border-rose-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-600 text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Roadside Emergency Dispatch
              </h2>
              <p className="text-xs text-rose-200">
                24/7 Highway & Urban Road Rapid Assistance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Stranded location */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Your Current Roadside GPS Location
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-100 font-medium">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
              <span className="truncate">{userStreet}</span>
            </div>
          </div>

          {/* Issue Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Select Roadside Issue
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {emergencyTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedIssue === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedIssue(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-950/50 border-rose-500 text-white shadow-sm ring-1 ring-rose-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ETA: {item.time}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Nearest Patrol Vehicle */}
          {nearestPatrol && (
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                Nearest Roadside Unit
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{nearestPatrol.model}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">{nearestPatrol.callsign}</span>
                    <span aria-hidden="true">·</span>
                    <span>Officer {nearestPatrol.driver.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-rose-400 font-mono tabular-nums">
                    {nearestPatrol.etaMinutes} min away
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {nearestPatrol.distanceKm} km
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roadside Safety Protocol Checklist */}
          <div className="p-3.5 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1.5 text-xs text-amber-200">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Crucial Safety Steps While Waiting on the Road:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-amber-300/80 list-disc list-inside">
              <li>Turn on your vehicle hazard warning flashers immediately.</li>
              <li>If stranded on highway shoulder, stand behind safety guardrail.</li>
              <li>Keep phone charged and beacon on for unit radar identification.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDispatch}
            disabled={isSubmitting || !nearestPatrol}
            className="px-5 py-2.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer shadow-md flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSubmitting ? 'Dispatching Unit...' : 'Dispatch Roadside Patrol Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
