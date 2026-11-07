import React, { useState } from 'react';
import {
  Rocket,
  Play,
  RotateCcw,
  BookOpen,
  FlaskConical,
  Bot,
  Sliders,
  ShieldCheck,
  Award,
  Globe,
  Sparkles,
  Info,
} from 'lucide-react';
import { SpaceScene } from './SpaceScene';
import { soundEngine } from '../audio/soundEngine';

interface CinematicIntroProps {
  hasSavedGame: boolean;
  onStartNewMission: () => void;
  onContinueMission: () => void;
  onOpenHowToPlay: () => void;
  onOpenScienceLab: () => void;
  onOpenNova: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  onOpenTests: () => void;
  selectedPlanet: 'MOON' | 'MARS';
  onSelectPlanet: (planet: 'MOON' | 'MARS') => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  hasSavedGame,
  onStartNewMission,
  onContinueMission,
  onOpenHowToPlay,
  onOpenScienceLab,
  onOpenNova,
  onOpenSettings,
  onOpenAbout,
  onOpenTests,
  selectedPlanet,
  onSelectPlanet,
}) => {
  const [soundStarted, setSoundStarted] = useState<boolean>(false);

  const handleStartSoundAndAction = (action: () => void) => {
    if (!soundStarted) {
      soundEngine.startSpaceAmbience();
      setSoundStarted(true);
    }
    soundEngine.playClick();
    action();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-6 overflow-hidden bg-slate-950 text-white select-none">
      {/* 3D Space Three.js Background */}
      <SpaceScene planet={selectedPlanet} cinematicMode={true} />

      {/* Top Navigation & Status Bar */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Rocket className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-black tracking-widest text-cyan-400 uppercase">
              NASA Space Apps Challenge 2026
            </div>
            <div className="text-xs font-mono font-bold text-slate-300">
              OFFICIAL JUNIOR ASTRONAUT TRAINER
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStartSoundAndAction(onOpenAbout)}
            className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur transition-all"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" /> NASA Judges / Impact
          </button>
          <button
            onClick={() => handleStartSoundAndAction(onOpenTests)}
            className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-emerald-500/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur text-emerald-400 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> 15 Automated Tests
          </button>
        </div>
      </header>

      {/* Center Cinematic Title & Call to Action */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 my-auto py-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold backdrop-blur shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          "BEYOND EARTH, EVERY DECISION MATTERS."
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight uppercase bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">
            ASTROVERSE
          </h1>
          <h2 className="text-sm sm:text-base font-extrabold tracking-widest text-cyan-400 uppercase font-mono">
            JUNIOR ASTRONAUT MISSION TRAINER
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
            Command a research outpost on the Moon or Mars. Master water electrolysis, closed-loop CO2 scrubbing, solar power triage, and radiation survival in deep space.
          </p>
        </div>

        {/* Planet Selection Switcher */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectPlanet('MOON');
            }}
            className={`px-5 py-2.5 rounded-2xl border text-xs font-black transition-all flex items-center gap-2 ${
              selectedPlanet === 'MOON'
                ? 'bg-slate-100 text-slate-950 border-white shadow-xl scale-105'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            🌑 MOON CAMPAIGN (1/6g)
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              onSelectPlanet('MARS');
            }}
            className={`px-5 py-2.5 rounded-2xl border text-xs font-black transition-all flex items-center gap-2 ${
              selectedPlanet === 'MARS'
                ? 'bg-orange-600 text-white border-orange-400 shadow-xl scale-105 shadow-orange-600/30'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            🪐 MARS CAMPAIGN (38%g)
          </button>
        </div>

        {/* Primary Action Buttons (Requested in Section 3) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 max-w-2xl mx-auto">
          <button
            onClick={() => handleStartSoundAndAction(onStartNewMission)}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-cyan-500/40 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" /> START NEW MISSION
          </button>

          {hasSavedGame && (
            <button
              onClick={() => handleStartSoundAndAction(onContinueMission)}
              className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> CONTINUE MISSION
            </button>
          )}

          <button
            onClick={() => handleStartSoundAndAction(onOpenHowToPlay)}
            className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur transition-all"
          >
            <BookOpen className="w-4 h-4 text-purple-400" /> HOW TO PLAY
          </button>

          <button
            onClick={() => handleStartSoundAndAction(onOpenScienceLab)}
            className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur transition-all"
          >
            <FlaskConical className="w-4 h-4 text-emerald-400" /> SPACE SCIENCE LAB
          </button>

          <button
            onClick={() => handleStartSoundAndAction(onOpenNova)}
            className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur transition-all"
          >
            <Bot className="w-4 h-4 text-cyan-400" /> MEET NOVA
          </button>

          <button
            onClick={() => handleStartSoundAndAction(onOpenSettings)}
            className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur transition-all"
          >
            <Sliders className="w-4 h-4 text-amber-400" /> SETTINGS
          </button>
        </div>
      </div>

      {/* Bottom Footer Telemetry Facts */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-4 font-mono">
        <div>
          {selectedPlanet === 'MOON'
            ? 'MOON TARGET: Gravity 1.62 m/s² · Hard Vacuum · Polar Peak Illumination'
            : 'MARS TARGET: Gravity 3.71 m/s² · 0.61 kPa CO2 · Sol: 24h 39m 35s'}
        </div>
        <div className="text-cyan-400">NASA ECLSS STOICHIOMETRY ENGINE ACTIVE</div>
      </footer>
    </div>
  );
};

