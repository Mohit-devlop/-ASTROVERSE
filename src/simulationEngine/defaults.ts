import { SimulationState, Planet, Difficulty, HabitatModule, ModuleType } from './types';

export const INITIAL_MODULES: Record<ModuleType, HabitatModule> = {
  HABITAT: {
    id: 'HABITAT',
    name: 'Primary Pressurized Habitat',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 3.5,
    outputMultiplier: 1.0,
    description: 'Central pressurized living module with airlocks, crew quarters, and avionics.',
    buildCostMaterials: 0,
    iconName: 'Home',
    unlocked: true,
  },
  OXYGEN_GENERATOR: {
    id: 'OXYGEN_GENERATOR',
    name: 'Electrolyzer / MOXIE System',
    level: 1,
    status: 'ONLINE',
    health: 98,
    powerDemandKw: 2.2,
    outputMultiplier: 1.0,
    description: 'Splits water into breathable O2 via electrolysis (or atmospheric CO2 on Mars).',
    buildCostMaterials: 80,
    iconName: 'Wind',
    unlocked: true,
  },
  CO2_SCRUBBER: {
    id: 'CO2_SCRUBBER',
    name: 'CDRA Carbon Dioxide Scrubber',
    level: 1,
    status: 'ONLINE',
    health: 95,
    powerDemandKw: 1.4,
    outputMultiplier: 1.0,
    description: 'Zeolite & amine regenerative beds that scrub toxic CO2 exhaled by the crew.',
    buildCostMaterials: 75,
    iconName: 'Filter',
    unlocked: true,
  },
  WATER_RECOVERY: {
    id: 'WATER_RECOVERY',
    name: 'Closed-Loop Water Recovery (WRS)',
    level: 1,
    status: 'ONLINE',
    health: 96,
    powerDemandKw: 1.8,
    outputMultiplier: 1.0,
    description: 'Recovers up to 90% of habitat moisture, sweat, and urine into pure drinking water.',
    buildCostMaterials: 90,
    iconName: 'Droplet',
    unlocked: true,
  },
  SOLAR_ARRAY: {
    id: 'SOLAR_ARRAY',
    name: 'Photovoltaic Solar Array',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 0.1,
    outputMultiplier: 1.0,
    description: 'Triple-junction solar cell tracking arrays providing daytime electrical power.',
    buildCostMaterials: 100,
    iconName: 'Sun',
    unlocked: true,
  },
  BATTERY_STORAGE: {
    id: 'BATTERY_STORAGE',
    name: 'Regenerative Fuel Cell & Battery Bank',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 0.2,
    outputMultiplier: 1.0,
    description: 'High-density lithium-sulfur & fuel cell bank for nighttime and storm reserve power.',
    buildCostMaterials: 120,
    iconName: 'BatteryCharging',
    unlocked: true,
  },
  GREENHOUSE: {
    id: 'GREENHOUSE',
    name: 'Hydroponic Crop Greenhouse',
    level: 1,
    status: 'ONLINE',
    health: 94,
    powerDemandKw: 2.5,
    outputMultiplier: 1.0,
    description: 'LED-illuminated aeroponic growth chambers producing fresh vegetables and supplementary O2.',
    buildCostMaterials: 150,
    iconName: 'Sprout',
    unlocked: true,
  },
  RADIATION_SHELTER: {
    id: 'RADIATION_SHELTER',
    name: 'Sub-Regolith Storm Shelter',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 0.8,
    outputMultiplier: 1.0,
    description: 'Heavily shielded subterranean bunker providing critical protection during solar storms.',
    buildCostMaterials: 180,
    iconName: 'Shield',
    unlocked: true,
  },
  SCIENCE_LAB: {
    id: 'SCIENCE_LAB',
    name: 'Astrobiology & Geology Lab',
    level: 1,
    status: 'ONLINE',
    health: 97,
    powerDemandKw: 1.6,
    outputMultiplier: 1.0,
    description: 'Spectrometers and analytical chambers to discover resource deposits and generate science data.',
    buildCostMaterials: 130,
    iconName: 'FlaskConical',
    unlocked: true,
  },
  ROVER_STATION: {
    id: 'ROVER_STATION',
    name: 'Pressurized Rover Dock',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 1.2,
    outputMultiplier: 1.0,
    description: 'Maintenance bay and charging station for planetary exploration and ice haulers.',
    buildCostMaterials: 140,
    iconName: 'Truck',
    unlocked: true,
  },
  MEDICAL_BAY: {
    id: 'MEDICAL_BAY',
    name: 'Telemedicine Diagnostic Bay',
    level: 1,
    status: 'ONLINE',
    health: 100,
    powerDemandKw: 1.0,
    outputMultiplier: 1.0,
    description: 'Hyperbaric treatment, biometric monitors, and autonomous surgical assistance.',
    buildCostMaterials: 160,
    iconName: 'Activity',
    unlocked: true,
  },
  THERMAL_RADIATOR: {
    id: 'THERMAL_RADIATOR',
    name: 'Active Thermal Control Radiators',
    level: 1,
    status: 'ONLINE',
    health: 98,
    powerDemandKw: 1.5,
    outputMultiplier: 1.0,
    description: 'Ammonia fluid loop radiators maintaining habitat interior at a comfortable 21°C.',
    buildCostMaterials: 110,
    iconName: 'ThermometerSnowflake',
    unlocked: true,
  },
};

export function createDefaultState(
  planet: Planet = 'MOON',
  difficulty: Difficulty = 'CADET'
): SimulationState {
  const isMoon = planet === 'MOON';

  // Difficulty adjustment factors
  const diffMultiplier = difficulty === 'CADET' ? 1.3 : difficulty === 'EXPLORER' ? 1.0 : 0.8;

  return {
    planet,
    difficulty,
    simSpeed: 1,
    sol: 1,
    hourOfSol: 8.0, // 08:00 AM local mission time
    elapsedHours: 0,
    isPaused: false,

    // Atmosphere & Oxygen (NASA benchmark: ~0.84 kg O2/day per person * 4 = ~3.36 kg/day = 0.14 kg/h)
    oxygenKg: Math.round(150 * diffMultiplier),
    oxygenCapacityKg: 300,
    oxygenProductionRateKgH: 0.18, // Can exceed consumption when online
    oxygenConsumptionRateKgH: 0.14,

    // Carbon Dioxide (NASA benchmark: ~1.0 kg CO2/day per person * 4 = 4.0 kg/day = 0.167 kg/h)
    co2Ppm: 520, // Clean cabin baseline (safe < 1000 ppm)
    co2AccumulatedKg: 1.2,
    co2ScrubberCapacityKgH: 0.20,

    // Water System (NASA benchmark: ~2.5 kg H2O/day per person * 4 = 10.0 kg/day = 0.416 kg/h)
    waterKg: Math.round(280 * diffMultiplier),
    waterCapacityKg: 500,
    wastewaterKg: 15,
    waterConsumptionRateKgH: 0.42,
    waterRecoveryRateKgH: 0.50, // Capacity exceeds crew generation (0.42 * 0.95 = ~0.40) to keep wastewater managed
    waterRecoveryEfficiency: 0.90, // ISS 90% benchmark

    // Food & Hydroponics (NASA benchmark: ~0.62 kg/day per person * 4 = ~2.48 kg/day = ~0.103 kg/h)
    foodKg: Math.round(180 * diffMultiplier),
    foodCapacityKg: 400,
    foodConsumptionRateKgH: 0.103,
    greenhouseCropProgress: 15,
    greenhouseWaterDrainKgH: 0.08,

    // Power Grid
    batteryKwh: Math.round(90 * diffMultiplier),
    batteryCapacityKwh: 120,
    solarKw: isMoon ? 18.5 : 12.0, // Moon receives more direct solar flux than Mars
    baseSolarKw: isMoon ? 18.5 : 12.0,
    powerDemandKw: 15.2,
    backupFuelCellActive: false,

    // Environmental Physics
    cabinPressureKpa: 101.3, // Earth nominal
    cabinTempC: 21.0,
    externalTempC: isMoon ? 85.0 : -45.0, // Moon day is +85C to +120C, Mars midday is -45C
    surfaceGravity: isMoon ? 1.62 : 3.71, // m/s²
    radiationMsvPerHour: isMoon ? 0.045 : 0.028, // Mars atmosphere provides slight shielding
    cumulativeRadiationMsv: 1.2,
    dustAtmosphericOpacity: 0.02,
    hullIntegrity: 100,

    // Materials & Science
    materialsKg: 150,
    scienceDataPoints: 20,

    // Subsystems & Crew
    modules: JSON.parse(JSON.stringify(INITIAL_MODULES)),
    crew: [
      {
        id: 'c1',
        name: 'Alex Rivera',
        role: 'Commander',
        health: 100,
        hydration: 98,
        stamina: 100,
        status: 'nominal',
        suitIntegrity: 100,
      },
      {
        id: 'c2',
        name: 'Dr. Maya Lin',
        role: 'Life Support Engineer',
        health: 100,
        hydration: 95,
        stamina: 96,
        status: 'nominal',
        suitIntegrity: 100,
      },
      {
        id: 'c3',
        name: 'Tariq Al-Mansoor',
        role: 'Planetary Geologist',
        health: 98,
        hydration: 96,
        stamina: 94,
        status: 'nominal',
        suitIntegrity: 98,
      },
      {
        id: 'c4',
        name: 'Dr. Elena Rostova',
        role: 'Medical Specialist',
        health: 100,
        hydration: 99,
        stamina: 97,
        status: 'nominal',
        suitIntegrity: 100,
      },
    ],

    astronautProfile: {
      name: 'Commander Nova',
      suitColor: '#3b82f6',
      suitName: 'Artemis Advanced Mark IV',
      helmetStyle: 'Artemis Vizor',
      emblem: 'Artemis Eagle',
      callsign: 'PIONEER-1',
    },

    activeEmergency: null,
    emergencyHistory: [],
    telemetryHistory: [],

    isGameOver: false,
    gameOverReason: null,
    missionVictory: false,
    score: 0,
  };
}
