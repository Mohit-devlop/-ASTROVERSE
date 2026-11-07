import React from 'react';
import {
  Wind,
  Filter,
  Droplets,
  Zap,
  Gauge,
  Thermometer,
  ShieldAlert,
  Heart,
  Play,
  Pause,
  FastForward,
  RotateCcw,
  Bot,
  Layers,
  GraduationCap,
  Sparkles,
  Database,
  Volume2,
  VolumeX,
  Target,
  Clock,
  Compass,
} from 'lucide-react';
import { SimulationState, SimSpeed } from '../../simulationEngine/types';
import { CAMPAIGN_MISSIONS } from '../../missionEngine/missions';
import { soundEngine } from '../../audio/soundEngine';

interface MissionDashboardProps {
  state: SimulationState;
  currentMissionId: string;
  onSpeedChange: (speed: SimSpeed) => void;
  onOpenNova: () => void;
  onOpenHabitat: () => void;
  onOpenMiniGames: () => void;
  onOpenAcademy: () => void;
  onOpenScience: () => void;
  onOpenNasaData: () => void;
  onOpenAstronaut: () => void;
  onOpenSettings: () => void;
}

export const MissionDashboard: React.FC<MissionDashboardProps> = ({
  state,
  currentMissionId,
  onSpeedChange,
  onOpenNova,
  onOpenHabitat,
  onOpenMiniGames,
  onOpenAcademy,
  onOpenScience,
  onOpenNasaData,
  onOpenAstronaut,
  onOpenSettings,
}) => {
  const currentMission =
    CAMPAIGN_MISSIONS.find((m) => m.id === currentMissionId) || CAMPAIGN_MISSIONS[0];

  const avgCrewHealth =
    state.crew.length > 0
      ? Math.round(state.crew.reduce((sum, c) => sum + c.health, 0) / state.crew.length)
      : 0;

  // Status indicators
  const o2Status =
    state.oxygenKg < 20 ? 'CRITICAL' : state.oxygenKg < 50 ? 'WARNING' : 'NORMAL';
  const co2Status =
    state.co2Ppm > 4000 ? 'CRITICAL' : state.co2Ppm > 2000 ? 'WARNING' : 'NORMAL';
  const waterStatus =
    state.waterKg < 30 ? 'CRITICAL' : state.waterKg < 70 ? 'WARNING' : 'NORMAL';
  const powerStatus =
    state.batteryKwh < 15 ? 'CRITICAL' : state.batteryKwh < 35 ? 'WARNING' : 'NORMAL';
  const pressureStatus =
    state.cabinPressureKpa < 70 ? 'CRITICAL' : state.cabinPressureKpa < 90 ? 'WARNING' : 'NORMAL';

  return (
    <div className="w-full space-y-4">
      {/* Top Mission Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Planet & Mission Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg shadow-cyan-500/20">
            {state.planet === 'MOON' ? '🌑' : '🪐'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {state.planet} OUTPOST · {state.difficulty}
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">
                SOL {state.sol} · {Math.floor(state.hourOfSol).toString().padStart(2, '0')}:
                {Math.floor((state.hourOfSol % 1) * 60)
                  .toString()
                  .padStart(2, '0')}
              </span>
            </div>
            <h1 className="text-lg font-black text-white">{currentMission.title}</h1>
          </div>
        </div>

        {/* Time Simulation Rate Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSpeedChange(state.simSpeed === 0 ? 1 : 0);
            }}
            className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              state.simSpeed === 0
                ? 'bg-amber-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Pause Simulation"
          >
            {state.simSpeed === 0 ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSpeedChange(1);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              state.simSpeed === 1
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            1x
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSpeedChange(3);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              state.simSpeed === 3
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            3x
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSpeedChange(10);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              state.simSpeed === 10
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            10x
          </button>
        </div>

        {/* Global Action Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNova}
            className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
          >
            <Bot className="w-4 h-4 animate-bounce" /> NOVA AI
          </button>
          <button
            onClick={onOpenHabitat}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Layers className="w-4 h-4 text-cyan-400" /> Habitat Modules
          </button>
          <button
            onClick={onOpenMiniGames}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Mini-Games
          </button>
          <button
            onClick={onOpenAcademy}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <GraduationCap className="w-4 h-4 text-purple-400" /> Training
          </button>
          <button
            onClick={onOpenScience}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Compass className="w-4 h-4 text-emerald-400" /> Science Lab
          </button>
          <button
            onClick={onOpenNasaData}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Database className="w-4 h-4 text-blue-400" /> NASA Data
          </button>
          <button
            onClick={onOpenAstronaut}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            EVA Suit
          </button>
        </div>
      </div>

      {/* Main Real-Time Telemetry Gauges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Oxygen Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-cyan-400" /> Oxygen (O2)
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                o2Status === 'NORMAL'
                  ? 'bg-emerald-950 text-emerald-400'
                  : o2Status === 'WARNING'
                  ? 'bg-amber-950 text-amber-400'
                  : 'bg-red-950 text-red-400 animate-pulse'
              }`}
            >
              {o2Status}
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-cyan-300">
              {state.oxygenKg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (state.oxygenKg / state.oxygenCapacityKg) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Net: {(state.modules.OXYGEN_GENERATOR.status === 'ONLINE' ? state.oxygenProductionRateKgH : 0) - state.oxygenConsumptionRateKgH > 0 ? '+' : ''}
              {((state.modules.OXYGEN_GENERATOR.status === 'ONLINE' ? state.oxygenProductionRateKgH : 0) - state.oxygenConsumptionRateKgH).toFixed(2)} kg/h
            </span>
          </div>
        </div>

        {/* CO2 Concentration Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-purple-400" /> Carbon Dioxide
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                co2Status === 'NORMAL'
                  ? 'bg-emerald-950 text-emerald-400'
                  : co2Status === 'WARNING'
                  ? 'bg-amber-950 text-amber-400'
                  : 'bg-red-950 text-red-400 animate-pulse'
              }`}
            >
              {co2Status}
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-purple-300">
              {state.co2Ppm} <span className="text-xs text-slate-400 font-normal">ppm</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all duration-300 ${
                  state.co2Ppm > 3000 ? 'bg-red-500' : state.co2Ppm > 1200 ? 'bg-amber-500' : 'bg-purple-400'
                }`}
                style={{ width: `${Math.min(100, (state.co2Ppm / 5000) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Scrubber: {state.modules.CO2_SCRUBBER.status}
            </span>
          </div>
        </div>

        {/* Water Reserves Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" /> Potable Water
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                waterStatus === 'NORMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
              }`}
            >
              {waterStatus}
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-blue-300">
              {state.waterKg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kg</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-blue-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (state.waterKg / state.waterCapacityKg) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Wastewater: {state.wastewaterKg.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Battery & Power Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Battery & Power
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                powerStatus === 'NORMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
              }`}
            >
              {powerStatus}
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-amber-300">
              {state.batteryKwh.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kWh</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (state.batteryKwh / state.batteryCapacityKwh) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Solar: {state.solarKw.toFixed(1)} kW | Load: {state.powerDemandKw.toFixed(1)} kW
            </span>
          </div>
        </div>

        {/* Cabin Pressure Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" /> Cabin Pressure
            </span>
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                pressureStatus === 'NORMAL' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
              }`}
            >
              {pressureStatus}
            </span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-emerald-300">
              {state.cabinPressureKpa.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kPa</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (state.cabinPressureKpa / 101.3) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Hull: {state.hullIntegrity}% Nominal
            </span>
          </div>
        </div>

        {/* Crew Health & Biometrics */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Crew Health
            </span>
            <span className="text-[9px] font-mono text-emerald-400 font-bold">4 / 4 ALIVE</span>
          </div>
          <div>
            <div className="text-xl font-mono font-black text-rose-300">
              {avgCrewHealth}% <span className="text-xs text-slate-400 font-normal">Average</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-rose-400 h-full transition-all duration-300"
                style={{ width: `${avgCrewHealth}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Temp: {state.cabinTempC.toFixed(1)}°C | Rad: {state.cumulativeRadiationMsv.toFixed(1)} mSv
            </span>
          </div>
        </div>
      </div>

      {/* Mission Objectives & Crew Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Objectives Card */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <h3 className="font-extrabold text-sm text-slate-100">Active Flight Objectives</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">Score: {state.score} PTS</span>
          </div>

          <p className="text-xs text-slate-300 italic">{currentMission.briefing}</p>

          <div className="space-y-2 pt-1">
            {currentMission.objectives.map((obj) => {
              const completed = obj.isCompleted(state);
              return (
                <div
                  key={obj.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    completed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-semibold">{obj.description}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                      completed ? 'bg-emerald-900 text-emerald-200' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {completed ? '✓ COMPLETED' : 'IN PROGRESS'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Astronaut Crew Biometrics */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-100 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Crew Biometrics</span>
            <span className="text-xs font-mono text-slate-400">4 Astronauts</span>
          </h3>

          <div className="space-y-2">
            {state.crew.map((c) => (
              <div key={c.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-200">{c.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">{c.role}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Health: {c.health.toFixed(0)}%</span>
                  <span>Hydration: {c.hydration.toFixed(0)}%</span>
                  <span
                    className={`uppercase font-bold ${
                      c.status === 'nominal'
                        ? 'text-emerald-400'
                        : c.status === 'sheltered'
                        ? 'text-blue-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

