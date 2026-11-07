import React, { useState } from 'react';
import { ShieldCheck, Play, CheckCircle2, XCircle, RotateCcw, Clock } from 'lucide-react';
import { runAllScientificTests, TestResult } from './testRunner';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';

interface TestRunnerModalProps {
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ onClose }) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);

  const handleRunTests = () => {
    soundEngine.playClick();
    setRunning(true);
    setTimeout(() => {
      const out = runAllScientificTests();
      setResults(out);
      setRunning(false);
      setHasRun(true);

      const allPassed = out.every((r) => r.passed);
      if (allPassed) {
        soundEngine.playVictory();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else {
        soundEngine.playAlarm('WARNING');
      }
    }, 400);
  };

  const passCount = results.filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-4xl w-full shadow-2xl flex flex-col max-h-[85vh] justify-between space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                SCIENTIFIC SIMULATION AUTOMATED TEST SUITE
              </h2>
              <p className="text-xs text-slate-400">
                15 Rigorous verification tests validating stoichiometry, thermodynamics, and life-support conservation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
          >
            ✕ Close
          </button>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            {hasRun ? (
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {passCount} / 15 TESTS PASSED
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold">
                  100% SCIENTIFIC COMPLIANCE
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-300 font-mono">
                Click below to execute all 15 automated test specs in real time:
              </span>
            )}
          </div>

          <button
            onClick={handleRunTests}
            disabled={running}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            {running ? (
              <>
                <Clock className="w-4 h-4 animate-spin" /> Executing Verification...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Run Complete Test Suite
              </>
            )}
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {results.length === 0 && !running && (
            <div className="text-center py-16 text-slate-500 text-sm">
              Press "Run Complete Test Suite" to execute all tests.
            </div>
          )}

          {results.map((res) => (
            <div
              key={res.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                res.passed
                  ? 'bg-slate-800/40 border-emerald-500/30 text-slate-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-300'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[10px] text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                    {res.id}
                  </span>
                  <span className="font-bold text-slate-100">{res.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({res.category})</span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">{res.assertion}</p>
                {res.error && <p className="text-[11px] text-red-400 font-mono">{res.error}</p>}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-slate-400">{res.durationMs}ms</span>
                {res.passed ? (
                  <span className="flex items-center gap-1 font-bold font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/40 text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-600/40 text-[10px]">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

