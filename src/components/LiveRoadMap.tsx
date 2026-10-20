import React, { useState } from 'react';
import { Vehicle, RoadSegment, VehicleCategory } from '../types';
import {
  Car,
  Truck,
  Bus,
  Navigation,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  MapPin,
  Clock,
  Shield,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface LiveRoadMapProps {
  vehicles: Vehicle[];
  roads: RoadSegment[];
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
  userLocation: { x: number; y: number; streetName: string };
  onUpdateUserLocation: (newLoc: { x: number; y: number; streetName: string }) => void;
  categoryFilter: VehicleCategory | 'all';
  isSimulating: boolean;
  onToggleSimulation: () => void;
  radiusKm: number;
  onChangeRadius: (km: number) => void;
}

export const LiveRoadMap: React.FC<LiveRoadMapProps> = ({
  vehicles,
  roads,
  selectedVehicleId,
  onSelectVehicle,
  userLocation,
  onUpdateUserLocation,
  categoryFilter,
  isSimulating,
  onToggleSimulation,
  radiusKm,
  onChangeRadius,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showRadius, setShowRadius] = useState<boolean>(true);
  const [hoveredVehicle, setHoveredVehicle] = useState<Vehicle | null>(null);

  // Map viewbox scaling
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.8, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find closest road segment to snap user onto road
    let closestRoad = roads[0];
    let minDistance = 999;
    roads.forEach((road) => {
      // Approximate distance to line segment
      const midX = (road.x1 + road.x2) / 2;
      const midY = (road.y1 + road.y2) / 2;
      const d = Math.hypot(clickX - midX, clickY - midY);
      if (d < minDistance) {
        minDistance = d;
        closestRoad = road;
      }
    });

    onUpdateUserLocation({
      x: Math.round(clickX),
      y: Math.round(clickY),
      streetName: closestRoad.name,
    });
  };

  const getVehicleIcon = (category: VehicleCategory) => {
    switch (category) {
      case 'taxi':
        return <Car className="w-3.5 h-3.5 text-amber-300" />;
      case 'roadside_assist':
        return <Truck className="w-3.5 h-3.5 text-rose-400" />;
      case 'shuttle':
        return <Bus className="w-3.5 h-3.5 text-cyan-400" />;
      case 'carshare':
        return <Car className="w-3.5 h-3.5 text-emerald-400" />;
      case 'rideshare':
      default:
        return <Car className="w-3.5 h-3.5 text-indigo-300" />;
    }
  };

  const getCategoryColor = (category: VehicleCategory) => {
    switch (category) {
      case 'taxi':
        return 'border-amber-400 bg-amber-950/80 text-amber-300';
      case 'roadside_assist':
        return 'border-rose-500 bg-rose-950/80 text-rose-300';
      case 'shuttle':
        return 'border-cyan-400 bg-cyan-950/80 text-cyan-300';
      case 'carshare':
        return 'border-emerald-400 bg-emerald-950/80 text-emerald-300';
      case 'rideshare':
      default:
        return 'border-indigo-400 bg-indigo-950/80 text-indigo-300';
    }
  };

  // Convert km radius to SVG percentage radius
  const radiusSvg = (radiusKm / 5) * 28;

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Live Roadway GPS Grid</span>
          </div>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono tabular-nums">
            {vehicles.length} on-road units cruising
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Simulation Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isSimulating
                ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle vehicle traffic movement"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Live Motion Active' : 'Resume Motion'}</span>
          </button>

          {/* Traffic Toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showTraffic
                ? 'bg-cyan-950/60 border-cyan-700/60 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Toggle live road congestion flow"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Traffic Flow</span>
          </button>

          {/* Radius Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            {[1, 3, 5, 10].map((km) => (
              <button
                key={km}
                onClick={() => onChangeRadius(km)}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                  radiusKm === km
                    ? 'bg-slate-800 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] sm:min-h-[460px] bg-[#0c121e] overflow-hidden select-none cursor-crosshair">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})` }}
          onClick={handleSvgClick}
        >
          {/* Subtle City Grid Background Texture */}
          <defs>
            <pattern id="city-blocks" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#0b111c" />
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#162032" strokeWidth="0.4" />
            </pattern>
            {/* Pulsing user wave animation */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid base */}
          <rect width="100" height="100" fill="url(#city-blocks)" />

          {/* City District Blocks & Parks */}
          <rect x="25" y="25" width="22" height="22" rx="1.5" fill="#111a28" stroke="#1a273b" strokeWidth="0.3" />
          <text x="36" y="36" fill="#334766" fontSize="2" textAnchor="middle" fontWeight="bold">DOWNTOWN CORRIDOR</text>

          <rect x="53" y="25" width="22" height="22" rx="1.5" fill="#111a28" stroke="#1a273b" strokeWidth="0.3" />
          <text x="64" y="36" fill="#334766" fontSize="2" textAnchor="middle" fontWeight="bold">TECH DISTRICT</text>

          <rect x="25" y="53" width="22" height="22" rx="1.5" fill="#0d1b1d" stroke="#142c2f" strokeWidth="0.3" />
          <text x="36" y="64" fill="#1b4549" fontSize="2" textAnchor="middle" fontWeight="bold">RIVERSIDE GREEN PARK</text>

          <rect x="53" y="53" width="22" height="22" rx="1.5" fill="#111a28" stroke="#1a273b" strokeWidth="0.3" />
          <text x="64" y="64" fill="#334766" fontSize="2" textAnchor="middle" fontWeight="bold">LOGISTICS HUB</text>

          {/* Road Network Layers */}
          {roads.map((road) => {
            const isHighway = road.type === 'highway';
            const strokeWidth = isHighway ? 4.2 : 2.8;

            return (
              <g key={road.id}>
                {/* Road Asphalt Base */}
                <line
                  x1={road.x1}
                  y1={road.y1}
                  x2={road.x2}
                  y2={road.y2}
                  stroke="#1c2638"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />

                {/* Road Lane Markings / Dashed Line */}
                <line
                  x1={road.x1}
                  y1={road.y1}
                  x2={road.x2}
                  y2={road.y2}
                  stroke={isHighway ? '#475569' : '#334155'}
                  strokeWidth="0.3"
                  strokeDasharray="1.2, 1.2"
                  strokeLinecap="butt"
                />

                {/* Live Traffic Flow Layer */}
                {showTraffic && (
                  <line
                    x1={road.x1}
                    y1={road.y1}
                    x2={road.x2}
                    y2={road.y2}
                    stroke={
                      road.trafficStatus === 'congested'
                        ? '#ef4444'
                        : road.trafficStatus === 'moderate'
                        ? '#f59e0b'
                        : '#10b981'
                    }
                    strokeWidth="0.5"
                    strokeOpacity="0.75"
                    strokeLinecap="round"
                  />
                )}

                {/* Road Name Label */}
                <text
                  x={(road.x1 + road.x2) / 2}
                  y={(road.y1 + road.y2) / 2 - 2}
                  fill="#64748b"
                  fontSize="1.6"
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                >
                  {road.name}
                </text>
              </g>
            );
          })}

          {/* User Location Radar Radius & Pulse */}
          {showRadius && (
            <g className="pointer-events-none">
              <circle
                cx={userLocation.x}
                cy={userLocation.y}
                r={radiusSvg}
                fill="url(#radar-glow)"
                stroke="#06b6d4"
                strokeWidth="0.3"
                strokeDasharray="1.5, 1"
                opacity="0.8"
              />
              <circle
                cx={userLocation.x}
                cy={userLocation.y}
                r={radiusSvg * 0.5}
                fill="none"
                stroke="#0891b2"
                strokeWidth="0.2"
                strokeDasharray="1, 1"
                opacity="0.4"
              />
            </g>
          )}

          {/* User Location Pin */}
          <g transform={`translate(${userLocation.x}, ${userLocation.y})`}>
            {/* Halo pulse */}
            <circle r="2.2" fill="#06b6d4" opacity="0.35" />
            <circle r="1.2" fill="#0891b2" />
            <circle r="0.6" fill="#ffffff" />
            <text
              y="3.8"
              fill="#38bdf8"
              fontSize="1.7"
              fontWeight="bold"
              textAnchor="middle"
              className="pointer-events-none"
            >
              YOU (ON ROAD)
            </text>
          </g>

          {/* Vehicle Markers */}
          {vehicles.map((v) => {
            const isSelected = v.id === selectedVehicleId;
            const isHovered = hoveredVehicle?.id === v.id;

            return (
              <g
                key={v.id}
                transform={`translate(${v.location.x}, ${v.location.y})`}
                className="cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectVehicle(v);
                }}
                onMouseEnter={() => setHoveredVehicle(v)}
                onMouseLeave={() => setHoveredVehicle(null)}
              >
                {/* Vehicle Selection or Hover Ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="3.5"
                    fill="none"
                    stroke={isSelected ? '#38bdf8' : '#94a3b8'}
                    strokeWidth="0.4"
                    strokeDasharray={isSelected ? '0.8, 0.8' : undefined}
                  />
                )}

                {/* Vehicle Heading Arrow */}
                <g transform={`rotate(${v.location.heading})`}>
                  <polygon
                    points="0,-2.6 1.4,-0.6 -1.4,-0.6"
                    fill={v.category === 'taxi' ? '#f59e0b' : v.category === 'roadside_assist' ? '#f43f5e' : '#38bdf8'}
                  />
                </g>

                {/* Vehicle Marker Center Circle */}
                <circle
                  r="1.8"
                  fill={
                    v.category === 'taxi'
                      ? '#d97706'
                      : v.category === 'roadside_assist'
                      ? '#e11d48'
                      : v.category === 'shuttle'
                      ? '#0891b2'
                      : v.category === 'carshare'
                      ? '#059669'
                      : '#4f46e5'
                  }
                  stroke="#ffffff"
                  strokeWidth="0.4"
                />

                {/* Callsign and ETA Label */}
                <text
                  y="-3.4"
                  fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                  fontSize="1.6"
                  fontWeight="600"
                  textAnchor="middle"
                  className="pointer-events-none select-none font-mono"
                >
                  {v.callsign} ({v.etaMinutes}m)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered or Selected Floating Card over Map */}
        {(hoveredVehicle || selectedVehicleId) && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm p-3.5 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl z-20">
            {(() => {
              const active = hoveredVehicle || vehicles.find((v) => v.id === selectedVehicleId);
              if (!active) return null;
              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md border ${getCategoryColor(active.category)}`}>
                        {getVehicleIcon(active.category)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">{active.model}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="font-mono">{active.plateNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span>{active.location.streetName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-cyan-400 font-mono tabular-nums">
                        {active.etaMinutes} min away
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                        {active.distanceKm} km
                      </div>
                    </div>
                  </div>

                  {/* Driver and Speed stats */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-medium text-slate-200">{active.driver.name}</span>
                      <span className="text-amber-400 font-mono">★ {active.driver.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 font-mono tabular-nums">
                      <Gauge className="w-3 h-3 text-slate-500" />
                      <span>{active.location.speedKmh} km/h</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectVehicle(active)}
                      className="flex-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer text-center"
                    >
                      Inspect & Hail Vehicle
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Map Legend & Tap-to-set hint */}
        <div className="absolute top-3 right-3 hidden sm:flex flex-col gap-1.5 p-2.5 bg-slate-950/85 backdrop-blur-sm border border-slate-800 rounded-lg text-[11px] text-slate-300 pointer-events-none">
          <div className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Road Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Taxis & Cabs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Rideshare Cruisers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Roadside Rescue / Tow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span>Passenger Shuttles</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Curbside Carshare</span>
          </div>
          <div className="pt-1 mt-1 border-t border-slate-800 text-[10px] text-cyan-400">
            Tip: Click anywhere to set pickup point
          </div>
        </div>
      </div>

      {/* Roadside Position Indicator bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-500">Your Roadside Pickup:</span>
          <span className="text-slate-200 font-medium truncate">{userLocation.streetName}</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px] shrink-0">
          Search Radius: <span className="text-cyan-300 font-semibold">{radiusKm} km</span>
        </div>
      </div>
    </div>
  );
};
