import React, { useState } from 'react';
import { Activity, Zap, Droplets, Truck, Award, Play } from 'lucide-react';
import { DiagnosticsMiniGame } from './DiagnosticsMiniGame';
import { PowerGridMiniGame } from './PowerGridMiniGame';
import { WaterRecoveryMiniGame } from './WaterRecoveryMiniGame';
import { RoverExplorationMiniGame } from './RoverExplorationMiniGame';
import { soundEngine } from '../../audio/soundEngine';

interface MiniGamesHubProps {
  planet: 'MOON' | 'MARS';
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

export const MiniGamesHub: React.FC<MiniGamesHubProps> = ({ planet, onScoreEarned, onClose }) => {
  const [activeGame, setActiveGame] = useState<number | null>(null);

  const games = [
    {
      id: 1,
      title: 'Life Support Diagnostics',
      category: 'ECLSS Sensor Calibration',
      icon: Activity,
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      description: 'Pinpoint malfunctioning telemetry channels and tune analog potentiometers to NASA nominal specifications under strict countdown.',
    },
    {
      id: 2,
      title: 'Power Grid Dispatch',
      category: 'Energy Load Shedding',
      icon: Zap,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      description: 'Balance high-draw breakers against fluctuating solar irradiance to prevent catastrophic habitat battery brownouts.',
    },
    {
      id: 3,
      title: 'Water Recovery Filtration',
      category: 'Centrifugal Distillation',
      icon: Droplets,
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      description: 'Operate multi-stage fluid purification, regulate centrifuge pump speed, and backwash catalytic membranes before rupture.',
    },
    {
      id: 4,
      title: 'Rover Resource Exploration',
      category: 'Surface Prospecting & Radar',
      icon: Truck,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      description: 'Navigate rough crater terrain, pulse ground-penetrating radar, drill water ice deposits, and return to base with full cargo.',
    },
  ];

  const handleSelectGame = (id: number) => {
    soundEngine.playClick();
    setActiveGame(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full">
        {activeGame === 1 && <DiagnosticsMiniGame onScoreEarned={onScoreEarned} onClose={() => setActiveGame(null)} />}
        {activeGame === 2 && <PowerGridMiniGame onScoreEarned={onScoreEarned} onClose={() => setActiveGame(null)} />}
        {activeGame === 3 && <WaterRecoveryMiniGame onScoreEarned={onScoreEarned} onClose={() => setActiveGame(null)} />}
        {activeGame === 4 && <RoverExplorationMiniGame planet={planet} onScoreEarned={onScoreEarned} onClose={() => setActiveGame(null)} />}

        {activeGame === null && (
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  ASTRONAUT FLIGHT SIMULATORS & MINI-GAMES
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Interactive hands-on training exercises simulating real space survival dilemmas
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
              >
                ✕ Close Simulator
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {games.map((g) => {
                const IconComponent = g.icon;
                return (
                  <div
                    key={g.id}
                    className={`p-5 rounded-2xl border bg-gradient-to-br ${g.color} flex flex-col justify-between hover:scale-[1.02] transition-all`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-3 bg-slate-950/50 rounded-xl border border-white/10">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 bg-white/5 rounded-full border border-white/10">
                          {g.category}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-100">{g.title}</h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{g.description}</p>
                    </div>

                    <button
                      onClick={() => handleSelectGame(g.id)}
                      className="mt-5 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Launch Exercise
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

