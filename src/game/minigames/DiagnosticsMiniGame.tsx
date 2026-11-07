import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle2, RotateCcw, Wrench } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface DiagnosticChannel {
  id: string;
  name: string;
  system: string;
  currentReading: number;
  nominalTarget: number;
  tolerance: number;
  unit: string;
  isCalibrated: boolean;
}

interface DiagnosticsMiniGameProps {
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

export const DiagnosticsMiniGame: React.FC<DiagnosticsMiniGameProps> = ({ onScoreEarned, onClose }) => {
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [channels, setChannels] = useState<DiagnosticChannel[]>([
    { id: 'ch1', name: 'Electrolyzer Cathode Pressure', system: 'O2 System', currentReading: 148, nominalTarget: 101, tolerance: 5, unit: 'kPa', isCalibrated: false },
    { id: 'ch2', name: 'CDRA Desiccant Temp Differential', system: 'CO2 Scrubber', currentReading: 68, nominalTarget: 42, tolerance: 4, unit: '°C', isCalibrated: false },
    { id: 'ch3', name: 'Distillation Centrifuge RPM', system: 'WRS Recycler', currentReading: 1850, nominalTarget: 2400, tolerance: 50, unit: 'RPM', isCalibrated: false },
    { id: 'ch4', name: 'Active Radiator Loop Flow Rate', system: 'Thermal Control', currentReading: 1.4, nominalTarget: 3.5, tolerance: 0.2, unit: 'L/min', isCalibrated: false },
  ]);
  const [selectedChannelId, setSelectedChannelId] = useState<string>('ch1');
  const [sliderValue, setSliderValue] = useState<number>(148);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          soundEngine.playFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const handleSelectChannel = (ch: DiagnosticChannel) => {
    setSelectedChannelId(ch.id);
    setSliderValue(ch.currentReading);
    soundEngine.playClick();
  };

  const handleCalibrate = () => {
    const isWithinTolerance = Math.abs(sliderValue - selectedChannel.nominalTarget) <= selectedChannel.tolerance;
    if (isWithinTolerance) {
      soundEngine.playToggle(true);
      const updated = channels.map((c) => (c.id === selectedChannel.id ? { ...c, currentReading: sliderValue, isCalibrated: true } : c));
      setChannels(updated);
      setScore((s) => s + 250);

      // Check all calibrated
      if (updated.every((c) => c.isCalibrated)) {
        setWon(true);
        setGameOver(true);
        const finalScore = score + 250 + timeLeft * 10;
        setScore(finalScore);
        onScoreEarned(finalScore);
        soundEngine.playVictory();
      }
    } else {
      soundEngine.playAlarm('WARNING');
    }
  };

  const handleReset = () => {
    setTimeLeft(45);
    setChannels([
      { id: 'ch1', name: 'Electrolyzer Cathode Pressure', system: 'O2 System', currentReading: 148, nominalTarget: 101, tolerance: 5, unit: 'kPa', isCalibrated: false },
      { id: 'ch2', name: 'CDRA Desiccant Temp Differential', system: 'CO2 Scrubber', currentReading: 68, nominalTarget: 42, tolerance: 4, unit: '°C', isCalibrated: false },
      { id: 'ch3', name: 'Distillation Centrifuge RPM', system: 'WRS Recycler', currentReading: 1850, nominalTarget: 2400, tolerance: 50, unit: 'RPM', isCalibrated: false },
      { id: 'ch4', name: 'Active Radiator Loop Flow Rate', system: 'Thermal Control', currentReading: 1.4, nominalTarget: 3.5, tolerance: 0.2, unit: 'L/min', isCalibrated: false },
    ]);
    setSelectedChannelId('ch1');
    setSliderValue(148);
    setGameOver(false);
    setWon(false);
    setScore(0);
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 rounded-xl border border-cyan-500/40 text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-cyan-300">MINI-GAME 1: Life Support Diagnostics</h3>
            <p className="text-xs text-slate-400">Recalibrate drifting telemetry sensors to nominal NASA targets</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Time Remaining</span>
            <span className={`text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`}>{timeLeft}s</span>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">✕ Close</button>
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleSelectChannel(ch)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedChannelId === ch.id
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase">{ch.system}</span>
                  {ch.isCalibrated ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> CALIBRATED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                      <AlertCircle className="w-3 h-3" /> DRIFTING
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-slate-200 truncate">{ch.name}</div>
                <div className="mt-2 text-xs font-mono text-cyan-300">
                  Current: {ch.currentReading} {ch.unit} | Target: {ch.nominalTarget} ±{ch.tolerance}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-300">Tune Valve / Potentiometer:</span>
              <span className="font-mono text-lg font-bold text-cyan-400">
                {sliderValue} {selectedChannel.unit}
              </span>
            </div>
            <input
              type="range"
              min={Math.min(selectedChannel.nominalTarget * 0.4, selectedChannel.currentReading * 0.5)}
              max={Math.max(selectedChannel.nominalTarget * 1.6, selectedChannel.currentReading * 1.5)}
              step={selectedChannel.unit === 'L/min' ? 0.1 : 1}
              value={sliderValue}
              onChange={(e) => setSliderValue(parseFloat(e.target.value))}
              disabled={selectedChannel.isCalibrated}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
              <span>Target: {selectedChannel.nominalTarget} {selectedChannel.unit}</span>
              <span>Tolerance Band: ±{selectedChannel.tolerance} {selectedChannel.unit}</span>
            </div>

            <button
              onClick={handleCalibrate}
              disabled={selectedChannel.isCalibrated}
              className={`w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                selectedChannel.isCalibrated
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:scale-98'
              }`}
            >
              <Wrench className="w-4 h-4" />
              {selectedChannel.isCalibrated ? 'Sensor Calibrated & Locked' : 'Apply Calibration Lock'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className={`text-4xl font-extrabold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? 'DIAGNOSTICS COMPLETE!' : 'TIME EXPIRED'}
          </div>
          <p className="text-sm text-slate-300">
            {won
              ? `Outstanding telemetry calibration! All life-support instruments restored to nominal baseline. Score: +${score} pts`
              : 'Sensors remained out of alignment. ECLSS telemetry telemetry drift warning triggered.'}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold flex items-center gap-2 text-white"
            >
              <RotateCcw className="w-4 h-4" /> Replay Diagnostic
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-slate-200"
            >
              Return to Mission
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

