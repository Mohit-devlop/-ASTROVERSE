import React from 'react';
import { Award, Printer, CheckCircle2, RotateCcw, Share2, Sparkles, Bot } from 'lucide-react';
import { SimulationState } from '../simulationEngine/types';
import { getCommanderRank } from '../scoring/achievements';
import { soundEngine } from '../audio/soundEngine';

interface MissionReportModalProps {
  state: SimulationState;
  onRestartMission: () => void;
  onClose: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({ state, onRestartMission, onClose }) => {
  const rank = getCommanderRank(state.score);
  const survivingCrew = state.crew.filter((c) => c.health > 0).length;

  const handlePrint = () => {
    soundEngine.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 text-white max-w-3xl w-full shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-2xl text-slate-950 shadow-lg shadow-yellow-500/20">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                NASA SPACE APPS 2026 OFFICIAL DEBRIEFING
              </div>
              <h2 className="text-2xl font-black text-slate-100">FINAL MISSION SURVIVAL REPORT</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            ✕ Close
          </button>
        </div>

        {/* Official Printable Certificate Layout */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-yellow-500/50 rounded-2xl p-6 space-y-4 shadow-2xl relative overflow-hidden print:border-black print:text-black">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
              NATIONAL AERONAUTICS AND SPACE ADMINISTRATION EDUCATIONAL CHALLENGE
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide">
              CERTIFICATE OF SPACE SURVIVAL COMMAND
            </h3>
            <p className="text-xs text-slate-300 italic">This certifies that Junior Astronaut Commander</p>
            <div className="text-2xl font-black text-cyan-300 underline underline-offset-8 py-1">
              {state.astronautProfile.name || 'Commander Nova'} [{state.astronautProfile.callsign || 'PIONEER-1'}]
            </div>
            <p className="text-xs text-slate-300 pt-1">
              has completed rigorous planetary outpost command on the <b>{state.planet === 'MOON' ? 'Moon' : 'Mars'}</b>.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800 text-center font-mono text-xs">
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Mission Duration</span>
              <span className="text-sm font-bold text-white">{state.sol} Sols ({state.elapsedHours.toFixed(0)}h)</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Crew Survival</span>
              <span className="text-sm font-bold text-emerald-400">{survivingCrew} / 4 Astronauts</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Final Score</span>
              <span className="text-sm font-bold text-cyan-400">{state.score} PTS</span>
            </div>
            <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Commander Rank</span>
              <span className="text-sm font-bold text-yellow-400">{rank}</span>
            </div>
          </div>

          {/* NOVA AI Dynamic Debriefing Quote */}
          <div className="p-3.5 bg-cyan-950/30 rounded-xl border border-cyan-800/40 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5">
            <Bot className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300 block mb-0.5">NOVA Operations Analysis:</span>
              "Commander {state.astronautProfile.name}, across {state.sol} sols on {state.planet}, your life-support closed loops maintained an average oxygen reserve of {state.oxygenKg.toFixed(1)} kg. You successfully resolved {state.emergencyHistory.filter((e) => e.solved).length} dynamic emergencies. Your systems thinking and resource allocation reflect exemplary aerospace leadership."
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 transition-all"
          >
            <Printer className="w-4 h-4" /> Print / Save Certificate PDF
          </button>
          <button
            onClick={onRestartMission}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Start Next Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

