import React, { useState } from 'react';
import { User, Shield, Award, Sparkles, Check, Download, Printer } from 'lucide-react';
import { AstronautProfile, Planet } from '../../simulationEngine/types';
import { soundEngine } from '../../audio/soundEngine';
import confetti from 'canvas-confetti';

interface AstronautCustomizerProps {
  profile: AstronautProfile;
  planet: Planet;
  rank: string;
  score: number;
  onSaveProfile: (profile: AstronautProfile) => void;
  onClose?: () => void;
}

const SUIT_COLORS = [
  { name: 'NASA Artemis White', hex: '#f8fafc' },
  { name: 'Mars Hematite Orange', hex: '#ea580c' },
  { name: 'Deep Space Navy', hex: '#1e3a8a' },
  { name: 'Lunar Titanium Gold', hex: '#eab308' },
  { name: 'Cyber Ion Cyan', hex: '#06b6d4' },
];

const HELMET_STYLES: AstronautProfile['helmetStyle'][] = [
  'Apollo Bubble',
  'Artemis Vizor',
  'Mars Vanguard',
  'Deep Space Sentinel',
];

const EMBLEMS: AstronautProfile['emblem'][] = [
  'Artemis Eagle',
  'Mars Explorer',
  'Orion Pioneer',
  'Starbound',
];

export const AstronautCustomizer: React.FC<AstronautCustomizerProps> = ({
  profile,
  planet,
  rank,
  score,
  onSaveProfile,
  onClose,
}) => {
  const [current, setCurrent] = useState<AstronautProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    soundEngine.playVictory();
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
    onSaveProfile(current);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 text-white backdrop-blur-xl shadow-2xl max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ASTRONAUT CREDENTIALS & EVA SUIT CUSTOMIZER
            </h2>
            <p className="text-xs text-slate-400">
              Customize your pressurized extravehicular activity (EVA) suit and flight profile
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            ✕ Close
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customization Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Commander Name & Callsign:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={current.name}
                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
                className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
                placeholder="Commander Name"
              />
              <input
                type="text"
                value={current.callsign}
                onChange={(e) => setCurrent({ ...current, callsign: e.target.value.toUpperCase() })}
                className="w-28 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-cyan-400 text-center uppercase"
                placeholder="CALLSIGN"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Suit Thermal Fabric Color:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SUIT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    soundEngine.playClick();
                    setCurrent({ ...current, suitColor: c.hex, suitName: c.name });
                  }}
                  className={`h-11 rounded-xl border flex items-center justify-center transition-all ${
                    current.suitColor === c.hex ? 'ring-2 ring-cyan-400 scale-105 border-white' : 'border-slate-700'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {current.suitColor === c.hex && (
                    <Check className={`w-5 h-5 ${c.hex === '#f8fafc' ? 'text-slate-900' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block font-mono">{current.suitName}</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Helmet Vizor Configuration:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HELMET_STYLES.map((h) => (
                <button
                  key={h}
                  onClick={() => {
                    soundEngine.playClick();
                    setCurrent({ ...current, helmetStyle: h });
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    current.helmetStyle === h
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Mission Flight Emblem:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EMBLEMS.map((emb) => (
                <button
                  key={emb}
                  onClick={() => {
                    soundEngine.playClick();
                    setCurrent({ ...current, emblem: emb });
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    current.emblem === emb
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  🚀 {emb}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {savedSuccess ? 'Flight Credentials Saved!' : 'Apply Flight Suit Credentials'}
          </button>
        </div>

        {/* Live NASA Astronaut ID Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Lanyard Clip */}
            <div className="w-12 h-2.5 bg-slate-700 rounded-full mx-auto mb-3 border border-slate-600"></div>

            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-black text-[10px] text-white">
                  ★
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">NASA Space Apps 2026</div>
                  <div className="text-xs font-black text-white">ASTROVERSE FLIGHT CORPS</div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800 font-bold">
                ACTIVE EVA
              </span>
            </div>

            {/* Astronaut Avatar / Visualizer */}
            <div className="relative w-28 h-28 mx-auto mb-4 rounded-2xl flex items-center justify-center border-2 border-slate-700 shadow-inner overflow-hidden" style={{ backgroundColor: current.suitColor }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              {/* Helmet Vizor */}
              <div className="w-16 h-14 bg-gradient-to-tr from-amber-400 via-cyan-300 to-white rounded-full border-2 border-slate-900 shadow-xl flex items-center justify-center opacity-90">
                <div className="w-10 h-8 bg-slate-950/70 rounded-full"></div>
              </div>
            </div>

            <div className="text-center space-y-1 mb-4">
              <h3 className="font-black text-lg text-white tracking-wide">{current.name || 'Commander Nova'}</h3>
              <div className="text-xs font-mono font-bold text-cyan-400">
                CALLSIGN: [{current.callsign || 'PIONEER-1'}]
              </div>
              <div className="text-[11px] text-amber-300 font-semibold">{rank}</div>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Campaign:</span>
                <span className="text-white font-bold">{planet === 'MOON' ? 'Lunar Base Artemis' : 'Mars Utopia Station'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Helmet Model:</span>
                <span className="text-cyan-300">{current.helmetStyle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flight Emblem:</span>
                <span className="text-amber-400">{current.emblem}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Flight Score:</span>
                <span className="text-emerald-400 font-bold">{score} PTS</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>AUTH CODE: ASTRO-2026-HQ</span>
              <span>VERIFIED NASA ECLSS</span>
            </div>
          </div>

          <button
            onClick={handlePrintCertificate}
            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" /> Print Astronaut ID Card & Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

