import { SimulationState, ModuleType } from './types';

/**
 * Executes a single simulation step.
 * @param state Current state
 * @param deltaHours Time delta in simulated hours (e.g., 0.1h = 6 minutes per tick)
 */
export function simulateTick(state: SimulationState, deltaHours: number): SimulationState {
  if (state.isPaused || state.isGameOver || deltaHours <= 0) {
    return state;
  }

  // Clone state to ensure immutability
  const next: SimulationState = JSON.parse(JSON.stringify(state));

  // 1. Time Progression
  const solLengthHours = next.planet === 'MARS' ? 24.65 : 24.0;
  next.elapsedHours += deltaHours;
  next.hourOfSol += deltaHours;

  if (next.hourOfSol >= solLengthHours) {
    next.sol += Math.floor(next.hourOfSol / solLengthHours);
    next.hourOfSol = next.hourOfSol % solLengthHours;
  }

  // 2. Solar Illumination & Day/Night Cycle
  // Simple sinusoidal or polar illumination model
  let solarFactor = 1.0;
  if (next.planet === 'MARS') {
    // 24.65h sol: daylight from ~6:00 to ~18:00
    const daylightAngle = ((next.hourOfSol - 6.0) / 12.0) * Math.PI;
    if (next.hourOfSol >= 6.0 && next.hourOfSol <= 18.0) {
      solarFactor = Math.sin(daylightAngle);
    } else {
      solarFactor = 0.0; // Martian night
    }
  } else {
    // Moon: Polar outpost model (e.g. Shackleton Crater rim: ~80% persistent light with periodic shadow)
    // 24 educational sol model: daylight majority, 4h shadow
    if (next.hourOfSol >= 20.0 || next.hourOfSol < 4.0) {
      solarFactor = 0.0; // Lunar shadow / night
    } else {
      solarFactor = 1.0;
    }
  }

  // Atmosphere dust attenuation (Mars dust storm / lunar regolith dusting)
  const dustMultiplier = Math.max(0.05, 1.0 - next.dustAtmosphericOpacity);
  const solarModule = next.modules.SOLAR_ARRAY;
  const solarHealthMultiplier = solarModule.status === 'ONLINE' ? solarModule.health / 100 : 0;
  next.solarKw = next.baseSolarKw * solarFactor * dustMultiplier * solarHealthMultiplier * solarModule.outputMultiplier;
  next.solarKw = Math.max(0, safeNum(next.solarKw));

  // 3. Power Grid Dispatch & Calculation
  let totalPowerDemandKw = 0;
  (Object.keys(next.modules) as ModuleType[]).forEach((key) => {
    const mod = next.modules[key];
    if (mod.status === 'ONLINE') {
      totalPowerDemandKw += mod.powerDemandKw;
    }
  });
  next.powerDemandKw = safeNum(totalPowerDemandKw);

  const netPowerKw = next.solarKw - next.powerDemandKw;
  const netEnergyKwh = netPowerKw * deltaHours;

  if (netEnergyKwh < 0) {
    // Discharging battery
    const batteryDeficit = Math.abs(netEnergyKwh);
    if (next.batteryKwh >= batteryDeficit) {
      next.batteryKwh -= batteryDeficit;
    } else {
      // Battery depleted! Emergency brownout
      next.batteryKwh = 0;
      // Auto-trip non-critical modules to preserve life support
      if (next.modules.SCIENCE_LAB.status === 'ONLINE') next.modules.SCIENCE_LAB.status = 'OFFLINE';
      if (next.modules.ROVER_STATION.status === 'ONLINE') next.modules.ROVER_STATION.status = 'OFFLINE';
      if (next.modules.GREENHOUSE.status === 'ONLINE') next.modules.GREENHOUSE.status = 'OFFLINE';
    }
  } else {
    // Charging battery
    next.batteryKwh = Math.min(next.batteryCapacityKwh, next.batteryKwh + netEnergyKwh);
  }
  next.batteryKwh = Math.max(0, safeNum(next.batteryKwh));

  const hasPower = next.solarKw > 0.5 || next.batteryKwh > 0.1 || next.backupFuelCellActive;

  // 4. Crew Respiration & Life Support Consumption
  const activeCrewCount = next.crew.filter((c) => c.health > 0).length;

  // Baseline per person: O2: 0.035 kg/h, CO2: 0.0417 kg/h, H2O: 0.104 kg/h, Food: 0.026 kg/h
  next.oxygenConsumptionRateKgH = activeCrewCount * 0.035;
  const co2ProductionRateKgH = activeCrewCount * 0.0417;
  next.waterConsumptionRateKgH = activeCrewCount * 0.104;
  next.foodConsumptionRateKgH = activeCrewCount * 0.026;

  // 5. Oxygen Generation (Electrolysis: 2H2O -> 2H2 + O2)
  // 1.125 kg water per 1.0 kg O2
  const o2Module = next.modules.OXYGEN_GENERATOR;
  let o2ProducedKg = 0;
  if (o2Module.status === 'ONLINE' && hasPower && next.waterKg > 0.5) {
    const maxGenKg = next.oxygenProductionRateKgH * deltaHours * (o2Module.health / 100) * o2Module.outputMultiplier;
    const waterNeeded = maxGenKg * 1.125;
    if (next.waterKg >= waterNeeded) {
      o2ProducedKg = maxGenKg;
      next.waterKg -= waterNeeded;
    } else {
      o2ProducedKg = next.waterKg / 1.125;
      next.waterKg = 0;
    }
  }
  const o2ConsumedKg = next.oxygenConsumptionRateKgH * deltaHours;
  next.oxygenKg = Math.min(next.oxygenCapacityKg, Math.max(0, next.oxygenKg + o2ProducedKg - o2ConsumedKg));
  next.oxygenKg = safeNum(next.oxygenKg);

  // 6. Carbon Dioxide Removal Assembly (CDRA)
  const co2Module = next.modules.CO2_SCRUBBER;
  let co2ScrubbedKg = 0;
  if (co2Module.status === 'ONLINE' && hasPower) {
    const scrubCapacity = next.co2ScrubberCapacityKgH * deltaHours * (co2Module.health / 100) * co2Module.outputMultiplier;
    co2ScrubbedKg = scrubCapacity;
    // Degradation of filter
    co2Module.health = Math.max(10, co2Module.health - 0.01 * deltaHours);
  }
  const co2GeneratedKg = co2ProductionRateKgH * deltaHours;
  next.co2AccumulatedKg = Math.max(0, next.co2AccumulatedKg + co2GeneratedKg - co2ScrubbedKg);
  // Educational conversion: 1 kg accumulated CO2 ~ 350 ppm in a 100 m³ habitat
  next.co2Ppm = Math.max(380, Math.round(400 + next.co2AccumulatedKg * 350));
  next.co2Ppm = safeNum(next.co2Ppm);

  // 7. Water Recovery System (WRS)
  // Crew generates wastewater (urine, sweat condensate)
  const wastewaterProduced = next.waterConsumptionRateKgH * deltaHours * 0.95;
  next.wastewaterKg += wastewaterProduced;

  const wrsModule = next.modules.WATER_RECOVERY;
  let waterRecoveredKg = 0;
  if (wrsModule.status === 'ONLINE' && hasPower && next.wastewaterKg > 0.1) {
    const maxProcess = next.waterRecoveryRateKgH * deltaHours * (wrsModule.health / 100) * wrsModule.outputMultiplier;
    const waterToProcess = Math.min(next.wastewaterKg, maxProcess);
    waterRecoveredKg = waterToProcess * next.waterRecoveryEfficiency; // 90% recovery
    next.wastewaterKg -= waterToProcess;
    next.waterKg = Math.min(next.waterCapacityKg, next.waterKg + waterRecoveredKg);
  }
  // Crew consumes water
  const waterConsumed = next.waterConsumptionRateKgH * deltaHours;
  next.waterKg = Math.max(0, next.waterKg - waterConsumed);
  next.waterKg = safeNum(next.waterKg);
  next.wastewaterKg = safeNum(next.wastewaterKg);

  // 8. Food & Hydroponic Greenhouse
  const foodConsumed = next.foodConsumptionRateKgH * deltaHours;
  next.foodKg = Math.max(0, next.foodKg - foodConsumed);

  const ghModule = next.modules.GREENHOUSE;
  if (ghModule.status === 'ONLINE' && hasPower && next.waterKg > 1.0) {
    // Greenhouse crop growth
    const waterUsedByCrops = next.greenhouseWaterDrainKgH * deltaHours;
    next.waterKg = Math.max(0, next.waterKg - waterUsedByCrops);
    next.greenhouseCropProgress += 1.5 * deltaHours * (ghModule.health / 100) * ghModule.outputMultiplier;

    if (next.greenhouseCropProgress >= 100) {
      // Harvest fresh food!
      next.greenhouseCropProgress = 0;
      next.foodKg = Math.min(next.foodCapacityKg, next.foodKg + 25.0); // +25 kg fresh crops
    }
  }
  next.foodKg = safeNum(next.foodKg);
  next.greenhouseCropProgress = safeNum(next.greenhouseCropProgress);

  // 9. Cabin Pressure & Hull Integrity
  if (next.hullIntegrity < 100) {
    const leakFactor = (100 - next.hullIntegrity) / 100;
    const pressureDrop = leakFactor * 3.5 * deltaHours; // kPa drop
    next.cabinPressureKpa = Math.max(0, next.cabinPressureKpa - pressureDrop);
  } else if (next.cabinPressureKpa < 101.3) {
    // Repressurization valve
    next.cabinPressureKpa = Math.min(101.3, next.cabinPressureKpa + 2.0 * deltaHours);
  }
  next.cabinPressureKpa = safeNum(next.cabinPressureKpa);

  // 10. Thermal Control Loop
  const thermalModule = next.modules.THERMAL_RADIATOR;
  if (thermalModule.status === 'ONLINE' && hasPower) {
    // Regulate toward 21.0 C
    const tempDiff = 21.0 - next.cabinTempC;
    next.cabinTempC += tempDiff * Math.min(1.0, 0.5 * deltaHours);
  } else {
    // Drift toward external temperature
    const driftRate = next.planet === 'MOON' ? 2.0 : 0.8;
    const direction = next.externalTempC > next.cabinTempC ? 1 : -1;
    next.cabinTempC += direction * driftRate * deltaHours;
  }
  next.cabinTempC = safeNum(next.cabinTempC);

  // 11. Radiation Exposure
  const shelterModule = next.modules.RADIATION_SHELTER;
  const isSheltered = next.crew.some((c) => c.status === 'sheltered');
  const radiationAttenuation = isSheltered && shelterModule.status === 'ONLINE' ? 0.05 : 1.0;
  const effectiveRadiationMsv = next.radiationMsvPerHour * radiationAttenuation * deltaHours;
  next.cumulativeRadiationMsv += effectiveRadiationMsv;
  next.cumulativeRadiationMsv = safeNum(next.cumulativeRadiationMsv);

  // 12. Crew Health Dynamics
  let totalHealth = 0;
  next.crew.forEach((c) => {
    if (c.health <= 0) return;

    // Environmental stressors
    let stress = 0;
    if (next.oxygenKg <= 5.0) stress += 25; // Hypoxia risk
    if (next.co2Ppm > 3000) stress += 15; // Hypercapnia
    if (next.co2Ppm > 6000) stress += 35; // Severe poisoning
    if (next.waterKg <= 0.1) stress += 20; // Dehydration
    if (next.foodKg <= 0.1) stress += 10; // Starvation
    if (next.cabinPressureKpa < 70) stress += 30; // Hypobaric decompression
    if (next.cabinPressureKpa < 40) stress += 70; // Critical Armstrong line decompression
    if (next.cabinTempC < 10 || next.cabinTempC > 32) stress += 15; // Hypothermia/Heat exhaustion
    if (effectiveRadiationMsv > 1.0) stress += 20; // Acute radiation sickness

    if (stress > 0) {
      c.health = Math.max(0, c.health - (stress * deltaHours) / 3);
      c.status = c.health < 30 ? 'critical' : 'strained';
    } else {
      // Natural recovery in nominal conditions
      c.health = Math.min(100, c.health + 2.0 * deltaHours);
      if (c.status !== 'sheltered') c.status = 'nominal';
    }
    c.hydration = next.waterKg > 1 ? Math.min(100, c.hydration + 1) : Math.max(0, c.hydration - 3 * deltaHours);
    c.health = safeNum(c.health);
    totalHealth += c.health;
  });

  const avgCrewHealth = next.crew.length > 0 ? totalHealth / next.crew.length : 0;

  // 13. Telemetry Log (Keep last 40 data points)
  if (!next.telemetryHistory) next.telemetryHistory = [];
  next.telemetryHistory.push({
    timeSol: next.sol,
    timeHour: Math.round(next.hourOfSol * 10) / 10,
    oxygenKg: Math.round(next.oxygenKg * 10) / 10,
    co2Ppm: next.co2Ppm,
    waterKg: Math.round(next.waterKg * 10) / 10,
    batteryKwh: Math.round(next.batteryKwh * 10) / 10,
    solarKw: Math.round(next.solarKw * 10) / 10,
    cabinPressureKpa: Math.round(next.cabinPressureKpa * 10) / 10,
    cabinTempC: Math.round(next.cabinTempC * 10) / 10,
    crewHealthAvg: Math.round(avgCrewHealth * 10) / 10,
  });
  if (next.telemetryHistory.length > 40) {
    next.telemetryHistory.shift();
  }

  // 14. Survival Failure Checks
  if (avgCrewHealth <= 0) {
    next.isGameOver = true;
    next.gameOverReason = 'All crew members perished due to sustained life-support system collapse.';
  } else if (next.oxygenKg <= 0 && next.elapsedHours > 2) {
    next.isGameOver = true;
    next.gameOverReason = 'Atmospheric oxygen exhausted. Cabin decompression/asphyxiation occurred.';
  } else if (next.cabinPressureKpa <= 25) {
    next.isGameOver = true;
    next.gameOverReason = 'Catastrophic cabin pressure loss exceeded human physiological survival limits.';
  }

  // 15. Dynamic Score Accumulation
  next.score += Math.round(deltaHours * 10 * (avgCrewHealth / 100));

  return next;
}

// Robust number sanitizer to strictly prevent NaN, Infinity, and negatives
export function safeNum(val: number): number {
  if (!Number.isFinite(val) || isNaN(val)) return 0;
  return Math.max(0, val);
}

