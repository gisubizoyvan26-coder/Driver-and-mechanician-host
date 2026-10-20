import React, { useState } from 'react';
import { Vehicle } from '../types';
import {
  X,
  Phone,
  Star,
  MapPin,
  Clock,
  Gauge,
  Shield,
  ShieldCheck,
  BatteryCharging,
  Fuel,
  Users,
  Briefcase,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onConfirmHail: (vehicle: Vehicle, pickupNote: string) => void;
  userPickupStreet: string;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onConfirmHail,
  userPickupStreet,
}) => {
  const [pickupNote, setPickupNote] = useState('');
  const [passengerCount, setPassengerCount] = useState(1);
  const [callingDriver, setCallingDriver] = useState(false);

  if (!vehicle) return null;

  const estimatedTotal = (
    vehicle.price.base +
    vehicle.price.perKm * vehicle.distanceKm * vehicle.price.surgeMultiplier
  ).toFixed(2);

  const handleSimulateCall = () => {
    setCallingDriver(true);
    setTimeout(() => {
      setCallingDriver(false);
      alert(`Connected to driver ${vehicle.driver.name} (${vehicle.driver.phone})`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{vehicle.model}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-cyan-400 font-semibold">{vehicle.callsign}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{vehicle.plateNumber}</span>
              <span aria-hidden="true">·</span>
              <span>{vehicle.year} Model</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close vehicle inspection"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Hero Photo & Live Road Radar Bar */}
          <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={vehicle.image}
              alt={vehicle.model}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-4">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Navigation className="w-4 h-4 text-cyan-400" />
                  <span>Cruising at {vehicle.location.streetName}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                    {vehicle.etaMinutes} min away
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {vehicle.distanceKm} km roadside distance
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver & Operator Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                {vehicle.driver.avatar ? (
                  <img
                    src={vehicle.driver.avatar}
                    alt={vehicle.driver.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm">
                    {vehicle.driver.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{vehicle.driver.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{vehicle.driver.rating}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  <span>{vehicle.driver.badge}</span>
                  <span className="mx-1.5">·</span>
                  <span className="font-mono tabular-nums">{vehicle.driver.tripsCompleted} trips</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateCall}
              disabled={callingDriver}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>{callingDriver ? 'Connecting...' : 'Call Driver'}</span>
            </button>
          </div>

          {/* Quick Vehicle Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Max Capacity</span>
              </div>
              <div className="text-sm font-bold text-white font-mono tabular-nums">
                {vehicle.capacity.passengers} Passengers
              </div>
              <div className="text-[11px] text-slate-400">{vehicle.capacity.luggageBags} bags max</div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                {vehicle.isElectric ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Fuel className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Energy Reserve</span>
              </div>
              <div className="text-sm font-bold text-white font-mono tabular-nums">
                {vehicle.fuelOrBatteryPct}% {vehicle.isElectric ? 'Electric' : 'Fuel'}
              </div>
              <div className="text-[11px] text-emerald-400">Road Ready</div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-500" />
                <span>Road Speed</span>
              </div>
              <div className="text-sm font-bold text-white font-mono tabular-nums">
                {vehicle.location.speedKmh} km/h
              </div>
              <div className="text-[11px] text-slate-400">Current velocity</div>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Arrival Time</span>
              </div>
              <div className="text-sm font-bold text-cyan-400 font-mono tabular-nums">
                ~{vehicle.etaMinutes} Mins
              </div>
              <div className="text-[11px] text-slate-400">Direct road path</div>
            </div>
          </div>

          {/* On-Road Equipment & Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Equipped On-Board Features
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {vehicle.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Fare Rate Calculator */}
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Base Roadside Dispatch:</span>
              <span className="font-mono tabular-nums">${vehicle.price.base.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Mileage Rate (${vehicle.price.perKm}/km × {vehicle.distanceKm} km):</span>
              <span className="font-mono tabular-nums">
                ${(vehicle.price.perKm * vehicle.distanceKm).toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-sm font-bold text-white">
              <span>Estimated Total to Pickup:</span>
              <span className="text-cyan-400 font-mono text-base tabular-nums">
                ${estimatedTotal}
              </span>
            </div>
          </div>

          {/* Pickup Point & Notes Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Exact Roadside Pickup Location
              </label>
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{userPickupStreet}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Roadside Pickup Note or Landmark (Optional)
              </label>
              <input
                type="text"
                value={pickupNote}
                onChange={(e) => setPickupNote(e.target.value)}
                placeholder="e.g., Standing by the north bus shelter, wearing dark jacket"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-950/80 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmHail(vehicle, pickupNote)}
            className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shadow-md active:scale-98 flex items-center gap-2"
          >
            <span>
              {vehicle.category === 'roadside_assist'
                ? 'Confirm Emergency Dispatch'
                : 'Confirm & Hail Vehicle Now'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
