import React, { useState, useEffect } from 'react';
import { Droplets, Filter, Gauge, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface WaterRecoveryMiniGameProps {
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

export const WaterRecoveryMiniGame: React.FC<WaterRecoveryMiniGameProps> = ({ onScoreEarned, onClose }) => {
  const [dirtyWaterTank, setDirtyWaterTank] = useState<number>(100);
  const [pureWaterTank, setPureWaterTank] = useState<number>(0);
  const [filterStress, setFilterStress] = useState<number>(15);
  const [pumpSpeed, setPumpSpeed] = useState<number>(2); // 1 = Low, 2 = Medium, 3 = High
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Process water based on pump speed
      const flowRate = pumpSpeed * 2.5; // liters per second
      const stressDelta = pumpSpeed === 3 ? 5 : pumpSpeed === 2 ? 1 : -3;

      setFilterStress((prevStress) => {
        const nextStress = Math.max(0, prevStress + stressDelta);
        if (nextStress >= 100) {
          // Filter blowout!
          setGameOver(true);
          soundEngine.playFailure();
          return 100;
        }
        return nextStress;
      });

      setDirtyWaterTank((prevDirty) => {
        if (prevDirty <= flowRate) {
          // Finished processing!
          setPureWaterTank((p) => p + prevDirty * 0.95);
          setWon(true);
          setGameOver(true);
          const finalScore = 750 + Math.round((100 - filterStress) * 5);
          setScore(finalScore);
          onScoreEarned(finalScore);
          soundEngine.playVictory();
          return 0;
        }
        setPureWaterTank((p) => Math.min(100, p + flowRate * 0.95));
        return prevDirty - flowRate;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [gameOver, pumpSpeed, filterStress, onScoreEarned]);

  const handleBackwash = () => {
    soundEngine.playToggle(true);
    setFilterStress((s) => Math.max(0, s - 25));
  };

  const handleRestart = () => {
    setDirtyWaterTank(100);
    setPureWaterTank(0);
    setFilterStress(15);
    setPumpSpeed(2);
    setGameOver(false);
    setWon(false);
    setScore(0);
  };

  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/40 text-blue-400">
            <Droplets className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-blue-300">MINI-GAME 3: Closed-Loop Water Recovery</h3>
            <p className="text-xs text-slate-400">Distill gray water while backwashing filter beds to prevent pressure blowout</p>
          </div>
        </div>
        <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">✕ Close</button>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Raw Wastewater Tank</span>
              <div className="text-2xl font-mono font-bold text-amber-400">{dirtyWaterTank.toFixed(1)} L</div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${dirtyWaterTank}%` }}></div>
              </div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Purified Potable Tank (95% ISS standard)</span>
              <div className="text-2xl font-mono font-bold text-emerald-400">{pureWaterTank.toFixed(1)} L</div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${pureWaterTank}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-2 text-slate-300">
                <Gauge className="w-4 h-4 text-cyan-400" /> Catalytic Membrane Stress
              </span>
              <span className={`font-mono font-bold text-sm ${filterStress > 75 ? 'text-red-400 animate-pulse' : 'text-cyan-300'}`}>
                {filterStress.toFixed(0)}% / 100%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${filterStress > 75 ? 'bg-red-500' : filterStress > 45 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                style={{ width: `${filterStress}%` }}
              ></div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={handleBackwash}
                className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs shadow-lg shadow-cyan-600/20 active:scale-98"
              >
                <Filter className="w-4 h-4" /> Trigger Nitrogen Purge & Backwash (-25% Stress)
              </button>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-400 uppercase block mb-3">Distillation Centrifuge Pump Speed:</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { speed: 1, label: 'Low Flow', desc: 'Stress recovers', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
                { speed: 2, label: 'Nominal Flow', desc: 'Balanced yield', color: 'bg-cyan-950 text-cyan-300 border-cyan-700' },
                { speed: 3, label: 'High Flow', desc: 'Rapid yield, high stress', color: 'bg-amber-950 text-amber-300 border-amber-700' },
              ].map((opt) => (
                <button
                  key={opt.speed}
                  onClick={() => {
                    setPumpSpeed(opt.speed);
                    soundEngine.playClick();
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    pumpSpeed === opt.speed ? `${opt.color} ring-2 ring-blue-400 font-bold` : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-sm">{opt.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className={`text-4xl font-extrabold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? 'WATER PURIFIED SUCCESSFULLY!' : 'MEMBRANE RUPTURE!'}
          </div>
          <p className="text-sm text-slate-300">
            {won
              ? `All wastewater was successfully processed into pure potable water meeting NASA standards. Score: +${score} pts`
              : 'Filter membrane stress reached 100%, blowing out high-pressure seals. Gray water contaminated the filtration manifold.'}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 rounded-xl font-bold flex items-center gap-2 text-slate-950"
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

