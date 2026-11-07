import React, { useState } from 'react';
import { SCIENCE_LESSONS, ScienceLesson } from './scienceLessons';
import {
  FlaskConical,
  Wind,
  Filter,
  Droplets,
  ShieldAlert,
  Compass,
  Gauge,
  CheckCircle2,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Wind,
  Filter,
  Droplets,
  ShieldAlert,
  Compass,
  Gauge,
};

interface ScienceLabViewProps {
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

export const ScienceLabView: React.FC<ScienceLabViewProps> = ({ onScoreEarned, onClose }) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(SCIENCE_LESSONS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [electrolysisWaterInput, setElectrolysisWaterInput] = useState<number>(36); // grams
  const [regolithShieldThickness, setRegolithShieldThickness] = useState<number>(1.5); // meters
  const [gravityEarthJump, setGravityEarthJump] = useState<number>(0.5); // meters

  const activeLesson: ScienceLesson =
    SCIENCE_LESSONS.find((l) => l.id === selectedLessonId) || SCIENCE_LESSONS[0];
  const LessonIcon = ICON_MAP[activeLesson.badgeIcon] || FlaskConical;

  // Stoichiometry calculation: 2H2O (36g) -> 2H2 (4g) + O2 (32g)
  const o2YieldGrams = (electrolysisWaterInput * (32 / 36)).toFixed(1);
  const h2YieldGrams = (electrolysisWaterInput * (4 / 36)).toFixed(1);

  // Radiation Attenuation: I = I0 * e^(-0.8 * thickness)
  const radiationRemainingPercent = Math.round(100 * Math.exp(-1.4 * regolithShieldThickness));

  // Jump height inversely proportional to gravity: h = v² / (2g)
  const lunarJumpHeight = (gravityEarthJump * (9.81 / 1.62)).toFixed(2);
  const marsJumpHeight = (gravityEarthJump * (9.81 / 3.71)).toFixed(2);

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers({ ...quizAnswers, [`${activeLesson.id}-${qIdx}`]: optIdx });
  };

  const handleCheckQuiz = (qIdx: number) => {
    const key = `${activeLesson.id}-${qIdx}`;
    setQuizSubmitted({ ...quizSubmitted, [key]: true });
    const isCorrect = quizAnswers[key] === activeLesson.quiz[qIdx].correctIndex;
    if (isCorrect) {
      soundEngine.playVictory();
      onScoreEarned(100);
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
    } else {
      soundEngine.playAlarm('WARNING');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-5xl mx-auto shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 text-cyan-400">
            <FlaskConical className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              ASTROVERSE SPACE SCIENCE & ECLSS LAB
            </h2>
            <p className="text-xs text-slate-400">
              Interactive physics, chemistry, and life-support lessons verified by NASA educational benchmarks
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
        >
          ✕ Return to Mission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lesson Navigation */}
        <div className="space-y-2">
          {SCIENCE_LESSONS.map((l) => {
            const IconC = ICON_MAP[l.badgeIcon] || FlaskConical;
            const isSelected = selectedLessonId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedLessonId(l.id);
                }}
                className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <IconC className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-100 truncate">{l.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{l.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Lesson & Interactive Sandbox */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 space-y-5 overflow-y-auto max-h-[72vh]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/30">
              <LessonIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-100">{activeLesson.title}</h3>
              <p className="text-xs text-cyan-400 font-mono">{activeLesson.subtitle}</p>
            </div>
          </div>

          {activeLesson.keyFormula && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-xs font-mono font-bold text-cyan-300 flex items-center justify-between">
              <span>Scientific Formula:</span>
              <span className="text-white">{activeLesson.keyFormula}</span>
            </div>
          )}

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            {activeLesson.detailedContent.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Interactive Educational Widgets */}
          {activeLesson.interactiveType === 'ELECTROLYSIS_SLIDER' && (
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase">
                  Interactive Electrolysis Stoichiometry Simulator:
                </span>
                <span className="text-xs font-mono text-slate-300">{electrolysisWaterInput} g H2O</span>
              </div>
              <input
                type="range"
                min="9"
                max="180"
                step="9"
                value={electrolysisWaterInput}
                onChange={(e) => setElectrolysisWaterInput(Number(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-cyan-950/60 rounded-xl border border-cyan-700">
                  <span className="text-[10px] text-slate-400 block font-bold">Oxygen Yield (O2)</span>
                  <span className="text-lg font-mono font-bold text-cyan-300">{o2YieldGrams} grams</span>
                  <span className="text-[10px] text-cyan-500 block">88.8% Mass Fraction</span>
                </div>
                <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-700">
                  <span className="text-[10px] text-slate-400 block font-bold">Hydrogen Yield (H2)</span>
                  <span className="text-lg font-mono font-bold text-blue-300">{h2YieldGrams} grams</span>
                  <span className="text-[10px] text-blue-500 block">11.2% Mass Fraction</span>
                </div>
              </div>
            </div>
          )}

          {activeLesson.interactiveType === 'RADIATION_SHIELD' && (
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 uppercase">
                  Regolith Shielding Attenuation Simulator:
                </span>
                <span className="text-xs font-mono text-slate-300">{regolithShieldThickness} meters thick</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={regolithShieldThickness}
                onChange={(e) => setRegolithShieldThickness(Number(e.target.value))}
                className="w-full accent-purple-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Ionizing Radiation Penetrating Bunker:</span>
                <span
                  className={`font-bold text-sm ${
                    radiationRemainingPercent > 40
                      ? 'text-red-400'
                      : radiationRemainingPercent > 10
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {radiationRemainingPercent}% remaining ({100 - radiationRemainingPercent}% absorbed)
                </span>
              </div>
            </div>
          )}

          {activeLesson.interactiveType === 'GRAVITY_JUMP' && (
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 uppercase">
                  Planetary Gravity Jump Comparison:
                </span>
                <span className="text-xs font-mono text-slate-300">Earth Baseline: {gravityEarthJump} m</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={gravityEarthJump}
                onChange={(e) => setGravityEarthJump(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Earth (9.81 m/s²)</div>
                  <div className="font-bold text-slate-200 mt-1">{gravityEarthJump.toFixed(2)} m</div>
                </div>
                <div className="p-2.5 bg-amber-950/60 rounded-xl border border-amber-700">
                  <div className="text-[10px] text-amber-400">Mars (3.71 m/s²)</div>
                  <div className="font-bold text-amber-300 mt-1">{marsJumpHeight} m (2.6x)</div>
                </div>
                <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-700">
                  <div className="text-[10px] text-cyan-400">Moon (1.62 m/s²)</div>
                  <div className="font-bold text-cyan-300 mt-1">{lunarJumpHeight} m (6.1x)</div>
                </div>
              </div>
            </div>
          )}

          {/* Mini Quizzes */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Science Knowledge Verification:
            </h4>

            {activeLesson.quiz.map((q, qIdx) => {
              const key = `${activeLesson.id}-${qIdx}`;
              const isChecked = quizSubmitted[key];
              const selectedOpt = quizAnswers[key];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={qIdx} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-200">
                    Q{qIdx + 1}: {q.question}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-slate-600';
                      if (isChecked) {
                        if (optIdx === q.correctIndex) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                        else if (isChosen) btnStyle = 'bg-red-950 border-red-500 text-red-300 font-bold';
                      } else if (isChosen) {
                        btnStyle = 'bg-cyan-900/60 border-cyan-400 text-cyan-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isChecked}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isChecked && optIdx === q.correctIndex && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {!isChecked ? (
                    <button
                      disabled={selectedOpt === undefined}
                      onClick={() => handleCheckQuiz(qIdx)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedOpt !== undefined
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Verify Answer (+100 PTS)
                    </button>
                  ) : (
                    <div
                      className={`p-2.5 rounded-lg text-xs border ${
                        isCorrect
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                          : 'bg-red-950/40 border-red-500/40 text-red-300'
                      }`}
                    >
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <span>Verified NASA Educational Resource Reference</span>
            <a
              href={activeLesson.nasaSourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Explore NASA Source Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

