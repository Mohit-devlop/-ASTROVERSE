import React from 'react';
import { Award, Rocket, Target, Lightbulb, BookOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutProjectViewProps {
  onClose: () => void;
}

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({ onClose }) => {
  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-4xl mx-auto shadow-2xl backdrop-blur-xl space-y-6 max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
            <Rocket className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              NASA SPACE APPS CHALLENGE 2026
            </div>
            <h2 className="text-2xl font-black text-slate-100">ASTROVERSE: PROJECT IMPACT & ARCHITECTURE</h2>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
        >
          ✕ Return to Mission
        </button>
      </div>

      {/* Hero Problem & Solution Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
            <Target className="w-4 h-4" /> THE CORE EDUCATIONAL PROBLEM
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Students aged 7–12 frequently learn about space exploration in fragmented, passive ways—memorizing planetary facts without experiencing the intricate, life-or-death engineering trade-offs required to survive beyond Earth. Traditional curricula rarely teach <b>systems thinking</b>, where turning on a light bulb or exhaling breath directly impacts the water supply and life support grid.
          </p>
        </div>

        <div className="p-5 bg-cyan-950/20 border border-cyan-800/40 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
            <Lightbulb className="w-4 h-4" /> THE ASTROVERSE SOLUTION
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <b>ASTROVERSE</b> transforms complex space bioastronautics into an intuitive, deeply engaging, and scientifically rigorous survival simulation. By placing students in the commander’s seat of a real Moon or Mars outpost, every breath, solar angle, and battery discharge becomes an interactive STEM laboratory.
          </p>
        </div>
      </div>

      {/* Core Innovations */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4" /> KEY TECHNOLOGICAL & EDUCATIONAL INNOVATIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">1. Stoichiometric Life Support</span>
            <p className="text-slate-400 leading-relaxed">
              Conserves real mass: water electrolysis $2H_2O \to 2H_2 + O_2$ consumes exactly 1.125 kg water per kg O2 generated, paired with a 90% closed-loop ISS water recovery model.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">2. Dual Planetary Physics</span>
            <p className="text-slate-400 leading-relaxed">
              Authentic surface gravities (1.62 m/s² Moon vs 3.71 m/s² Mars), distinct atmospheric pressures (vacuum vs 0.6 kPa CO2), and realistic diurnal illumination curves.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">3. Autonomous NOVA AI Engine</span>
            <p className="text-slate-400 leading-relaxed">
              Calculates real remaining hours of oxygen, water, and battery reserves dynamically using active simulation consumption differentials rather than canned dialogues.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">4. Dynamic Event Engine</span>
            <p className="text-slate-400 leading-relaxed">
              12 realistic emergency scenarios (solar particle storms, MOXIE failures, dust storms) requiring multi-variable tactical trade-offs with immediate feedback.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">5. Procedural Audio Synthesizer</span>
            <p className="text-slate-400 leading-relaxed">
              Built on 100% Web Audio API oscillator networks, providing zero-latency space drones, alarms, and cues without depending on brittle external audio assets.
            </p>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/80 space-y-1.5">
            <span className="font-bold text-slate-100 block">6. NASA Open Data Integration</span>
            <p className="text-slate-400 leading-relaxed">
              Connects to NASA DONKI and public telemetry references, explicitly distinguishing between established space science, demonstrated prototypes, and educational assumptions.
            </p>
          </div>
        </div>
      </div>

      {/* Scientific Authenticity & Assumptions Table */}
      <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> SCIENTIFIC RIGOR & EDUCATIONAL MODEL ASSUMPTIONS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">Parameter</th>
                <th className="pb-2">NASA / Established Baseline</th>
                <th className="pb-2">ASTROVERSE Educational Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2 font-bold text-cyan-300">Human O2 Consumption</td>
                <td className="py-2">~0.84 kg / person / day (NASA ECLSS)</td>
                <td className="py-2">0.035 kg / person / hour (0.14 kg/h for 4 crew)</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-purple-300">Human CO2 Exhalation</td>
                <td className="py-2">~1.00 kg / person / day (NASA ECLSS)</td>
                <td className="py-2">0.0417 kg / person / hour exhaled into cabin volume</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-blue-300">Water Recycling Efficiency</td>
                <td className="py-2">90% - 98% (ISS UPA / WPA state-of-the-art)</td>
                <td className="py-2">90% baseline closed-loop recovery from wastewater</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-amber-300">Oxygen Electrolysis Ratio</td>
                <td className="py-2">2H2O ➔ 2H2 + O2 (36g water yields 32g O2)</td>
                <td className="py-2">Exactly 1.125 kg water consumed per 1.0 kg O2 generated</td>
              </tr>
              <tr>
                <td className="py-2 font-bold text-emerald-300">Lunar Illumination Cycle</td>
                <td className="py-2">29.5 Earth days (14d light / 14d dark; Polar peaks 86%)</td>
                <td className="py-2">Polar outpost model with periodic 4h shadow intervals</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

