import React, { useState } from 'react';
import { Vehicle, VehicleCategory } from '../types';
import { X, Car, PlusCircle, Radio, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { ROAD_SEGMENTS, TAXI_IMAGE, ROADSIDE_IMAGE, SHUTTLE_IMAGE, HERO_IMAGE } from '../data/mockVehicles';

interface RegisterVehicleModalProps {
  onClose: () => void;
  onAddVehicle: (newVehicle: Vehicle) => void;
}

export const RegisterVehicleModal: React.FC<RegisterVehicleModalProps> = ({
  onClose,
  onAddVehicle,
}) => {
  const [driverName, setDriverName] = useState('');
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('taxi');
  const [roadId, setRoadId] = useState(ROAD_SEGMENTS[0].id);
  const [seats, setSeats] = useState(4);
  const [isElectric, setIsElectric] = useState(true);
  const [basePrice, setBasePrice] = useState('3.50');
  const [ratePerKm, setRatePerKm] = useState('1.80');
  const [phone, setPhone] = useState('+1 (555) 019-8234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !model || !plateNumber) return;

    const chosenRoad = ROAD_SEGMENTS.find((r) => r.id === roadId) || ROAD_SEGMENTS[0];
    const midX = Math.round((chosenRoad.x1 + chosenRoad.x2) / 2);
    const midY = Math.round((chosenRoad.y1 + chosenRoad.y2) / 2);

    let image = TAXI_IMAGE;
    if (category === 'roadside_assist') image = ROADSIDE_IMAGE;
    else if (category === 'shuttle') image = SHUTTLE_IMAGE;
    else if (category === 'rideshare') image = HERO_IMAGE;

    const newVehicle: Vehicle = {
      id: `veh-custom-${Date.now()}`,
      callsign: `${category.toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`,
      category,
      model,
      plateNumber: plateNumber.toUpperCase(),
      year: 2024,
      driver: {
        name: driverName,
        avatar: '',
        rating: 5.0,
        tripsCompleted: 1,
        phone,
        badge: 'Verified On-Road Operator',
      },
      location: {
        x: midX,
        y: midY,
        streetName: chosenRoad.name,
        heading: 90,
        speedKmh: 45,
        roadLane: 'eastbound',
      },
      etaMinutes: 2,
      distanceKm: 0.5,
      fuelOrBatteryPct: 95,
      isElectric,
      capacity: {
        passengers: Number(seats),
        luggageBags: 2,
      },
      price: {
        base: parseFloat(basePrice) || 3.5,
        perKm: parseFloat(ratePerKm) || 1.8,
        surgeMultiplier: 1.0,
      },
      features: ['Live On-Road Broadcasting', 'Instant Booking', 'Air Conditioned'],
      image,
      status: 'cruising',
      description: `Active ${category} broadcasting live availability on ${chosenRoad.name}.`,
    };

    onAddVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-600 text-white">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Broadcast Vehicle Live on Road
              </h2>
              <p className="text-xs text-slate-400">
                Register an active vehicle cruising the roadway network
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehicle Service Classification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'taxi', label: 'City Taxi / Cab' },
                { id: 'rideshare', label: 'Rideshare Cruiser' },
                { id: 'roadside_assist', label: 'Roadside Recovery' },
                { id: 'shuttle', label: 'Passenger Shuttle' },
                { id: 'carshare', label: 'Curbside Carshare' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setCategory(item.id as VehicleCategory)}
                  className={`p-2 text-xs rounded-lg border text-left transition-colors cursor-pointer ${
                    category === item.id
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model & License Plate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Vehicle Make & Model
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Ford Transit or Tesla Model 3"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                License Plate Number
              </label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="e.g. 7XYZ890"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 font-mono uppercase focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Driver Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Driver / Operator Full Name
              </label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Direct Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Active Roadway Corridor */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Current Road Corridor
            </label>
            <select
              value={roadId}
              onChange={(e) => setRoadId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {ROAD_SEGMENTS.map((road) => (
                <option key={road.id} value={road.id}>
                  {road.name} ({road.speedLimitKmh} km/h zone)
                </option>
              ))}
            </select>
          </div>

          {/* Passenger Capacity & Pricing */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Seat Capacity
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Base Fare ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Rate / Km ($)
              </label>
              <input
                type="number"
                step="0.1"
                value={ratePerKm}
                onChange={(e) => setRatePerKm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* EV Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="ev-toggle"
              checked={isElectric}
              onChange={(e) => setIsElectric(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="ev-toggle" className="text-xs text-slate-300 cursor-pointer">
              Zero Emission Vehicle (100% Electric Battery)
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shadow-md"
            >
              Broadcast on Road Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
