import React, { useState } from 'react';
import { Volume2, VolumeX, Save, Download, RotateCcw, AlertTriangle, Check, Sliders, Shield } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { exportSaveToFile, clearSaveGame } from '../storage/saveSystem';

interface SettingsModalProps {
  onSaveManual: () => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onSaveManual, onResetGame, onClose }) => {
  const settings = soundEngine.getSettings();
  const [masterVol, setMasterVol] = useState<number>(settings.masterVolume);
  const [musicVol, setMusicVol] = useState<number>(settings.musicVolume);
  const [sfxVol, setSfxVol] = useState<number>(settings.sfxVolume);
  const [isMuted, setIsMuted] = useState<boolean>(settings.isMuted);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(settings.voiceEnabled);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleMasterChange = (val: number) => {
    setMasterVol(val);
    soundEngine.setMasterVolume(val);
  };

  const handleMusicChange = (val: number) => {
    setMusicVol(val);
    soundEngine.setMusicVolume(val);
  };

  const handleSfxChange = (val: number) => {
    setSfxVol(val);
    soundEngine.setSfxVolume(val);
  };

  const handleToggleMute = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    soundEngine.setVoiceEnabled(nextVoice);
  };

  const handleSave = () => {
    onSaveManual();
    setSavedSuccess(true);
    soundEngine.playToggle(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-white max-w-xl w-full shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-100">SYSTEM SETTINGS & AUDIO</h3>
              <p className="text-xs text-slate-400">Audio synthesizers, profile persistence, and data management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold"
          >
            ✕ Close
          </button>
        </div>

        {/* Audio Synthesizers */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> Procedural Web Audio Engine
            </span>
            <button
              onClick={handleToggleMute}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                isMuted ? 'bg-red-950 border-red-700 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {isMuted ? 'UNMUTE MASTER' : 'MUTE MASTER'}
            </button>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-mono">
                <span>Master Volume:</span>
                <span>{Math.round(masterVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={masterVol}
                onChange={(e) => handleMasterChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-mono">
                <span>Space Ambience & Music:</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1 font-mono">
                <span>Sound Effects & Alarms:</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300">NOVA AI Voice Announcements (SpeechSynthesis):</span>
              <button
                onClick={handleToggleVoice}
                className={`px-3 py-1 rounded-lg font-bold border text-xs transition-all ${
                  voiceEnabled ? 'bg-emerald-950 border-emerald-600 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {voiceEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>

        {/* Data Persistence */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
            Save Data & Mission Telemetry Archives:
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleSave}
              className="py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20 active:scale-98 transition-all"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {savedSuccess ? 'Saved to Browser!' : 'Save Progress Now'}
            </button>

            <button
              onClick={exportSaveToFile}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-bold text-xs text-slate-200 flex items-center justify-center gap-1.5 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4 text-cyan-400" /> Export JSON Save
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 bg-red-950/40 hover:bg-red-950/70 border border-red-800/60 text-red-400 rounded-xl text-xs font-bold transition-all"
              >
                Reset Mission Progress & Outpost State...
              </button>
            ) : (
              <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl space-y-2 text-center">
                <span className="text-xs text-red-200 block font-semibold">
                  Are you sure? All unsaved progress and campaign sols will be reset!
                </span>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      clearSaveGame();
                      onResetGame();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

