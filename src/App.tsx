import React, { useState, useEffect, useMemo } from 'react';
import {
  Vehicle,
  VehicleCategory,
  ActiveRide,
  RoadSegment,
  RoadAlert,
} from './types';
import {
  INITIAL_VEHICLES,
  ROAD_SEGMENTS,
  ROAD_ALERTS,
  USER_INITIAL_LOCATION,
  HERO_IMAGE,
} from './data/mockVehicles';
import { Navbar } from './components/Navbar';
import { LiveRoadMap } from './components/LiveRoadMap';
import { VehicleCard } from './components/VehicleCard';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { ActiveTripModal } from './components/ActiveTripModal';
import { EmergencySosModal } from './components/EmergencySosModal';
import { FareEstimatorModal } from './components/FareEstimatorModal';
import { RegisterVehicleModal } from './components/RegisterVehicleModal';
import { RoadAlertsBanner } from './components/RoadAlertsBanner';
import { ActiveRidesPanel } from './components/ActiveRidesPanel';
import {
  Car,
  Truck,
  Bus,
  Search,
  Filter,
  Navigation,
  ShieldAlert,
  Clock,
  Compass,
  ArrowUpDown,
  RotateCw,
  Zap,
  MapPin,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  // Main state
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('roadpulse_vehicles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_VEHICLES;
      }
    }
    return INITIAL_VEHICLES;
  });

  const [userLocation, setUserLocation] = useState(USER_INITIAL_LOCATION);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [activeView, setActiveView] = useState<'radar' | 'fleet' | 'estimator' | 'trips'>('radar');

  // Filters and queries
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'eta' | 'distance' | 'price' | 'rating'>('eta');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Active Dispatches & Trips
  const [activeRides, setActiveRides] = useState<ActiveRide[]>([]);
  const [completedRides, setCompletedRides] = useState<ActiveRide[]>([]);
  const [currentModalRide, setCurrentModalRide] = useState<ActiveRide | null>(null);

  // Modals
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);

  // Save vehicles to local storage
  useEffect(() => {
    localStorage.setItem('roadpulse_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  // Real-time On-Road Vehicle Movement Simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setVehicles((prevList) =>
        prevList.map((veh) => {
          // If vehicle is idle curbside or in active dispatch, keep steady
          if (veh.status === 'curbside_idle') return veh;

          // Step along heading
          const rad = (veh.location.heading * Math.PI) / 180;
          const stepDist = 0.45; // small realistic step
          let newX = veh.location.x + Math.sin(rad) * stepDist;
          let newY = veh.location.y - Math.cos(rad) * stepDist;
          let newHeading = veh.location.heading;

          // Bounce or turn inside boundaries (5 to 95%)
          if (newX <= 8 || newX >= 92) {
            newHeading = (360 - newHeading) % 360;
            newX = Math.max(8, Math.min(92, newX));
          }
          if (newY <= 8 || newY >= 92) {
            newHeading = (180 - newHeading + 360) % 360;
            newY = Math.max(8, Math.min(92, newY));
          }

          // Recalculate distance and ETA to user location
          const dx = newX - userLocation.x;
          const dy = newY - userLocation.y;
          const mapDistance = Math.hypot(dx, dy); // 0 to 140
          const realDistanceKm = Number(((mapDistance / 100) * 8).toFixed(1));
          const calculatedEta = Math.max(1, Math.round((realDistanceKm / 45) * 60));

          return {
            ...veh,
            location: {
              ...veh.location,
              x: Number(newX.toFixed(2)),
              y: Number(newY.toFixed(2)),
              heading: Math.round(newHeading),
            },
            distanceKm: realDistanceKm,
            etaMinutes: calculatedEta,
          };
        })
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSimulating, userLocation]);

  // Filtered and Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        if (categoryFilter !== 'all' && v.category !== categoryFilter) return false;
        if (v.distanceKm > radiusKm) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchModel = v.model.toLowerCase().includes(q);
          const matchDriver = v.driver.name.toLowerCase().includes(q);
          const matchPlate = v.plateNumber.toLowerCase().includes(q);
          const matchStreet = v.location.streetName.toLowerCase().includes(q);
          const matchCallsign = v.callsign.toLowerCase().includes(q);
          if (!matchModel && !matchDriver && !matchPlate && !matchStreet && !matchCallsign) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'eta') return a.etaMinutes - b.etaMinutes;
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'price') return a.price.base - b.price.base;
        if (sortBy === 'rating') return b.driver.rating - a.driver.rating;
        return 0;
      });
  }, [vehicles, categoryFilter, radiusKm, searchQuery, sortBy]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: vehicles.length,
      taxi: vehicles.filter((v) => v.category === 'taxi').length,
      rideshare: vehicles.filter((v) => v.category === 'rideshare').length,
      roadside_assist: vehicles.filter((v) => v.category === 'roadside_assist').length,
      shuttle: vehicles.filter((v) => v.category === 'shuttle').length,
      carshare: vehicles.filter((v) => v.category === 'carshare').length,
    };
  }, [vehicles]);

  // Fast roadside assistance fleet
  const roadsideUnits = useMemo(() => {
    return vehicles.filter((v) => v.category === 'roadside_assist');
  }, [vehicles]);

  // Handlers
  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  const handleConfirmHail = (vehicle: Vehicle, pickupNote: string) => {
    const estFare = Number(
      (vehicle.price.base + vehicle.price.perKm * vehicle.distanceKm).toFixed(2)
    );
    const newRide: ActiveRide = {
      id: `ride-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicle,
      pickupStreet: userLocation.streetName,
      dropoffStreet: 'Downtown Transit Concourse',
      fareEstimate: estFare,
      status: 'approaching',
      startTime: Date.now(),
      estimatedArrivalSec: vehicle.etaMinutes * 60,
      qrPass: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: pickupNote,
      passengerCount: 1,
    };

    setActiveRides((prev) => [newRide, ...prev]);
    setCurrentModalRide(newRide);
    setIsDetailOpen(false);
    setIsTripModalOpen(true);
  };

  const handleEmergencyDispatch = (issueType: string, vehicle: Vehicle) => {
    const newRide: ActiveRide = {
      id: `sos-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicle,
      pickupStreet: userLocation.streetName,
      dropoffStreet: 'Roadside Recovery Zone',
      fareEstimate: vehicle.price.base,
      status: 'approaching',
      startTime: Date.now(),
      estimatedArrivalSec: 180,
      emergencyType: issueType,
      qrPass: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      passengerCount: 1,
    };

    setActiveRides((prev) => [newRide, ...prev]);
    setCurrentModalRide(newRide);
    setIsSosOpen(false);
    setIsTripModalOpen(true);
  };

  const handleCancelRide = (rideId: string) => {
    setActiveRides((prev) => prev.filter((r) => r.id !== rideId));
    setIsTripModalOpen(false);
    setCurrentModalRide(null);
  };

  const handleCompleteRide = (rideId: string, rating: number) => {
    const found = activeRides.find((r) => r.id === rideId);
    if (found) {
      setCompletedRides((prev) => [found, ...prev]);
      setActiveRides((prev) => prev.filter((r) => r.id !== rideId));
    }
    setIsTripModalOpen(false);
    setCurrentModalRide(null);
  };

  const handleAddRegisteredVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Strict 3-Zone Navigation Header */}
      <Navbar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          if (v === 'estimator') setIsEstimatorOpen(true);
        }}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        activeTripCount={activeRides.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section: Single Visual Anchor with Real Automotive Fleet Photo */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold tracking-wide">
                <Compass className="w-4 h-4" />
                <span>REAL-TIME ON-ROAD DISCOVERY</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-mono">GPS RADAR ACTIVE</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-xl text-balance">
                Instant Access to Vehicles Active on the Road
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Hail available city taxis, rideshares, intercity shuttles, and 24/7 roadside recovery
                units patrolling urban streets and expressway corridors in real time.
              </p>

              {/* Action Buttons Strip */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const nearest = filteredVehicles[0];
                    if (nearest) handleSelectVehicle(nearest);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Car className="w-4 h-4" />
                  <span>Hail Closest Vehicle ({filteredVehicles[0]?.etaMinutes || 2}m ETA)</span>
                </button>

                <button
                  onClick={() => setIsEstimatorOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  Estimate Fare
                </button>

                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-4 py-2.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                >
                  Broadcast Your Vehicle
                </button>
              </div>
            </div>

            {/* Right Automotive Photography Column */}
            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
              <img
                src={HERO_IMAGE}
                alt="Available on-road vehicle fleet on city avenue"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden" />
            </div>
          </div>

          {/* Full-Width 4-Column Metric Strip (Placed below the hero split per Section 13) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-800 bg-slate-950/70 p-4 gap-4 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Cruising on Road</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {vehicles.length} Units
              </div>
              <div className="text-[11px] text-slate-500">Actively patrolling</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Fastest Roadside ETA</div>
              <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
                ~{filteredVehicles[0]?.etaMinutes || 2} Mins
              </div>
              <div className="text-[11px] text-slate-500">To your current point</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Monitored Corridors</div>
              <div className="text-xl font-bold text-white font-mono tabular-nums">
                {ROAD_SEGMENTS.length} Arterials
              </div>
              <div className="text-[11px] text-slate-500">Expressways & Avenues</div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Roadside SOS Standby</div>
              <div className="text-xl font-bold text-rose-400 font-mono tabular-nums">
                24/7 Rapid
              </div>
              <div className="text-[11px] text-slate-500">Heavy recovery units</div>
            </div>
          </div>
        </div>

        {/* Live Road Advisory & Traffic Alerts Banner */}
        <RoadAlertsBanner alerts={ROAD_ALERTS} />

        {/* View Switcher: Live Radar vs Active Trips */}
        {activeView === 'trips' ? (
          <ActiveRidesPanel
            activeRides={activeRides}
            completedRides={completedRides}
            onOpenRide={(r) => {
              setCurrentModalRide(r);
              setIsTripModalOpen(true);
            }}
            onSelectVehicleCategory={(cat) => {
              setCategoryFilter(cat);
              setActiveView('fleet');
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Interactive GPS Road Radar Section */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Live On-Road GPS Radar
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any road position on the map to set your pickup or hail cruising vehicles
                  </p>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Current Road: <span className="text-cyan-300 font-medium">{userLocation.streetName}</span>
                </div>
              </div>

              {/* Live Vector SVG Road Map */}
              <LiveRoadMap
                vehicles={filteredVehicles}
                roads={ROAD_SEGMENTS}
                selectedVehicleId={selectedVehicle?.id || null}
                onSelectVehicle={handleSelectVehicle}
                userLocation={userLocation}
                onUpdateUserLocation={(newLoc) =>
                  setUserLocation((prev) => ({ ...prev, ...newLoc }))
                }
                categoryFilter={categoryFilter}
                isSimulating={isSimulating}
                onToggleSimulation={() => setIsSimulating(!isSimulating)}
                radiusKm={radiusKm}
                onChangeRadius={setRadiusKm}
              />
            </div>

            {/* Filter Bar: Segmented Buttons for Categories (Allowed interactive buttons with click handlers) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {/* Category Segmented Control */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
                {[
                  { id: 'all', label: 'All On-Road', count: categoryCounts.all },
                  { id: 'taxi', label: 'City Taxis', count: categoryCounts.taxi },
                  { id: 'rideshare', label: 'Rideshare', count: categoryCounts.rideshare },
                  { id: 'roadside_assist', label: 'Roadside Recovery', count: categoryCounts.roadside_assist },
                  { id: 'shuttle', label: 'Shuttles', count: categoryCounts.shuttle },
                  { id: 'carshare', label: 'Carshare', count: categoryCounts.carshare },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id as VehicleCategory | 'all')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      categoryFilter === tab.id
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="ml-1.5 font-mono text-[11px] opacity-80">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search model, driver, street..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 shrink-0">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="eta" className="bg-slate-900">Fastest ETA</option>
                    <option value="distance" className="bg-slate-900">Closest Distance</option>
                    <option value="price" className="bg-slate-900">Lowest Base Fare</option>
                    <option value="rating" className="bg-slate-900">Highest Driver Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Vehicles Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200 uppercase tracking-wider">
                    Cruising Units Within {radiusKm} km
                  </span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{filteredVehicles.length} available</span>
                </div>
                <button
                  onClick={() => {
                    setCategoryFilter('all');
                    setSearchQuery('');
                    setRadiusKm(10);
                  }}
                  className="text-cyan-400 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>

              {/* Populated vs Empty State */}
              {filteredVehicles.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      isSelected={selectedVehicle?.id === vehicle.id}
                      onSelect={handleSelectVehicle}
                      onInstantHail={() => handleConfirmHail(vehicle, '')}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                  <Car className="w-10 h-10 text-slate-600 mx-auto" />
                  <div>
                    <h3 className="text-base font-semibold text-white">No vehicles found in this sector</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Try expanding your search radius slider or clearing the category filter to see more
                      on-road units.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setRadiusKm(10);
                      setCategoryFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Expand Search to 10 km
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">RoadPulse</span>
            <span>·</span>
            <span>Live On-Road Mobility & Roadside Fleet Network</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>24/7 Roadside Assistance Line: 1-800-555-ROAD</span>
            <span>·</span>
            <span>City Medallion Transit Verified</span>
          </div>
        </div>
      </footer>

      {/* Modals and Overlays */}
      {isDetailOpen && (
        <VehicleDetailModal
          vehicle={selectedVehicle}
          onClose={() => setIsDetailOpen(false)}
          onConfirmHail={handleConfirmHail}
          userPickupStreet={userLocation.streetName}
        />
      )}

      {isTripModalOpen && (
        <ActiveTripModal
          ride={currentModalRide}
          onClose={() => setIsTripModalOpen(false)}
          onCancelRide={handleCancelRide}
          onCompleteRide={handleCompleteRide}
        />
      )}

      {isSosOpen && (
        <EmergencySosModal
          onClose={() => setIsSosOpen(false)}
          userStreet={userLocation.streetName}
          roadsideVehicles={roadsideUnits}
          onDispatchEmergency={handleEmergencyDispatch}
        />
      )}

      {isEstimatorOpen && (
        <FareEstimatorModal
          onClose={() => setIsEstimatorOpen(false)}
          onSelectVehicleCategory={(cat) => {
            setCategoryFilter(cat);
            setActiveView('fleet');
          }}
          currentPickupStreet={userLocation.streetName}
        />
      )}

      {isRegisterOpen && (
        <RegisterVehicleModal
          onClose={() => setIsRegisterOpen(false)}
          onAddVehicle={handleAddRegisteredVehicle}
        />
      )}
    </div>
  );
}
