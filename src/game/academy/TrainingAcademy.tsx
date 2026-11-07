import React, { useState } from 'react';
import { GraduationCap, CheckCircle2, ArrowRight, Wind, Filter, Droplets, Zap, Shield, AlertTriangle, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import confetti from 'canvas-confetti';

interface AcademyModule {
  id: string;
  title: string;
  category: string;
  icon: React.FC<{ className?: string }>;
  prompt: string;
  interactiveChallenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  completed: boolean;
}

interface TrainingAcademyProps {
  onCompleteExercise: (points: number) => void;
  onClose: () => void;
}

export const TrainingAcademy: React.FC<TrainingAcademyProps> = ({ onCompleteExercise, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const [modules, setModules] = useState<AcademyModule[]>([
    {
      id: 'm1',
      title: '1. Oxygen Management',
      category: 'ECLSS Chemistry',
      icon: Wind,
      prompt: 'Astronauts need ~0.84 kg of oxygen daily. Water electrolysis splits 2H2O into 2H2 and O2, demanding 1.125 kg water per kg O2 generated.',
      interactiveChallenge: {
        question: 'Your outpost crew consumes 0.14 kg O2/hour. If your water reservoir drops to zero, what happens to oxygen generation?',
        options: [
          'Oxygen generation continues without water',
          'Electrolysis stops immediately because water is the chemical feedstock for O2',
          'The scrubber converts CO2 into pure liquid water automatically',
        ],
        correctIndex: 1,
        explanation: 'Water is the atomic hydrogen/oxygen carrier for electrolysis. Without water input, electrolysis cells cannot split O2.',
      },
      completed: false,
    },
    {
      id: 'm2',
      title: '2. Carbon Dioxide Removal',
      category: 'Cabin Atmosphere',
      icon: Filter,
      prompt: 'Exhaled CO2 is toxic above 2,500 ppm. The CDRA zeolite beds adsorb CO2, but require periodic heating and vacuum desorbing to clear.',
      interactiveChallenge: {
        question: 'Cabin CO2 spikes to 4,200 ppm and the crew reports pounding headaches. What is the fastest corrective protocol?',
        options: [
          'Turn off all cabin heaters to chill the air',
          'Energize the CDRA Carbon Dioxide Scrubber and inspect desorption valves',
          'Open the main outer airlock hatch directly to the Martian vacuum',
        ],
        correctIndex: 1,
        explanation: 'Activating the regenerative scrubber draws air across amine/zeolite beds, absorbing CO2 down to nominal ~500 ppm.',
      },
      completed: false,
    },
    {
      id: 'm3',
      title: '3. Closed-Loop Water Recovery',
      category: 'Fluid Mechanics',
      icon: Droplets,
      prompt: 'Shipping water costs thousands of dollars per kilogram. NASA ECLSS recovers ~90% to 98% of all wastewater from sweat, breath moisture, and urine.',
      interactiveChallenge: {
        question: 'If the outpost crew produces 10 liters of gray water and urine, approximately how much potable water will a 90% recovery system produce?',
        options: [
          'Exactly 1 liter',
          '9.0 liters of ultra-clean drinking water',
          '25 liters (creates water from vacuum)',
        ],
        correctIndex: 1,
        explanation: 'At 90% efficiency, 10 L × 0.90 = 9.0 L of purified water is recovered, leaving 1.0 L of concentrated brine.',
      },
      completed: false,
    },
    {
      id: 'm4',
      title: '4. Power Budgeting & Energy Triage',
      category: 'Electrical Engineering',
      icon: Zap,
      prompt: 'When nighttime falls or a dust storm blots out the Sun, the habitat must survive on battery storage. Non-essential systems must be shed.',
      interactiveChallenge: {
        question: 'A dust storm drops solar power to zero and battery capacity is at 15%. Which system should be turned OFF first?',
        options: [
          'Primary Oxygen Electrolyzer',
          'Science Laboratory and Rover Charging Dock',
          'Cabin Pressurization Seals',
        ],
        correctIndex: 1,
        explanation: 'Science labs and rover docks are non-essential luxuries during a power emergency; life support must be preserved at all costs.',
      },
      completed: false,
    },
    {
      id: 'm5',
      title: '5. Radiation Safety & Shelter',
      category: 'Space Weather',
      icon: Shield,
      prompt: 'Solar Particle Events (SPE) from solar flares blast high-energy ionizing protons. Deep subterranean regolith shielding stops these particles.',
      interactiveChallenge: {
        question: 'A Category X coronal mass ejection is 20 minutes from hitting the outpost. What order should Commander give?',
        options: [
          'Send astronauts outside to wash solar panels',
          'Order immediate crew evacuation into the Sub-Regolith Storm Shelter',
          'Turn off all radiation sensors to ignore the alarm',
        ],
        correctIndex: 1,
        explanation: 'Sub-regolith shelters surround astronauts with 2 meters of packed regolith, attenuating ionizing radiation by over 95%.',
      },
      completed: false,
    },
    {
      id: 'm6',
      title: '6. Emergency Triage Response',
      category: 'Mission Command',
      icon: AlertTriangle,
      prompt: 'In space, panic is deadly. Every emergency requires evaluating resource costs, astronaut physical safety, and long-term consequences.',
      interactiveChallenge: {
        question: 'A micrometeorite punctures a hole in module beta, dropping cabin pressure at 2 kPa/min. What is step one?',
        options: [
          'Wait until tomorrow morning to check logs',
          'Deploy emergency epoxy expansion patch or isolate bulkhead doors immediately',
          'Vent the rest of the habitat to equalize pressure',
        ],
        correctIndex: 1,
        explanation: 'Rapid physical sealing or isolating the breached compartment stops atmospheric loss and protects crew from fatal hypoxia.',
      },
      completed: false,
    },
  ]);

  const currentMod = modules[selectedIdx];
  const ModIcon = currentMod.icon;

  const handleSubmitAnswer = () => {
    if (selectedOption === null || submitted) return;
    setSubmitted(true);

    const isCorrect = selectedOption === currentMod.interactiveChallenge.correctIndex;
    if (isCorrect) {
      soundEngine.playVictory();
      setScore((s) => s + 150);
      onCompleteExercise(150);
      const updated = modules.map((m, idx) => (idx === selectedIdx ? { ...m, completed: true } : m));
      setModules(updated);
      if (updated.every((m) => m.completed)) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      soundEngine.playAlarm('WARNING');
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setSubmitted(false);
    if (selectedIdx < modules.length - 1) {
      setSelectedIdx(selectedIdx + 1);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-4xl mx-auto shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 text-purple-400">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              JUNIOR ASTRONAUT TRAINING ACADEMY
            </h2>
            <p className="text-xs text-slate-400">Interactive flight training drills designed for aspiring space commanders</p>
          </div>
        </div>
        <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all">
          ✕ Return to Mission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module List */}
        <div className="space-y-2">
          {modules.map((m, idx) => {
            const ItemIcon = m.icon;
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={m.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedIdx(idx);
                  setSelectedOption(null);
                  setSubmitted(false);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-400 shadow-lg shadow-purple-500/10'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-400'}`}>
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">{m.title}</div>
                    <div className="text-[10px] text-slate-400">{m.category}</div>
                  </div>
                </div>
                {m.completed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Active Exercise */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/20 rounded-xl text-purple-400 border border-purple-500/30">
                <ModIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-slate-100">{currentMod.title}</h3>
                <span className="text-xs font-mono text-purple-300">{currentMod.category} Drill</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              💡 {currentMod.prompt}
            </p>

            <div className="space-y-3">
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                Interactive Command Scenario:
              </div>
              <p className="text-sm font-semibold text-slate-100">{currentMod.interactiveChallenge.question}</p>

              <div className="space-y-2 pt-1">
                {currentMod.interactiveChallenge.options.map((opt, optIdx) => {
                  const isChosen = selectedOption === optIdx;
                  const isCorrect = optIdx === currentMod.interactiveChallenge.correctIndex;
                  let btnColor = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600';
                  if (submitted) {
                    if (isCorrect) btnColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                    else if (isChosen) btnColor = 'bg-red-950/80 border-red-500 text-red-300 font-bold';
                  } else if (isChosen) {
                    btnColor = 'bg-purple-900/60 border-purple-400 text-purple-200 font-bold ring-2 ring-purple-400';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedOption(optIdx);
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {submitted && (
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed border ${
                  selectedOption === currentMod.interactiveChallenge.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/40 text-red-300'
                }`}
              >
                <b>
                  {selectedOption === currentMod.interactiveChallenge.correctIndex
                    ? 'CORRECT PROTOCOL EXECUTED!'
                    : 'SUB-OPTIMAL DECISION!'}
                </b>{' '}
                {currentMod.interactiveChallenge.explanation}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {!submitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitAnswer}
                className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all ${
                  selectedOption !== null
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Submit Decision
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                Continue to Next Drill <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

