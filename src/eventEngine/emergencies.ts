import { EmergencyEvent, SimulationState } from '../simulationEngine/types';

// Seeded pseudo-random number generator for deterministic event reproducibility
export class SeededRNG {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export const EMERGENCY_TEMPLATES: Omit<EmergencyEvent, 'id' | 'activeSol' | 'handled'>[] = [
  {
    title: 'SOLAR PARTICLE EVENT (SPE) ALERT',
    type: 'SOLAR_STORM',
    severity: 'CRITICAL',
    description: 'Deep Space Climate Observatory detects an intense coronal mass ejection inbound. High-energy protons will strike the outpost within 30 minutes!',
    scientificContext: 'Solar Particle Events can expose astronauts to lethal ionizing radiation doses exceeding 500 mSv if unshielded, causing acute radiation sickness.',
    options: [
      {
        id: 'shelter_crew',
        label: 'A. Order Immediate Evacuation to Sub-Regolith Shelter',
        description: 'Move all 4 crew members into the heavily shielded bunker until the flux subsides. Normal science and outdoor operations pause.',
        costDescription: 'Halts research for 12 hours. Crew radiation exposure reduced by 95%.',
        resourceDeltas: { powerKwh: -5 },
        crewHealthImpact: 0,
        successChance: 0.98,
        resolutionMessage: 'Crew safely hunkered inside the sub-regolith storm shelter. Radiation dosage kept within safe nominal limits.',
        failureMessage: 'Minor delays during shelter ingress, slight radiation exposure recorded.',
      },
      {
        id: 'magnetic_deflector',
        label: 'B. Overdrive Active Electromagnetic Shielding Array',
        description: 'Channel massive battery power into the experimental habitat magnetic deflector coils to maintain work inside main modules.',
        costDescription: 'Consumes 35 kWh battery reserves. High risk of electrical stress.',
        resourceDeltas: { powerKwh: -35 },
        crewHealthImpact: -5,
        successChance: 0.85,
        resolutionMessage: 'Magnetic deflector successfully deflected 80% of energetic solar protons, preserving habitat operations.',
        failureMessage: 'Shield coils overheated! Battery drained significantly and crew received elevated ionizing dosage.',
      },
      {
        id: 'stay_cautious',
        label: 'C. Suspend EVAs Only (Remain in Living Quarters)',
        description: 'Keep crew inside standard modules with secondary water wall shielding while continuing basic tasks.',
        costDescription: 'Zero power cost, but crew absorbs moderate radiation dosage.',
        resourceDeltas: {},
        crewHealthImpact: -15,
        successChance: 0.7,
        resolutionMessage: 'Solar storm was less intense than predicted. Crew experienced minor fatigue but outpost maintained workflow.',
        failureMessage: 'Radiation levels peaked higher than anticipated. Crew suffered acute nausea and cellular oxidative stress.',
      },
    ],
  },
  {
    title: 'OXYGEN GENERATOR ELECTROLYZER FAILURE',
    type: 'OXYGEN_FAILURE',
    severity: 'CRITICAL',
    description: 'Electrolyzer cell stack membrane #2 has ruptured. Hydrogen gas sensor tripped safety shutoffs, cutting all oxygen synthesis.',
    scientificContext: 'Electrolysis uses electricity to split H2O into H2 and O2. A membrane leak risks explosive combustible gas mixtures.',
    options: [
      {
        id: 'replace_membrane',
        label: 'A. Install Backup Solid-Oxide Membrane Cartridge',
        description: 'Use 25 kg spare mechanical parts from storage to replace the blown electrolysis stack immediately.',
        costDescription: 'Costs 25 kg Materials. Restores 100% generator capacity.',
        resourceDeltas: { materials: -25 },
        crewHealthImpact: 0,
        successChance: 0.95,
        resolutionMessage: 'Solid-oxide membrane cartridge swapped and calibrated. Oxygen generation restored to full output.',
        failureMessage: 'Replacement seal misaligned; secondary calibration needed before full output resumed.',
      },
      {
        id: 'emergency_moxie_or_tanks',
        label: 'B. Bleed High-Pressure Emergency Oxygen Tanks',
        description: 'Vent stored high-pressure gas reserve tanks into cabin while running low-power diagnostic bypass.',
        costDescription: 'Burns 15 kg stored oxygen reserves. Zero material cost.',
        resourceDeltas: { oxygenKg: -15 },
        crewHealthImpact: 0,
        successChance: 0.9,
        resolutionMessage: 'Reserve tanks maintained safe cabin partial pressure while engineers patched the cell bypass.',
        failureMessage: 'Reserve valve sticking caused uneven oxygen release before stabilization.',
      },
      {
        id: 'metabolic_reduction',
        label: 'C. Induce Crew Low-Metabolism Rest Cycle',
        description: 'Order crew to enter sleep bunks to slash human oxygen consumption by 40% while attempting manual repair without parts.',
        costDescription: 'Conserves oxygen, but crew stamina takes a hit from forced sleep cycle.',
        resourceDeltas: {},
        crewHealthImpact: -5,
        successChance: 0.75,
        resolutionMessage: 'Reduced respiration allowed the solitary engineer to solder the bypass circuit without depleting air.',
        failureMessage: 'Manual solder failed under pressure; generator remained offline for an additional 6 hours.',
      },
    ],
  },
  {
    title: 'MICROMETEOROID HULL PUNCTURE',
    type: 'HULL_BREACH',
    severity: 'CATASTROPHIC',
    description: 'Hypervelocity micrometeoroid has breached module beta wall! Acoustic sensors pinpoint an 8 mm puncture venting cabin atmosphere to space.',
    scientificContext: 'At near-vacuum space pressures, air escapes rapidly. A drop below 60 kPa leads to severe hypoxia and ebullism.',
    options: [
      {
        id: 'rapid_patch',
        label: 'A. Deploy Fast-Expanding Epoxy Seal Patch',
        description: 'Commander Alex rushes with emergency pressure adhesive patch to seal the interior puncture site.',
        costDescription: 'Costs 10 kg Materials. 98% immediate pressure stabilization.',
        resourceDeltas: { materials: -10 },
        crewHealthImpact: -2,
        successChance: 0.95,
        resolutionMessage: 'Epoxy expansion patch cured instantaneously, halting pressure decay at 94.2 kPa.',
        failureMessage: 'Adhesive required second application under high airflow turbulence.',
      },
      {
        id: 'isolate_bulkhead',
        label: 'B. Seal Module Beta Airlock Bulkhead Doors',
        description: 'Quarantine the punctured module completely. Crew loses access to that wing until an external EVA repair is conducted.',
        costDescription: 'Temporarily takes Science Lab offline. Saves all remaining habitat air.',
        resourceDeltas: { powerKwh: -5 },
        crewHealthImpact: 0,
        successChance: 0.9,
        resolutionMessage: 'Bulkhead sealed tight. Outpost atmosphere stabilized safely while breached module depressurized.',
        failureMessage: 'Slow hatch seal gasket leak required manual ratchet clamping.',
      },
      {
        id: 'external_eva_weld',
        label: 'C. Immediate Two-Person EVA Cold-Weld Repair',
        description: 'Send two astronauts outside immediately to patch the exterior impact crater with titanium sheeting.',
        costDescription: 'Risks crew suit integrity; uses 15 kg Materials.',
        resourceDeltas: { materials: -15 },
        crewHealthImpact: -8,
        successChance: 0.8,
        resolutionMessage: 'Daring EVA cold-weld permanently reinforced the hull structure against future orbital debris.',
        failureMessage: 'Abrasive surface dust complicated vacuum welding torch ignition, stressing astronaut suit joints.',
      },
    ],
  },
  {
    title: 'CARBON DIOXIDE SCRUBBER VALVE JAM',
    type: 'CO2_FAILURE',
    severity: 'CRITICAL',
    description: 'Desorption valve on the Carbon Dioxide Removal Assembly (CDRA) has jammed shut. Cabin CO2 is rising rapidly!',
    scientificContext: 'CO2 concentrations above 3,000 ppm trigger headaches and impaired cognitive function; above 10,000 ppm causes convulsions.',
    options: [
      {
        id: 'clean_valves',
        label: 'A. Manual Backflush and Valve Descaling',
        description: 'Disassemble desiccant beds and flush regolith dust particles using pressurized purge gas.',
        costDescription: 'Costs 5 kg Materials and 4 kWh power.',
        resourceDeltas: { materials: -5, powerKwh: -4 },
        crewHealthImpact: 0,
        successChance: 0.92,
        resolutionMessage: 'Valves cleaned and desorbed. CO2 scrubber back online, pulling cabin ppm down steadily.',
        failureMessage: 'Gasket required extra lubrication before cycling properly.',
      },
      {
        id: 'expendable_lithium_hydroxide',
        label: 'B. Insert Single-Use Lithium Hydroxide (LiOH) Canisters',
        description: 'Deploy backup Apollo-style LiOH chemical canisters to absorb CO2 passively for 24 hours.',
        costDescription: 'Consumes rare emergency expendable chemical pack.',
        resourceDeltas: { materials: -15 },
        crewHealthImpact: 0,
        successChance: 0.99,
        resolutionMessage: 'LiOH canisters rapidly absorbed exhaled CO2, granting ample time to refurbish the main assembly.',
        failureMessage: 'Chemical canister reached saturation earlier than expected.',
      },
      {
        id: 'vent_and_purge',
        label: 'C. Partial Atmosphere Vent and Fresh Air Purge',
        description: 'Vent stale air volume to space and inject pure stored oxygen and nitrogen buffer gas.',
        costDescription: 'Consumes 10 kg Oxygen and drops pressure temporarily.',
        resourceDeltas: { oxygenKg: -10 },
        crewHealthImpact: -4,
        successChance: 0.82,
        resolutionMessage: 'Atmospheric purge cleared toxic CO2 buildup, though reserve oxygen tanks took a hit.',
        failureMessage: 'Purge cycle caused pressure fluctuations that gave the crew acute ear barotrauma.',
      },
    ],
  },
  {
    title: 'MASSIVE MARTIAN DUST STORM',
    type: 'MARS_DUST_STORM',
    severity: 'WARNING',
    description: 'Global hematite dust storm has enveloped the landing site. Atmospheric opacity (tau) has quadrupled, darkening the Martian sky.',
    scientificContext: 'Martian dust storms can last weeks and block over 80% of solar irradiance, starving solar arrays of electrical power.',
    options: [
      {
        id: 'conserve_power',
        label: 'A. Implement Level 3 Energy Rationing Grid',
        description: 'Shut down non-essential lighting, lab centrifuges, and greenhouse growth lamps to preserve battery banks.',
        costDescription: 'Halts greenhouse crop progression for duration of storm.',
        resourceDeltas: {},
        crewHealthImpact: 0,
        successChance: 0.95,
        resolutionMessage: 'Power rationing successfully balanced the grid with minimal solar input until the storm weakened.',
        failureMessage: 'Battery levels dipped into the critical 15% reserve margin before dawn.',
      },
      {
        id: 'electrostatic_cleaning',
        label: 'B. Pulse Electrostatic Dust-Repulsion Panels',
        description: 'Activate high-voltage pulsed electric fields across solar arrays to shed clinging charged dust grains.',
        costDescription: 'Consumes 12 kWh power burst, increases solar efficiency by 35%.',
        resourceDeltas: { powerKwh: -12 },
        crewHealthImpact: 0,
        successChance: 0.88,
        resolutionMessage: 'Electrostatic wave lifted fine iron-oxide dust off solar glass, restoring essential power generation.',
        failureMessage: 'High-voltage inverter circuit blew a capacitor, requiring manual reset.',
      },
      {
        id: 'deploy_backup_fuel_cell',
        label: 'C. Ignite Chemical Regenerative Fuel Cell',
        description: 'React stored hydrogen and oxygen to produce continuous electricity and pure warm water independently of the sun.',
        costDescription: 'Consumes 8 kg Oxygen and produces +9 kg Water and continuous power.',
        resourceDeltas: { oxygenKg: -8, waterKg: 9 },
        crewHealthImpact: 0,
        successChance: 0.98,
        resolutionMessage: 'Fuel cell powered the outpost flawlessly through the darkest hours of the dust storm.',
        failureMessage: 'Fuel cell reactant feed valve fluctuated, producing slightly less wattage than rated.',
      },
    ],
  },
  {
    title: 'WATER RECOVERY CONDENSER LEAK',
    type: 'WATER_LEAK',
    severity: 'CRITICAL',
    description: 'Rotary distillation condenser seals in the Water Recovery System have failed. Gray water is puddling under subfloor conduits.',
    scientificContext: 'Water is priceless in space; every liter recycled reduces multimillion-dollar Earth launch payload requirements.',
    options: [
      {
        id: 'rebuild_condenser',
        label: 'A. Replace Rotary Drum Seals with Space-Grade Silicone',
        description: 'Life Support Engineer Dr. Maya Lin replaces high-friction mechanical seals with reinforced spares.',
        costDescription: 'Costs 15 kg Materials. Restores full closed-loop water recycling.',
        resourceDeltas: { materials: -15 },
        crewHealthImpact: 0,
        successChance: 0.96,
        resolutionMessage: 'Distillation drum resealed. Water recovery efficiency restored to nominal 90%.',
        failureMessage: 'Seal bedding took additional curing time under vacuum clamp.',
      },
      {
        id: 'emergency_dehydration_rations',
        label: 'B. Switch to Emergency High-Concentration Electrolytes',
        description: 'Cut crew drinking water rations by 30% and distribute oral rehydration salts while running slow gravity filtration.',
        costDescription: 'Conserves water without spending materials, but crew hydration drops.',
        resourceDeltas: {},
        crewHealthImpact: -6,
        successChance: 0.85,
        resolutionMessage: 'Rationing bridged the gap until secondary charcoal filters captured the leakage.',
        failureMessage: 'Crew experienced mild dehydration headaches and muscle cramping.',
      },
      {
        id: 'thaw_crater_ice',
        label: 'C. Dispatch Rover to Thaw Surface Regolith Ice',
        description: 'Send rover to extract 30 kg of subsurface polar ice to replenish lost tank volume.',
        costDescription: 'Uses 15 kWh battery to run rover thermal drill.',
        resourceDeltas: { powerKwh: -15, waterKg: 30 },
        crewHealthImpact: -2,
        successChance: 0.88,
        resolutionMessage: 'Rover successfully drilled and melted 30 kg of pristine glacial ice, boosting reserves!',
        failureMessage: 'Subsurface perchlorate salts required extra deionization filtering.',
      },
    ],
  },
];

export function checkForRandomEmergency(
  state: SimulationState,
  rng: SeededRNG
): EmergencyEvent | null {
  if (state.activeEmergency || state.isGameOver) return null;

  // Roughly 5-8% chance per simulated sol
  const roll = rng.next();
  if (roll > 0.08) return null;

  const templateIndex = Math.floor(rng.next() * EMERGENCY_TEMPLATES.length);
  const template = EMERGENCY_TEMPLATES[templateIndex];

  // Tailor to planet: if lunar cold snap on Mars, or dust storm on Moon, swap appropriately
  if (state.planet === 'MOON' && template.type === 'MARS_DUST_STORM') {
    // Swap to Lunar Cold Snap or SPE
    return {
      ...EMERGENCY_TEMPLATES[0], // Solar storm
      id: `spe-${Date.now()}`,
      activeSol: state.sol,
      handled: false,
    };
  }

  return {
    ...template,
    id: `event-${template.type}-${Date.now()}`,
    activeSol: state.sol,
    handled: false,
  };
}

export function resolveEmergency(
  state: SimulationState,
  emergency: EmergencyEvent,
  optionId: string,
  rng: SeededRNG
): { nextState: SimulationState; success: boolean; message: string } {
  const next: SimulationState = JSON.parse(JSON.stringify(state));
  const option = emergency.options.find((o) => o.id === optionId) || emergency.options[0];

  const roll = rng.next();
  const success = roll <= option.successChance;

  // Apply resource deltas
  if (option.resourceDeltas) {
    if (option.resourceDeltas.waterKg) {
      next.waterKg = Math.max(0, next.waterKg + option.resourceDeltas.waterKg);
    }
    if (option.resourceDeltas.oxygenKg) {
      next.oxygenKg = Math.max(0, next.oxygenKg + option.resourceDeltas.oxygenKg);
    }
    if (option.resourceDeltas.powerKwh) {
      next.batteryKwh = Math.max(0, next.batteryKwh + option.resourceDeltas.powerKwh);
    }
    if (option.resourceDeltas.materials) {
      next.materialsKg = Math.max(0, next.materialsKg + option.resourceDeltas.materials);
    }
  }

  // Apply health impact
  if (option.crewHealthImpact) {
    next.crew.forEach((c) => {
      c.health = Math.max(0, Math.min(100, c.health + (option.crewHealthImpact || 0)));
    });
  }

  const message = success ? option.resolutionMessage : option.failureMessage;

  // Clear active emergency
  next.activeEmergency = null;
  next.emergencyHistory.push({
    title: emergency.title,
    sol: state.sol,
    outcome: message,
    solved: success,
  });

  // Award score
  next.score += success ? 250 : 50;

  return { nextState: next, success, message };
}

