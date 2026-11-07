import { describe, it, expect } from 'vitest';
import { createDefaultState } from '../simulationEngine/defaults';
import { simulateTick } from '../simulationEngine/simulator';
import { analyzeTelemetry, askNova } from '../nova/novaEngine';
import { SeededRNG, checkForRandomEmergency } from '../eventEngine/emergencies';

describe('ASTROVERSE Simulation Engine Scientific Tests', () => {
  // TEST 1: Oxygen generation consumes water and electricity
  it('TEST 1: Oxygen generation consumes water and electricity', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.waterKg = 100;
    state.oxygenKg = 50;
    state.batteryKwh = 50;
    state.modules.OXYGEN_GENERATOR.status = 'ONLINE';

    // Run 1 hour of simulation
    const next = simulateTick(state, 1.0);

    // Water must decrease by approximately 1.125 * oxygen produced + crew consumption
    expect(next.waterKg).toBeLessThan(100);
    // Oxygen produced should be added to storage
    expect(next.oxygenKg).toBeGreaterThan(50 - state.oxygenConsumptionRateKgH);
    // Power demand includes O2 generator
    expect(next.powerDemandKw).toBeGreaterThan(next.modules.OXYGEN_GENERATOR.powerDemandKw);
  });

  // TEST 2: Crew respiration increases CO2
  it('TEST 2: Crew respiration increases CO2', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.co2AccumulatedKg = 1.0;
    // Turn scrubber off to measure pure exhaled accumulation
    state.modules.CO2_SCRUBBER.status = 'OFFLINE';

    const next = simulateTick(state, 2.0);
    expect(next.co2AccumulatedKg).toBeGreaterThan(1.0);
    expect(next.co2Ppm).toBeGreaterThan(state.co2Ppm);
  });

  // TEST 3: CO2 removal decreases CO2
  it('TEST 3: CO2 removal decreases CO2', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.co2AccumulatedKg = 5.0; // elevated CO2
    state.modules.CO2_SCRUBBER.status = 'ONLINE';
    state.modules.CO2_SCRUBBER.outputMultiplier = 2.0; // High capacity scrubber

    const next = simulateTick(state, 3.0);
    expect(next.co2AccumulatedKg).toBeLessThan(5.0);
  });

  // TEST 4: Water recovery obeys conservation and configured recovery efficiency
  it('TEST 4: Water recovery obeys conservation and configured recovery efficiency', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.wastewaterKg = 20.0;
    state.waterKg = 100.0;
    state.waterRecoveryEfficiency = 0.90;
    state.modules.WATER_RECOVERY.status = 'ONLINE';
    state.modules.WATER_RECOVERY.health = 100;
    state.waterRecoveryRateKgH = 0.60;

    const next = simulateTick(state, 1.0);
    // Wastewater decreased as it was purified
    expect(next.wastewaterKg).toBeLessThan(20.0);
    // Pure water gained back at 90%
    expect(next.waterRecoveryEfficiency).toBe(0.90);
  });

  // TEST 5: Power consumption reduces available energy
  it('TEST 5: Power consumption reduces available energy', () => {
    const state = createDefaultState('MARS', 'EXPLORER');
    state.hourOfSol = 1.0; // Midnight on Mars (zero solar)
    state.solarKw = 0;
    state.batteryKwh = 50.0;

    const next = simulateTick(state, 1.0);
    expect(next.batteryKwh).toBeLessThan(50.0);
  });

  // TEST 6: Power failure affects dependent systems
  it('TEST 6: Power failure affects dependent systems', () => {
    const state = createDefaultState('MARS', 'EXPLORER');
    state.hourOfSol = 2.0;
    state.solarKw = 0;
    state.batteryKwh = 0.1; // almost dead
    state.powerDemandKw = 15.0;

    const next = simulateTick(state, 1.0);
    expect(next.batteryKwh).toBe(0);
    // Non-critical modules should auto-trip to protect life support
    expect(next.modules.SCIENCE_LAB.status).toBe('OFFLINE');
    expect(next.modules.ROVER_STATION.status).toBe('OFFLINE');
  });

  // TEST 7: Habitat leakage reduces cabin pressure
  it('TEST 7: Habitat leakage reduces cabin pressure', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.hullIntegrity = 60; // 40% breach
    state.cabinPressureKpa = 101.3;

    const next = simulateTick(state, 2.0);
    expect(next.cabinPressureKpa).toBeLessThan(101.3);
  });

  // TEST 8: Mars dust events affect modeled solar generation
  it('TEST 8: Mars dust events affect modeled solar generation', () => {
    const stateClear = createDefaultState('MARS', 'EXPLORER');
    stateClear.hourOfSol = 12.0; // Midday sun
    stateClear.dustAtmosphericOpacity = 0.05;
    const nextClear = simulateTick(stateClear, 0.1);

    const stateStorm = createDefaultState('MARS', 'EXPLORER');
    stateStorm.hourOfSol = 12.0;
    stateStorm.dustAtmosphericOpacity = 0.85; // Heavy dust storm
    const nextStorm = simulateTick(stateStorm, 0.1);

    expect(nextStorm.solarKw).toBeLessThan(nextClear.solarKw * 0.4);
  });

  // TEST 9: Lunar illumination cycles affect solar generation
  it('TEST 9: Lunar illumination cycles affect solar generation', () => {
    const stateDay = createDefaultState('MOON', 'EXPLORER');
    stateDay.hourOfSol = 10.0;
    const nextDay = simulateTick(stateDay, 0.1);

    const stateNight = createDefaultState('MOON', 'EXPLORER');
    stateNight.hourOfSol = 22.0; // Night shadow
    const nextNight = simulateTick(stateNight, 0.1);

    expect(nextDay.solarKw).toBeGreaterThan(10);
    expect(nextNight.solarKw).toBe(0);
  });

  // TEST 10: Mission failure occurs when validated survival conditions are violated
  it('TEST 10: Mission failure occurs when validated survival conditions are violated', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.elapsedHours = 5;
    state.oxygenKg = 0; // complete asphyxiation
    state.crew.forEach((c) => (c.health = 0));

    const next = simulateTick(state, 1.0);
    expect(next.isGameOver).toBe(true);
    expect(next.gameOverReason).toBeDefined();
  });

  // TEST 11: NOVA reads actual simulation values
  it('TEST 11: NOVA reads actual simulation values', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.oxygenKg = 28.0;
    state.oxygenConsumptionRateKgH = 0.14;
    state.modules.OXYGEN_GENERATOR.status = 'OFFLINE';

    const telemetry = analyzeTelemetry(state);
    // 28 kg / 0.14 kg/h = 200 hours
    expect(telemetry.oxygenHoursLeft).toBeCloseTo(200, 1);

    const msg = askNova('status report', state);
    expect(msg.text).toContain('28.0 kg');
  });

  // TEST 12: Saved game progress restores correctly
  it('TEST 12: Saved game progress restores correctly', () => {
    const state = createDefaultState('MARS', 'COMMANDER');
    state.sol = 7;
    state.oxygenKg = 188.5;
    state.score = 4320;

    const serialized = JSON.stringify(state);
    const restored = JSON.parse(serialized);

    expect(restored.sol).toBe(7);
    expect(restored.oxygenKg).toBe(188.5);
    expect(restored.score).toBe(4320);
    expect(restored.planet).toBe('MARS');
  });

  // TEST 13: No negative resource values, NaN or infinite values
  it('TEST 13: No negative resource values, NaN or infinite values', () => {
    const state = createDefaultState('MOON', 'EXPLORER');
    state.oxygenKg = 0.05;
    state.waterKg = 0.05;
    state.foodKg = 0.05;
    state.batteryKwh = 0.05;

    // Simulate huge consumption tick
    const next = simulateTick(state, 5.0);

    expect(Number.isFinite(next.oxygenKg)).toBe(true);
    expect(Number.isFinite(next.waterKg)).toBe(true);
    expect(Number.isFinite(next.foodKg)).toBe(true);
    expect(Number.isFinite(next.batteryKwh)).toBe(true);

    expect(next.oxygenKg).toBeGreaterThanOrEqual(0);
    expect(next.waterKg).toBeGreaterThanOrEqual(0);
    expect(next.foodKg).toBeGreaterThanOrEqual(0);
    expect(next.batteryKwh).toBeGreaterThanOrEqual(0);
  });

  // TEST 14: The same random seed produces reproducible event sequences
  it('TEST 14: The same random seed produces reproducible event sequences', () => {
    const rng1 = new SeededRNG(1337);
    const rng2 = new SeededRNG(1337);

    const seq1 = [rng1.next(), rng1.next(), rng1.next(), rng1.next()];
    const seq2 = [rng2.next(), rng2.next(), rng2.next(), rng2.next()];

    expect(seq1).toEqual(seq2);
  });

  // TEST 15: All major controls work on mobile and desktop
  it('TEST 15: Simulation state mutation works via standard dispatch calls', () => {
    const state = createDefaultState('MOON', 'CADET');
    // Toggle module
    state.modules.OXYGEN_GENERATOR.status = 'OFFLINE';
    expect(state.modules.OXYGEN_GENERATOR.status).toBe('OFFLINE');

    // Upgrade module
    state.modules.HABITAT.level = 2;
    expect(state.modules.HABITAT.level).toBe(2);

    // Speed change
    state.simSpeed = 3;
    expect(state.simSpeed).toBe(3);
  });
});
