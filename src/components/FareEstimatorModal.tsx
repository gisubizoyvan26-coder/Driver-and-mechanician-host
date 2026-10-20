import React, { useState } from 'react';
import { VehicleCategory } from '../types';
import {
  X,
  Calculator,
  MapPin,
  ArrowRight,
  Car,
  Bus,
  Truck,
  Sparkles,
  Check,
  ChevronRight,
} from 'lucide-react';

interface FareEstimatorModalProps {
  onClose: () => void;
  onSelectVehicleCategory: (category: VehicleCategory) => void;
  currentPickupStreet: string;
}

export const FareEstimatorModal: React.FC<FareEstimatorModalProps> = ({
  onClose,
  onSelectVehicleCategory,
  currentPickupStreet,
}) => {
  const [pickup, setPickup] = useState(currentPickupStreet);
  const [destination, setDestination] = useState('East University Medical District');
  const [distanceKm, setDistanceKm] = useState(6.4);

  const destinationOptions = [
    { name: 'East University Medical District', km: 6.4, min: 11 },
    { name: 'Downtown Financial Plaza', km: 3.8, min: 7 },
    { name: 'West Harbor Freight Terminal', km: 9.2, min: 15 },
    { name: 'Airport Express Connector Terminal', km: 18.5, min: 24 },
    { name: 'North Ring Parkway Shopping Center', km: 5.1, min: 9 },
  ];

  const handleSelectDest = (opt: { name: string; km: number; min: number }) => {
    setDestination(opt.name);
    setDistanceKm(opt.km);
  };

  const options: Array<{
    category: VehicleCategory;
    name: string;
    description: string;
    base: number;
    perKm: number;
    icon: typeof Car;
    color: string;
  }> = [
    {
      category: 'taxi',
      name: 'City Medallion Taxi',
      description: 'Metered regulated fare, licensed drivers, bus lane access',
      base: 3.5,
      perKm: 1.8,
      icon: Car,
      color: 'text-amber-400',
    },
    {
      category: 'rideshare',
      name: 'Pulse Rideshare',
      description: 'Comfortable private vehicle, climate-controlled, door-to-door',
      base: 4.2,
      perKm: 1.95,
      icon: Car,
      color: 'text-indigo-400',
    },
    {
      category: 'shuttle',
      name: 'Corridor Shuttle Van',
      description: 'High occupancy commuter van traversing arterial avenues',
      base: 4.0,
      perKm: 0.9,
      icon: Bus,
      color: 'text-cyan-400',
    },
    {
      category: 'carshare',
      name: 'Curbside Carshare',
      description: 'Drive yourself electric car parked along designated road bays',
      base: 2.0,
      perKm: 0.85,
      icon: Car,
      color: 'text-emerald-400',
    },
    {
      category: 'roadside_assist',
      name: 'Roadside Recovery Unit',
      description: 'Heavy duty tow & emergency roadside repair service',
      base: 45.0,
      perKm: 2.5,
      icon: Truck,
      color: 'text-rose-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-600 text-white">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Road Route & Fare Estimator
              </h2>
              <p className="text-xs text-slate-400">
                Transparent price comparison across all vehicle types on the road
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Origin & Destination Road Selectors */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Roadside Pickup Origin
              </label>
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{pickup}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Destination Road Corridor
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {destinationOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => handleSelectDest(opt)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                      destination === opt.name
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-medium'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {opt.name.split(' ')[0]} ({opt.km}km)
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="truncate">{destination}</span>
              </div>
            </div>

            {/* Calculated Distance Strip */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
              <span>Road Distance: <strong className="text-white">{distanceKm} km</strong></span>
              <span>Est. Transit Time: <strong className="text-cyan-400">~{Math.round(distanceKm * 1.8)} mins</strong></span>
            </div>
          </div>

          {/* Pricing Comparison Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Available Vehicle Rates for this Route
            </h3>

            <div className="grid gap-2.5">
              {options.map((opt) => {
                const Icon = opt.icon;
                const totalCost = (opt.base + opt.perKm * distanceKm).toFixed(2);

                return (
                  <div
                    key={opt.category}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl gap-3 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                        <Icon className={`w-5 h-5 ${opt.color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{opt.name}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            ${opt.base.toFixed(2)} base + ${opt.perKm.toFixed(2)}/km
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{opt.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                      <div className="text-left sm:text-right">
                        <div className="text-lg font-bold text-white font-mono tabular-nums">
                          ${totalCost}
                        </div>
                        <div className="text-[10px] text-slate-400">Est. Total</div>
                      </div>

                      <button
                        onClick={() => {
                          onSelectVehicleCategory(opt.category);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Filter & View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Estimator
          </button>
        </div>
      </div>
    </div>
  );
};
