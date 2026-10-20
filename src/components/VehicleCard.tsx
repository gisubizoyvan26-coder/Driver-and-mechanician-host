import React, { useState } from 'react';
import { Vehicle, VehicleCategory } from '../types';
import {
  Car,
  Truck,
  Bus,
  Clock,
  Navigation,
  BatteryCharging,
  Fuel,
  Users,
  Briefcase,
  Star,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: (v: Vehicle) => void;
  onInstantHail: (v: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isSelected,
  onSelect,
  onInstantHail,
}) => {
  const [imgError, setImgError] = useState(false);

  const getCategoryLabel = (cat: VehicleCategory) => {
    switch (cat) {
      case 'taxi':
        return 'City Taxi';
      case 'rideshare':
        return 'On-Road Rideshare';
      case 'roadside_assist':
        return 'Roadside Recovery';
      case 'shuttle':
        return 'Corridor Shuttle';
      case 'carshare':
        return 'Curbside Carshare';
      default:
        return 'Road Vehicle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cruising':
        return 'Cruising on road';
      case 'curbside_idle':
        return 'Parked at curb';
      case 'en_route':
        return 'En route';
      default:
        return 'On duty standby';
    }
  };

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
          : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left: Vehicle Image & Core Info */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          {/* Vehicle Thumbnail with Fallback */}
          <div className="relative w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
            {!imgError ? (
              <img
                src={vehicle.image}
                alt={vehicle.model}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-2 text-center">
                <Car className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-[10px] leading-tight truncate font-mono">{vehicle.plateNumber}</span>
              </div>
            )}
          </div>

          {/* Info Block */}
          <div className="min-w-0 flex-1 space-y-1">
            {/* Title & Callsign */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                {vehicle.model}
              </h3>
              <span className="font-mono text-xs text-cyan-400 font-medium">
                {vehicle.callsign}
              </span>
            </div>

            {/* Zero-Pill Unboxed Metadata with Typographic Separator */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{getCategoryLabel(vehicle.category)}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono">{vehicle.plateNumber}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{getStatusText(vehicle.status)}</span>
            </div>

            {/* Location & Current Road Corridor */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
              <Navigation className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{vehicle.location.streetName}</span>
            </div>

            {/* Specs Strip: Capacity & Energy */}
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-0.5">
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span className="tabular-nums">{vehicle.capacity.passengers} seats</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1">
                {vehicle.isElectric ? (
                  <>
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="tabular-nums font-mono text-emerald-300">
                      {vehicle.fuelOrBatteryPct}% EV
                    </span>
                  </>
                ) : (
                  <>
                    <Fuel className="w-3.5 h-3.5 text-amber-400" />
                    <span className="tabular-nums font-mono text-amber-300">
                      {vehicle.fuelOrBatteryPct}% Fuel
                    </span>
                  </>
                )}
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1 text-slate-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-mono tabular-nums">{vehicle.driver.rating}</span>
                <span className="text-slate-500 hidden sm:inline">({vehicle.driver.tripsCompleted})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ETA, Pricing & Direct Action */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800 gap-2 shrink-0">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-1 sm:justify-end">
              <span className="text-xs text-slate-400">ETA</span>
              <span className="text-lg font-bold text-cyan-400 font-mono tabular-nums">
                {vehicle.etaMinutes} min
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono tabular-nums">
              {vehicle.distanceKm} km away on road
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInstantHail(vehicle);
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer whitespace-nowrap shadow-sm active:scale-98 flex items-center gap-1.5"
            >
              <span>{vehicle.category === 'roadside_assist' ? 'Dispatch Help' : 'Hail Now'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
