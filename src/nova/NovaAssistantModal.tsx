import React, { useState } from 'react';
import { Bot, Send, Volume2, VolumeX, Sparkles, AlertCircle, Cpu, Radio } from 'lucide-react';
import { SimulationState } from '../simulationEngine/types';
import { askNova, analyzeTelemetry, speakNova, NovaMessage } from './novaEngine';
import { soundEngine } from '../audio/soundEngine';

interface NovaAssistantModalProps {
  state: SimulationState;
  onClose: () => void;
}

export const NovaAssistantModal: React.FC<NovaAssistantModalProps> = ({ state, onClose }) => {
  const [messages, setMessages] = useState<NovaMessage[]>([
    {
      id: 'init-1',
      sender: 'NOVA',
      text: `Greetings, Commander ${state.astronautProfile.name || 'Nova'}. I am NOVA (Neural Operations & Virtual Astronaut Assistant). I am monitoring all life-support telemetry and orbital conditions for Base ${state.planet}. How may I assist your mission?`,
      timestamp: new Date().toLocaleTimeString(),
      category: 'TELEMETRY',
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const telemetry = analyzeTelemetry(state);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    soundEngine.playClick();
    const userMsg: NovaMessage = {
      id: `user-${Date.now()}`,
      sender: 'COMMANDER',
      text,
      timestamp: new Date().toLocaleTimeString(),
      category: 'TACTICAL',
    };

    const reply = askNova(text, state);

    setMessages((prev) => [...prev, userMsg, reply]);
    setInputText('');

    if (voiceEnabled) {
      setIsSpeaking(true);
      speakNova(reply.text, true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  };

  const quickPrompts = [
    'Telemetry status report',
    'How much oxygen is left?',
    'What is our battery reserve runtime?',
    'Explain water electrolysis formula',
    'How does radiation shielding work?',
    'Why is Mars gravity different?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 text-white max-w-3xl w-full shadow-2xl flex flex-col h-[82vh] justify-between relative overflow-hidden">
        {/* Futuristic Background Scanlines */}
        <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-4">
            {/* Holographic Glowing Orb */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-cyan-400/20 blur-md transition-all ${
                  isSpeaking ? 'scale-125 bg-cyan-400/40 animate-ping' : 'animate-pulse'
                }`}
              ></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-indigo-300 border border-cyan-200 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Bot className={`w-6 h-6 text-slate-950 ${isSpeaking ? 'animate-bounce' : ''}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-slate-100 tracking-wide">NOVA AI ASSISTANT</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/50 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LOCAL SCIENTIFIC REASONER (AUTONOMOUS)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Neural Operations & Virtual Astronaut Assistant · Real-Time Telemetry Link
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextState = !voiceEnabled;
                setVoiceEnabled(nextState);
                if (!nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                voiceEnabled ? 'bg-cyan-950 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle AI Speech Voice"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-all border border-slate-700"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Live Mathematical Analysis Ticker */}
        <div className="my-3 p-3 bg-slate-950/70 border border-slate-800 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono relative z-10">
          <div className="p-1.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">O2 Reserve Time</span>
            <span className="text-cyan-400 font-bold">{telemetry.oxygenHoursLeft} hours</span>
          </div>
          <div className="p-1.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Water Duration</span>
            <span className="text-blue-400 font-bold">{telemetry.waterHoursLeft} hours</span>
          </div>
          <div className="p-1.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Food Duration</span>
            <span className="text-emerald-400 font-bold">{telemetry.foodHoursLeft} hours</span>
          </div>
          <div className="p-1.5 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Battery Run-Down</span>
            <span className="text-amber-400 font-bold">{telemetry.batteryHoursLeft} hours</span>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 my-2 relative z-10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'COMMANDER' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-1">
                <span>{msg.sender === 'COMMANDER' ? 'Commander (You)' : 'NOVA Core'}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                  msg.sender === 'COMMANDER'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/10'
                    : 'bg-slate-800/90 border border-slate-700 text-slate-200 rounded-bl-none shadow-lg'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="pt-2 pb-2 relative z-10">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0 text-[10px]">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Prompts:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 whitespace-nowrap text-[11px] transition-all hover:border-cyan-400"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 pt-2 border-t border-slate-800 relative z-10">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask NOVA regarding life support, science, formulas, or tactical strategy..."
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Transmit
          </button>
        </div>
      </div>
    </div>
  );
};

