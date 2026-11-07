import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, ArrowRight, Activity, Zap } from 'lucide-react';
import { EmergencyEvent } from '../simulationEngine/types';
import { soundEngine } from '../audio/soundEngine';

interface EmergencyModalProps {
  emergency: EmergencyEvent;
  onResolveOption: (optionId: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ emergency, onResolveOption }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleChoose = (id: string) => {
    soundEngine.playClick();
    setSelectedOptionId(id);
  };

  const handleConfirm = () => {
    if (!selectedOptionId) return;
    onResolveOption(selectedOptionId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 text-white max-w-2xl w-full shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Pulsing Red Emergency Strobe Overlay */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 animate-pulse"></div>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-red-950/60 pb-4 mb-4">
          <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/50 text-red-400 animate-bounce">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-600">
                CRITICAL ECLSS ALERT · {emergency.severity}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">SOL {emergency.activeSol}</span>
            </div>
            <h2 className="text-xl font-black text-red-400 tracking-wide mt-1">{emergency.title}</h2>
          </div>
        </div>

        {/* Situation Briefing */}
        <div className="space-y-3 mb-5">
          <p className="text-xs text-slate-200 leading-relaxed font-semibold bg-red-950/20 p-3 rounded-xl border border-red-900/40">
            ⚠️ {emergency.description}
          </p>

          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
            <span className="text-cyan-400 font-bold block mb-0.5">NASA Scientific Context:</span>
            {emergency.scientificContext}
          </div>
        </div>

        {/* Decisions */}
        <div className="space-y-2.5 mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Commander Tactical Response Options:
          </span>

          {emergency.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleChoose(opt.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-red-950/60 border-red-400 ring-2 ring-red-400/50 shadow-lg'
                    : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100">{opt.label}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 font-semibold">
                    Success Rate: {Math.round(opt.successChance * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-1.5 leading-relaxed">{opt.description}</p>
                <div className="text-[10px] text-amber-300 font-mono">Cost & Trade-off: {opt.costDescription}</div>
              </button>
            );
          })}
        </div>

        {/* Action Confirm */}
        <button
          disabled={!selectedOptionId}
          onClick={handleConfirm}
          className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            selectedOptionId
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 active:scale-98'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          Execute Selected Directive <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

