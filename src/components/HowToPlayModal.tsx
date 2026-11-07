import React from 'react';
import { BookOpen, Wind, Droplet, Zap, AlertTriangle, Layers, Award } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-3xl w-full shadow-2xl space-y-6 max-h-[82vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-100">COMMANDER'S FIELD FLIGHT MANUAL</h3>
              <p className="text-xs text-slate-400">Rules of engagement for keeping 4 astronauts alive in space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            ✕ Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Card 1: Oxygen & Electrolysis */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <Wind className="w-4 h-4" /> 1. Oxygen Electrolysis (2H2O ➔ 2H2 + O2)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Humans consume ~0.035 kg O2/hour each (0.14 kg/h total). The Oxygen Generator electrolyzes water, consuming 1.125 kg water per kg of O2 generated plus 2.2 kW electrical power. If water reaches zero, oxygen stops!
            </p>
          </div>

          {/* Card 2: CO2 Scrubbing */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <AlertTriangle className="w-4 h-4" /> 2. Carbon Dioxide Accumulation
            </div>
            <p className="text-slate-300 leading-relaxed">
              Crew exhalation fills the cabin with CO2. Above 2,500 ppm, astronauts suffer headaches; above 5,000 ppm causes disorientation and acidosis. Keep the CDRA Scrubber energized and filters maintained!
            </p>
          </div>

          {/* Card 3: Water Recycling */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-400">
              <Droplet className="w-4 h-4" /> 3. 90% Closed-Loop Water Recovery
            </div>
            <p className="text-slate-300 leading-relaxed">
              Astronaut sweat and urine enter the wastewater holding tank. The WRS distillation centrifuge purifies it back into potable water at 90% recovery efficiency. Prospect crater ice with rovers to replenish losses.
            </p>
          </div>

          {/* Card 4: Power Grid */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Zap className="w-4 h-4" /> 4. Power Triage & Diurnal Cycles
            </div>
            <p className="text-slate-300 leading-relaxed">
              Photovoltaic solar arrays generate electricity only during sunlit hours. In darkness or Martian dust storms, battery storage takes over. If the battery dies, non-essential systems trip to keep life support online.
            </p>
          </div>

          {/* Card 5: Emergencies */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertTriangle className="w-4 h-4" /> 5. Dynamic Emergencies
            </div>
            <p className="text-slate-300 leading-relaxed">
              When sirens sound, an unpredictable event has struck (solar flare, hull breach, electrolyzer crack). Choose carefully between 3 distinct tactical options—every decision has calculated risks and trade-offs.
            </p>
          </div>

          {/* Card 6: Habitat Upgrades */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <Layers className="w-4 h-4" /> 6. Habitat Construction & Ranks
            </div>
            <p className="text-slate-300 leading-relaxed">
              Spend construction materials to upgrade modules to Tier 2 and 3, increasing output and resilience. Complete campaign objectives to rise from Cadet to Legendary Mission Commander!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl text-xs uppercase tracking-wider"
        >
          Understood, Commander! Return to Mission
        </button>
      </div>
    </div>
  );
};

