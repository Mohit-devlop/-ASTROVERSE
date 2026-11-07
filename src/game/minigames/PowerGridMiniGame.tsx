import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, BatteryCharging, Sun, CheckCircle, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface PowerLoad {
  id: string;
  name: string;
  category: 'LIFE_SUPPORT' | 'CRUCIAL' | 'AUXILIARY';
  powerKw: number;
  active: boolean;
  essential: boolean;
}

interface PowerGridMiniGameProps {
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

export const PowerGridMiniGame: React.FC<PowerGridMiniGameProps> = ({ onScoreEarned, onClose }) => {
  const [batteryKwh, setBatteryKwh] = useState<number>(30);
  const [solarKw, setSolarKw] = useState<number>(18);
  const [timeStep, setTimeStep] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const [loads, setLoads] = useState<PowerLoad[]>([
    { id: 'l1', name: 'Primary Oxygen Electrolyzer', category: 'LIFE_SUPPORT', powerKw: 4.5, active: true, essential: true },
    { id: 'l2', name: 'CDRA CO2 Adsorption Bed', category: 'LIFE_SUPPORT', powerKw: 3.0, active: true, essential: true },
    { id: 'l3', name: 'Cabin Thermal Radiator Pump', category: 'LIFE_SUPPORT', powerKw: 2.5, active: true, essential: true },
    { id: 'l4', name: 'Water Recovery Distillation', category: 'CRUCIAL', powerKw: 3.5, active: true, essential: false },
    { id: 'l5', name: 'Hydroponic LED Grow Array', category: 'CRUCIAL', powerKw: 4.0, active: true, essential: false },
    { id: 'l6', name: 'Science Mass Spectrometer', category: 'AUXILIARY', powerKw: 3.0, active: true, essential: false },
    { id: 'l7', name: 'Rover Fast Charging Station', category: 'AUXILIARY', powerKw: 5.0, active: false, essential: false },
  ]);

  const totalDemand = loads.filter((l) => l.active).reduce((sum, l) => sum + l.powerKw, 0);
  const netPower = solarKw - totalDemand;

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimeStep((s) => {
        const nextStep = s + 1;
        // Fluctuating solar irradiance (sun angle + dust cloud)
        const solarCurve = Math.max(3, Math.round(20 * Math.sin((nextStep / 30) * Math.PI) - (nextStep > 12 && nextStep < 20 ? 8 : 0)));
        setSolarKw(solarCurve);

        setBatteryKwh((prevBat) => {
          const nextBat = prevBat + (solarCurve - totalDemand) * 0.25;
          if (nextBat <= 0) {
            // Blackout!
            setGameOver(true);
            soundEngine.playFailure();
            return 0;
          }
          if (nextBat > 50) return 50;
          return nextBat;
        });

        // Check essential systems: if essential system is turned off, trigger failure
        const missingEssential = loads.some((l) => l.essential && !l.active);
        if (missingEssential) {
          setGameOver(true);
          soundEngine.playAlarm('CRITICAL');
          return nextStep;
        }

        // Win after 30 steps
        if (nextStep >= 30) {
          setWon(true);
          setGameOver(true);
          const finalScore = 600 + Math.round(batteryKwh * 10);
          setScore(finalScore);
          onScoreEarned(finalScore);
          soundEngine.playVictory();
        }

        return nextStep;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, totalDemand, loads, batteryKwh, onScoreEarned]);

  const toggleLoad = (id: string) => {
    soundEngine.playToggle(true);
    setLoads((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)));
  };

  const handleRestart = () => {
    setBatteryKwh(30);
    setSolarKw(18);
    setTimeStep(0);
    setGameOver(false);
    setWon(false);
    setScore(0);
    setLoads((prev) => prev.map((l) => ({ ...l, active: l.id !== 'l7' })));
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-300">MINI-GAME 2: Power Grid Dispatch</h3>
            <p className="text-xs text-slate-400">Balance solar generation against high-draw breakers to prevent blackout</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Grid Stability</span>
            <span className="text-xl font-mono font-bold text-amber-400">{Math.round((timeStep / 30) * 100)}%</span>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">✕ Close</button>
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70">
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1 font-semibold">
                <Sun className="w-4 h-4" /> Solar Inflow
              </div>
              <div className="text-xl font-mono font-bold text-amber-300">{solarKw.toFixed(1)} kW</div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70">
              <div className="flex items-center gap-2 text-xs text-cyan-400 mb-1 font-semibold">
                <Zap className="w-4 h-4" /> Total Demand
              </div>
              <div className="text-xl font-mono font-bold text-cyan-300">{totalDemand.toFixed(1)} kW</div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/70">
              <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1 font-semibold">
                <BatteryCharging className="w-4 h-4" /> Battery Storage
              </div>
              <div className={`text-xl font-mono font-bold ${batteryKwh < 10 ? 'text-red-400 animate-pulse' : 'text-emerald-300'}`}>
                {batteryKwh.toFixed(1)} kWh
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-mono">Net Power Flow:</span>
            <span className={`font-mono font-bold ${netPower >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {netPower >= 0 ? `+${netPower.toFixed(1)} kW (Charging)` : `${netPower.toFixed(1)} kW (Discharging)`}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subsystem Breaker Panel:</div>
            {loads.map((load) => (
              <div
                key={load.id}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  load.active ? 'bg-slate-800/70 border-slate-700' : 'bg-slate-900/60 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{load.name}</span>
                    {load.essential && (
                      <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800 font-bold">
                        ESSENTIAL
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{load.powerKw} kW Power Draw</span>
                </div>
                <button
                  onClick={() => toggleLoad(load.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    load.active
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  {load.active ? 'BREAKER CLOSED (ON)' : 'BREAKER OPEN (OFF)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className={`text-4xl font-extrabold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? 'GRID STABILITY PRESERVED!' : 'ELECTRICAL BLACKOUT'}
          </div>
          <p className="text-sm text-slate-300">
            {won
              ? `Skillful load-shedding successfully buffered the outpost through fluctuating solar flux! Score: +${score} pts`
              : 'The battery bank fully drained or an essential life-support circuit was severed. Mission abort.'}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 rounded-xl font-bold flex items-center gap-2 text-slate-950"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-200"
            >
              Return to Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

