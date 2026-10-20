export type VehicleCategory =
  | 'taxi'
  | 'rideshare'
  | 'roadside_assist'
  | 'carshare'
  | 'shuttle';

export type VehicleStatus = 'cruising' | 'curbside_idle' | 'en_route' | 'on_duty_standby';

export interface DriverInfo {
  name: string;
  avatar: string;
  rating: number;
  tripsCompleted: number;
  phone: string;
  badge: string;
}

export interface VehicleLocation {
  x: number; // 0 to 100 percentage on road grid
  y: number; // 0 to 100 percentage on road grid
  streetName: string;
  heading: number; // 0 to 360 degrees
  speedKmh: number;
  roadLane: 'northbound' | 'southbound' | 'eastbound' | 'westbound' | 'curb';
}

export interface Vehicle {
  id: string;
  callsign: string;
  category: VehicleCategory;
  model: string;
  plateNumber: string;
  year: number;
  driver: DriverInfo;
  location: VehicleLocation;
  etaMinutes: number;
  distanceKm: number;
  fuelOrBatteryPct: number;
  isElectric: boolean;
  capacity: {
    passengers: number;
    luggageBags: number;
  };
  price: {
    base: number;
    perKm: number;
    surgeMultiplier: number;
  };
  features: string[];
  image: string;
  status: VehicleStatus;
  description: string;
}

export interface ActiveRide {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  pickupStreet: string;
  dropoffStreet: string;
  fareEstimate: number;
  status: 'dispatching' | 'approaching' | 'arrived' | 'in_transit' | 'completed' | 'cancelled';
  startTime: number;
  estimatedArrivalSec: number;
  emergencyType?: string;
  qrPass: string;
  notes?: string;
  passengerCount: number;
}

export interface RoadAlert {
  id: string;
  type: 'traffic' | 'roadwork' | 'patrol' | 'weather' | 'lane_closure';
  location: string;
  message: string;
  delayMin: number;
  timeReported: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  type: 'highway' | 'boulevard' | 'avenue' | 'ring_road';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  lanes: number;
  speedLimitKmh: number;
  trafficStatus: 'free' | 'moderate' | 'congested';
}
