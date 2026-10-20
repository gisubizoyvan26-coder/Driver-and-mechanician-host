import React from 'react';
import { ShieldAlert, Car, MapPin } from 'lucide-react';

interface NavbarProps {
  activeView: 'radar' | 'fleet' | 'estimator' | 'trips';
  onSelectView: (view: 'radar' | 'fleet' | 'estimator' | 'trips') => void;
  onOpenSos: () => void;
  onOpenRegister: () => void;
  activeTripCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  onOpenSos,
  onOpenRegister,
  activeTripCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
        <a
          href="#live-radar"
          onClick={(e) => {
            e.preventDefault();
            onSelectView('radar');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
            <Car className="w-4 h-4" />
          </div>
          <span>RoadPulse</span>
        </a>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectView('radar')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeView === 'radar' ? 'text-cyan-400 underline underline-offset-8' : ''
            }`}
          >
            Live Road Radar
          </button>
          <button
            onClick={() => onSelectView('fleet')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeView === 'fleet' ? 'text-cyan-400 underline underline-offset-8' : ''
            }`}
          >
            Available Vehicles
          </button>
          <button
            onClick={() => onSelectView('estimator')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeView === 'estimator' ? 'text-cyan-400 underline underline-offset-8' : ''
            }`}
          >
            Fare Estimator
          </button>
          <button
            onClick={() => onSelectView('trips')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer ${
              activeView === 'trips' ? 'text-cyan-400 underline underline-offset-8' : ''
            }`}
          >
            Active Dispatches {activeTripCount > 0 ? `(${activeTripCount})` : ''}
          </button>
          <button
            onClick={onOpenRegister}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Broadcast Vehicle
          </button>
        </nav>

        {/* Zone 3: 1 Primary contextual action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSos}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Roadside</span>
          </button>
        </div>
      </div>
    </header>
  );
};
