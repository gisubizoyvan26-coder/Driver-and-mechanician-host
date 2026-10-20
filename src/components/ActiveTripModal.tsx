import React, { useEffect, useState } from 'react';
import { ActiveRide } from '../types';
import {
  X,
  Phone,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  Navigation,
  Car,
  QrCode,
  Star,
  Receipt,
  RotateCcw,
} from 'lucide-react';

interface ActiveTripModalProps {
  ride: ActiveRide | null;
  onClose: () => void;
  onCancelRide: (rideId: string) => void;
  onCompleteRide: (rideId: string, rating: number) => void;
}

export const ActiveTripModal: React.FC<ActiveTripModalProps> = ({
  ride,
  onClose,
  onCancelRide,
  onCompleteRide,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(18);
  const [simulatedStatus, setSimulatedStatus] = useState<
    'approaching' | 'arrived' | 'in_transit' | 'completed'
  >('approaching');
  const [userRating, setUserRating] = useState<number>(5);
  const [tipAmount, setTipAmount] = useState<number>(3);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    if (!ride) return;

    // Reset countdown for active demo
    setSecondsRemaining(15);
    setSimulatedStatus('approaching');

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSimulatedStatus('arrived');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ride?.id]);

  if (!ride) return null;

  const handleStartTransit = () => {
    setSimulatedStatus('in_transit');
    setTimeout(() => {
      setSimulatedStatus('completed');
    }, 5000);
  };

  const handleFinish = () => {
    onCompleteRide(ride.id, userRating);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-sm font-bold text-white tracking-tight">
              {simulatedStatus === 'approaching' && 'Vehicle Approaching on Road'}
              {simulatedStatus === 'arrived' && 'Vehicle Arrived at Curbside'}
              {simulatedStatus === 'in_transit' && 'In Transit on Roadway'}
              {simulatedStatus === 'completed' && 'Trip Completed'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Progress Banner */}
          {simulatedStatus === 'approaching' && (
            <div className="p-4 bg-cyan-950/40 border border-cyan-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-300 font-medium">Estimated Arrival</span>
                <span className="text-lg font-bold text-cyan-400 font-mono tabular-nums">
                  {secondsRemaining}s
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${Math.max(5, ((15 - secondsRemaining) / 15) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Driver {ride.vehicle.driver.name} is on {ride.vehicle.location.streetName} heading to your pickup spot.
              </p>
            </div>
          )}

          {simulatedStatus === 'arrived' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Driver is at your roadside point!</span>
              </div>
              <p className="text-xs text-slate-300">
                Look for the <span className="font-semibold text-white">{ride.vehicle.model}</span> with plate{' '}
                <span className="font-mono text-cyan-300 font-bold">{ride.vehicle.plateNumber}</span>.
              </p>
              <button
                onClick={handleStartTransit}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Board Vehicle & Start Journey
              </button>
            </div>
          )}

          {simulatedStatus === 'in_transit' && (
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
                <span>Cruising on Main Arterial Corridor</span>
                <span className="font-mono tabular-nums">54 km/h</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-2/3 animate-pulse rounded-full" />
              </div>
              <p className="text-[11px] text-slate-400">Heading towards destination. Arriving shortly.</p>
            </div>
          )}

          {simulatedStatus === 'completed' && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Journey Complete!</h4>
                <p className="text-xs text-slate-400">Total Charged: ${ride.fareEstimate.toFixed(2)}</p>
              </div>

              {/* Rating */}
              <div className="space-y-1">
                <div className="text-xs text-slate-300">Rate your driver:</div>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= userRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tip selector */}
              <div className="space-y-1">
                <div className="text-xs text-slate-300">Add driver tip:</div>
                <div className="flex items-center justify-center gap-2">
                  {[0, 2, 3, 5, 10].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTipAmount(amt)}
                      className={`px-3 py-1 text-xs rounded-lg border font-mono transition-colors cursor-pointer ${
                        tipAmount === amt
                          ? 'bg-cyan-600 border-cyan-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {amt === 0 ? 'No tip' : `$${amt}`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close & Save Receipt
              </button>
            </div>
          )}

          {/* Vehicle & Driver Card */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                  <img
                    src={ride.vehicle.image}
                    alt={ride.vehicle.model}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ride.vehicle.model}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">{ride.vehicle.plateNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ride.vehicle.callsign}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Fare</span>
                <div className="text-base font-bold text-white font-mono tabular-nums">
                  ${ride.fareEstimate.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Driver Contact & Hop-On Pass */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                  {ride.vehicle.driver.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{ride.vehicle.driver.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{ride.vehicle.driver.phone}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCalling(true);
                  setTimeout(() => {
                    setIsCalling(false);
                    alert(`Dialing driver ${ride.vehicle.driver.name}...`);
                  }, 800);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isCalling ? 'Dialing...' : 'Call'}</span>
              </button>
            </div>
          </div>

          {/* Hop-On Verification Pass Code */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/90 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2.5">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-white">Roadside Hop-On Pass</div>
                <div className="text-[11px] text-slate-400">Show to driver upon boarding</div>
              </div>
            </div>
            <span className="font-mono text-base font-bold text-cyan-400 tracking-widest bg-slate-900 px-3 py-1 rounded-md border border-slate-700">
              {ride.qrPass}
            </span>
          </div>

          {/* Pickup & Dropoff Route Nodes */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
              <div>
                <span className="text-slate-500">Roadside Pickup:</span>
                <span className="text-slate-200 font-medium ml-1.5">{ride.pickupStreet}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-400 mt-1 shrink-0" />
              <div>
                <span className="text-slate-500">Destination:</span>
                <span className="text-slate-200 font-medium ml-1.5">{ride.dropoffStreet}</span>
              </div>
            </div>
          </div>

          {/* Cancel button if not completed */}
          {simulatedStatus !== 'completed' && (
            <button
              onClick={() => onCancelRide(ride.id)}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
            >
              Cancel This Dispatch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
