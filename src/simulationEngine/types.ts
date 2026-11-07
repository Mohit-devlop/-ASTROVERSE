// ASTROVERSE - Types & Data Models
// NASA Space Apps Challenge 2026 Junior Astronaut Mission Trainer

export type Planet = 'MOON' | 'MARS';
export type Difficulty = 'CADET' | 'EXPLORER' | 'COMMANDER';
export type SimSpeed = 0 | 1 | 3 | 10; // 0 = Paused, 1 = 1x, 3 = 3x, 10 = 10x

export interface AstronautProfile {
  name: string;
  suitColor: string; // hex code
  suitName: string;
  helmetStyle: 'Apollo Bubble' | 'Artemis Vizor' | 'Mars Vanguard' | 'Deep Space Sentinel';
  emblem: 'Artemis Eagle' | 'Mars Explorer' | 'Orion Pioneer' | 'Starbound';
  callsign: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'Commander' | 'Life Support Engineer' | 'Planetary Geologist' | 'Medical Specialist';
  health: number; // 0 - 100
  hydration: number; // 0 - 100
  stamina: number; // 0 - 100
  status: 'nominal' | 'strained' | 'critical' | 'sheltered';
  suitIntegrity: number; // 0 - 100
}

export type ModuleType =
  | 'HABITAT'
  | 'OXYGEN_GENERATOR'
  | 'CO2_SCRUBBER'
  | 'WATER_RECOVERY'
  | 'SOLAR_ARRAY'
  | 'BATTERY_STORAGE'
  | 'GREENHOUSE'
  | 'RADIATION_SHELTER'
  | 'SCIENCE_LAB'
  | 'ROVER_STATION'
  | 'MEDICAL_BAY'
  | 'THERMAL_RADIATOR';

export interface HabitatModule {
  id: ModuleType;
  name: string;
  level: number; // 1, 2, or 3
  status: 'ONLINE' | 'OFFLINE' | 'DAMAGED' | 'UPGRADING';
  health: number; // 0 - 100%
  powerDemandKw: number;
  outputMultiplier: number;
  description: string;
  buildCostMaterials: number;
  iconName: string;
  unlocked: boolean;
}

export interface EmergencyOption {
  id: string;
  label: string;
  description: string;
  costDescription: string;
  resourceDeltas?: Partial<{
    waterKg: number;
    powerKwh: number;
    foodKg: number;
    oxygenKg: number;
    materials: number;
  }>;
  crewHealthImpact?: number;
  successChance: number; // 0.0 - 1.0
  resolutionMessage: string;
  failureMessage: string;
}

export interface EmergencyEvent {
  id: string;
  title: string;
  type:
    | 'OXYGEN_FAILURE'
    | 'CO2_FAILURE'
    | 'WATER_LEAK'
    | 'SOLAR_STORM'
    | 'POWER_GRID_SHORT'
    | 'HULL_BREACH'
    | 'CROP_BLIGHT'
    | 'MEDICAL_EMERGENCY'
    | 'MARS_DUST_STORM'
    | 'LUNAR_COLD_SNAP'
    | 'COMMS_BLACKOUT'
    | 'THERMAL_FAILURE';
  severity: 'WARNING' | 'CRITICAL' | 'CATASTROPHIC';
  description: string;
  scientificContext: string;
  options: EmergencyOption[];
  activeSol: number;
  handled: boolean;
}

export interface TelemetryPoint {
  timeSol: number;
  timeHour: number;
  oxygenKg: number;
  co2Ppm: number;
  waterKg: number;
  batteryKwh: number;
  solarKw: number;
  cabinPressureKpa: number;
  cabinTempC: number;
  crewHealthAvg: number;
}

export interface SimulationState {
  planet: Planet;
  difficulty: Difficulty;
  simSpeed: SimSpeed;
  sol: number; // Sol count (or lunar day)
  hourOfSol: number; // 0 - 24.6 for Mars, 0 - 24 for Moon educational model
  elapsedHours: number;
  isPaused: boolean;

  // Atmosphere & Life Support
  oxygenKg: number;
  oxygenCapacityKg: number;
  oxygenProductionRateKgH: number;
  oxygenConsumptionRateKgH: number;

  co2Ppm: number; // Safe < 1000, Warning > 2500, Dangerous > 5000
  co2AccumulatedKg: number;
  co2ScrubberCapacityKgH: number;

  // Water System
  waterKg: number;
  waterCapacityKg: number;
  wastewaterKg: number;
  waterConsumptionRateKgH: number;
  waterRecoveryRateKgH: number;
  waterRecoveryEfficiency: number; // ~0.90 ISS benchmark

  // Food & Hydroponics
  foodKg: number;
  foodCapacityKg: number;
  foodConsumptionRateKgH: number;
  greenhouseCropProgress: number; // 0 - 100%
  greenhouseWaterDrainKgH: number;

  // Power Grid
  batteryKwh: number;
  batteryCapacityKwh: number;
  solarKw: number;
  baseSolarKw: number;
  powerDemandKw: number;
  backupFuelCellActive: boolean;

  // Environmental Physics
  cabinPressureKpa: number; // 101.3 kPa nominal Earth standard
  cabinTempC: number; // 21.0 C nominal
  externalTempC: number;
  surfaceGravity: number; // 1.62 m/s² Moon, 3.71 m/s² Mars
  radiationMsvPerHour: number;
  cumulativeRadiationMsv: number;
  dustAtmosphericOpacity: number; // 0.0 to 1.0 (Mars tau / lunar dust)
  hullIntegrity: number; // 0 - 100%

  // Construction & Materials
  materialsKg: number;
  scienceDataPoints: number;

  // Subsystems & Crew
  modules: Record<ModuleType, HabitatModule>;
  crew: CrewMember[];
  astronautProfile: AstronautProfile;

  // Active Emergency
  activeEmergency: EmergencyEvent | null;
  emergencyHistory: { title: string; sol: number; outcome: string; solved: boolean }[];

  // Historical Telemetry for telemetry charts
  telemetryHistory: TelemetryPoint[];

  // Mission progress flags
  isGameOver: boolean;
  gameOverReason: string | null;
  missionVictory: boolean;
  score: number;
}

export interface MissionDefinition {
  id: string;
  campaign: Planet;
  order: number;
  title: string;
  subtitle: string;
  briefing: string;
  learningObjective: string;
  durationSols: number;
  initialResources: Partial<SimulationState>;
  objectives: {
    id: string;
    description: string;
    isCompleted: (state: SimulationState) => boolean;
  }[];
  educationalFact: string;
  nasaRefUrl: string;
  rewardPoints: number;
}

