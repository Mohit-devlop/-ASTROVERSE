import { SimulationState } from '../simulationEngine/types';

export interface NovaMessage {
  id: string;
  sender: 'NOVA' | 'COMMANDER';
  text: string;
  timestamp: string;
  category: 'TELEMETRY' | 'WARNING' | 'SCIENCE' | 'TACTICAL' | 'ADVICE';
}

export interface NovaTelemetryAnalysis {
  oxygenHoursLeft: number;
  waterHoursLeft: number;
  foodHoursLeft: number;
  batteryHoursLeft: number;
  criticalWarnings: string[];
  systemHealthSummary: string;
  recommendedAction: string;
}

export function analyzeTelemetry(state: SimulationState): NovaTelemetryAnalysis {
  // Real math calculations based on current state
  const netO2Rate = Math.max(0.001, state.oxygenConsumptionRateKgH - (state.modules.OXYGEN_GENERATOR.status === 'ONLINE' ? state.oxygenProductionRateKgH : 0));
  const oxygenHoursLeft = netO2Rate > 0 && state.oxygenKg > 0 ? Math.round((state.oxygenKg / netO2Rate) * 10) / 10 : 999;

  const netWaterRate = Math.max(0.001, state.waterConsumptionRateKgH - (state.modules.WATER_RECOVERY.status === 'ONLINE' ? state.waterRecoveryRateKgH : 0));
  const waterHoursLeft = netWaterRate > 0 && state.waterKg > 0 ? Math.round((state.waterKg / netWaterRate) * 10) / 10 : 999;

  const foodHoursLeft = state.foodConsumptionRateKgH > 0 && state.foodKg > 0 ? Math.round((state.foodKg / state.foodConsumptionRateKgH) * 10) / 10 : 999;

  const netPowerDrain = Math.max(0.001, state.powerDemandKw - state.solarKw);
  const batteryHoursLeft = netPowerDrain > 0 && state.batteryKwh > 0 ? Math.round((state.batteryKwh / netPowerDrain) * 10) / 10 : 999;

  const criticalWarnings: string[] = [];
  if (state.oxygenKg < 20) criticalWarnings.push(`CRITICAL OXYGEN: Only ${state.oxygenKg.toFixed(1)} kg remaining (${oxygenHoursLeft} hours left).`);
  if (state.co2Ppm > 2500) criticalWarnings.push(`ELEVATED CO2: Cabin concentration at ${state.co2Ppm} ppm. Scrubber maintenance recommended.`);
  if (state.waterKg < 30) criticalWarnings.push(`LOW WATER: Reserves depleted to ${state.waterKg.toFixed(1)} kg (${waterHoursLeft} hours left).`);
  if (state.batteryKwh < 15 && state.solarKw < 2) criticalWarnings.push(`POWER GRID DEFICIT: Battery at ${state.batteryKwh.toFixed(1)} kWh. Night/storm brownout imminent.`);
  if (state.cabinPressureKpa < 85) criticalWarnings.push(`PRESSURE WARNING: Cabin pressure dropped to ${state.cabinPressureKpa.toFixed(1)} kPa. Check hull seal.`);
  if (state.cabinTempC < 14 || state.cabinTempC > 28) criticalWarnings.push(`THERMAL STRESS: Cabin at ${state.cabinTempC.toFixed(1)}°C. Radiator loop requires adjustment.`);

  let recommendedAction = 'Maintain current operations. All primary life-support parameters are within nominal thresholds.';
  if (criticalWarnings.length > 0) {
    if (state.oxygenKg < 20) {
      recommendedAction = 'Activate emergency oxygen reserve bleed or prioritize repair of the Electrolyzer Module immediately.';
    } else if (state.co2Ppm > 2500) {
      recommendedAction = 'Power on CDRA Carbon Dioxide Scrubber and inspect zeolite desiccant filter beds.';
    } else if (state.batteryKwh < 15) {
      recommendedAction = 'Disable Science Lab and Rover chargers to balance the electrical grid.';
    } else if (state.cabinPressureKpa < 85) {
      recommendedAction = 'Seal interior bulkheads and apply epoxy patch to isolate hull micro-fissure.';
    }
  }

  const systemHealthSummary = `Habitat nominal: O2 at ${state.oxygenKg.toFixed(1)} kg, CO2 at ${state.co2Ppm} ppm, Power at ${state.batteryKwh.toFixed(1)} kWh.`;

  return {
    oxygenHoursLeft,
    waterHoursLeft,
    foodHoursLeft,
    batteryHoursLeft,
    criticalWarnings,
    systemHealthSummary,
    recommendedAction,
  };
}

// Built-in Space Science Knowledge Base for Q&A
export const SCIENCE_KNOWLEDGE_BASE: { keywords: string[]; answer: string; category: NovaMessage['category'] }[] = [
  {
    keywords: ['oxygen', 'electrolysis', 'make air', 'moxie', 'breathe'],
    answer: 'Oxygen on the Moon is generated via water electrolysis: 2H2O + electrical energy -> 2H2 + O2. On Mars, NASA demonstrated the MOXIE instrument on Perseverance, which splits Martian atmospheric carbon dioxide: 2CO2 -> 2CO + O2 at 800°C, producing breathable oxygen directly from thin air!',
    category: 'SCIENCE',
  },
  {
    keywords: ['co2', 'carbon dioxide', 'scrubber', 'poison', 'ppm', 'headache'],
    answer: 'Human respiration exhales ~1.0 kg of CO2 per astronaut each day. Without removal, CO2 rises above 2,500 ppm causing headaches, confusion, and acidosis. Habitats use Regenerative Amine beds or synthetic zeolites (CDRA) to capture CO2 and vent it or react it with hydrogen via the Sabatier reaction to recover water!',
    category: 'SCIENCE',
  },
  {
    keywords: ['water', 'recycling', 'urine', 'filter', 'sweat'],
    answer: 'On the ISS, NASA\'s Environmental Control and Life Support System (ECLSS) recovers approximately 90% to 98% of all water from sweat, breath moisture, and urine using vacuum rotary distillation and catalytic oxidation. On Moon or Mars, ice extracted from shadowed polar craters replenishes losses.',
    category: 'SCIENCE',
  },
  {
    keywords: ['radiation', 'solar storm', 'spe', 'cancer', 'shielding', 'regolith'],
    answer: 'Beyond Earth\'s magnetosphere, astronauts face Galactic Cosmic Rays (GCR) and episodic Solar Particle Events (SPE). 1 to 2 meters of packed lunar or Martian regolith (soil) or polyethylene/water walls provide vital shielding by absorbing high-energy protons and atomic nuclei.',
    category: 'SCIENCE',
  },
  {
    keywords: ['gravity', 'moon gravity', 'mars gravity', 'weight', 'bones'],
    answer: 'The Moon has 1.62 m/s² gravity (~1/6th Earth), while Mars has 3.71 m/s² (~38% Earth). In low gravity, human bone density decreases by ~1% per month and muscle mass atrophies without daily resistive exercise and high-calcium nutrition.',
    category: 'SCIENCE',
  },
  {
    keywords: ['power', 'solar', 'dust storm', 'battery', 'electricity'],
    answer: 'Solar irradiance on Mars is only ~590 W/m² compared to 1361 W/m² on the Moon. Dust storms on Mars coat photovoltaic glass and dim the sky, necessitating regenerative fuel cells, surface nuclear microreactors (like NASA Kilopower), or electrostatic dust-repulsion coatings.',
    category: 'SCIENCE',
  },
  {
    keywords: ['food', 'greenhouse', 'plants', 'crops', 'farming'],
    answer: 'Space greenhouse farming utilizes aeroponics and LED spectrums tailored for chlorophyll absorption (660nm red & 450nm blue). Martian regolith contains toxic perchlorate salts which must be chemically leached before mixing with organic compost for root cultivation.',
    category: 'SCIENCE',
  },
  {
    keywords: ['pressure', 'vacuum', 'suit', 'decompression', 'leak'],
    answer: 'Earth sea-level pressure is 101.3 kPa. Habitats maintain Earth-normal air or a 56 kPa enriched O2 blend. If cabin pressure drops below the Armstrong Limit (~6.3 kPa), bodily fluids boil at normal body temperature (37°C). Rapid sealing of micrometeorite punctures is crucial.',
    category: 'SCIENCE',
  },
];

export function askNova(query: string, state: SimulationState): NovaMessage {
  const lower = query.toLowerCase().trim();
  const telemetry = analyzeTelemetry(state);

  // Dynamic context queries
  if (lower.includes('status') || lower.includes('report') || lower.includes('how are we doing') || lower.includes('briefing')) {
    const alerts = telemetry.criticalWarnings.length > 0 ? telemetry.criticalWarnings.join(' ') : 'All telemetry channels report nominal status.';
    return {
      id: `nova-${Date.now()}`,
      sender: 'NOVA',
      text: `Commander, Sol ${state.sol} status report: Oxygen reserves stand at ${state.oxygenKg.toFixed(1)} kg (${telemetry.oxygenHoursLeft}h). CO2 level is ${state.co2Ppm} ppm. Water reserves: ${state.waterKg.toFixed(1)} kg. Power battery: ${state.batteryKwh.toFixed(1)} kWh. ${alerts} Tactical recommendation: ${telemetry.recommendedAction}`,
      timestamp: new Date().toLocaleTimeString(),
      category: 'TELEMETRY',
    };
  }

  if (lower.includes('oxygen') && (lower.includes('left') || lower.includes('time') || lower.includes('last') || lower.includes('how much'))) {
    return {
      id: `nova-${Date.now()}`,
      sender: 'NOVA',
      text: `Commander, current oxygen reserves are ${state.oxygenKg.toFixed(1)} kg. With 4 crew members consuming ~${state.oxygenConsumptionRateKgH.toFixed(3)} kg/h and generator generating ${state.modules.OXYGEN_GENERATOR.status === 'ONLINE' ? state.oxygenProductionRateKgH.toFixed(3) : '0.00'} kg/h, approximately ${telemetry.oxygenHoursLeft} hours of breathable oxygen remain under the current simulation parameters.`,
      timestamp: new Date().toLocaleTimeString(),
      category: 'TELEMETRY',
    };
  }

  if (lower.includes('power') && (lower.includes('left') || lower.includes('battery') || lower.includes('solar'))) {
    return {
      id: `nova-${Date.now()}`,
      sender: 'NOVA',
      text: `Electrical grid telemetry: Solar generation is currently producing ${state.solarKw.toFixed(1)} kW against a total outpost demand of ${state.powerDemandKw.toFixed(1)} kW. Battery storage is at ${state.batteryKwh.toFixed(1)} / ${state.batteryCapacityKwh} kWh (${telemetry.batteryHoursLeft}h reserve at net discharge).`,
      timestamp: new Date().toLocaleTimeString(),
      category: 'TELEMETRY',
    };
  }

  // Check Science Knowledge Base
  for (const item of SCIENCE_KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return {
        id: `nova-${Date.now()}`,
        sender: 'NOVA',
        text: item.answer,
        timestamp: new Date().toLocaleTimeString(),
        category: item.category,
      };
    }
  }

  // Fallback intelligent response
  return {
    id: `nova-${Date.now()}`,
    sender: 'NOVA',
    text: `Understood, Commander. My planetary database is processing your inquiry regarding "${query}". For maximum survival efficiency, continue monitoring cabin pressure (${state.cabinPressureKpa.toFixed(1)} kPa), water recycling (${state.waterKg.toFixed(1)} kg), and power grid stability. You can ask me about oxygen electrolysis, radiation protection, Martian gravity, water recycling, or habitat power.`,
    timestamp: new Date().toLocaleTimeString(),
    category: 'ADVICE',
  };
}

// Browser Web Speech API Synthesizer
export function speakNova(text: string, enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel(); // Stop existing speech
    // Clean text of technical symbols for smooth speech
    const cleanText = text.replace(/[\(\)\[\]{}#*_]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1; // Futuristic slightly higher AI cadence

    // Choose preferred English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Zira')));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}

