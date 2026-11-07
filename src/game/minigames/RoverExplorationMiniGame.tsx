import React, { useState, useEffect, useCallback } from 'react';
import { Truck, BatteryCharging, Compass, Radio, RotateCcw } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

interface GridTile {
  x: number;
  y: number;
  type: 'EMPTY' | 'BOULDER' | 'ICE_DEPOSIT' | 'MINERAL_VEIN' | 'BASE';
  discovered: boolean;
}

interface RoverExplorationMiniGameProps {
  planet: 'MOON' | 'MARS';
  onScoreEarned: (points: number) => void;
  onClose: () => void;
}

const GRID_SIZE = 7;

export const RoverExplorationMiniGame: React.FC<RoverExplorationMiniGameProps> = ({ planet, onScoreEarned, onClose }) => {
  const [roverPos, setRoverPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [battery, setBattery] = useState<number>(100);
  const [waterCollectedKg, setWaterCollectedKg] = useState<number>(0);
  const [mineralsCollected, setMineralsCollected] = useState<number>(0);
  const [grid, setGrid] = useState<GridTile[]>([]);
  const [radarActive, setRadarActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const initMap = useCallback(() => {
    const tiles: GridTile[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x === 0 && y === 0) {
          tiles.push({ x, y, type: 'BASE', discovered: true });
        } else {
          const rand = Math.random();
          let type: GridTile['type'] = 'EMPTY';
          if (rand < 0.18) type = 'BOULDER';
          else if (rand < 0.35) type = 'ICE_DEPOSIT';
          else if (rand < 0.48) type = 'MINERAL_VEIN';
          tiles.push({ x, y, type, discovered: false });
        }
      }
    }
    setGrid(tiles);
    setRoverPos({ x: 0, y: 0 });
    setBattery(100);
    setWaterCollectedKg(0);
    setMineralsCollected(0);
    setGameOver(false);
    setWon(false);
    setScore(0);
  }, []);

  useEffect(() => {
    initMap();
  }, [initMap]);

  const moveRover = (dx: number, dy: number) => {
    if (gameOver) return;

    const newX = roverPos.x + dx;
    const newY = roverPos.y + dy;

    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
      soundEngine.playToggle(false);
      return; // Wall boundary
    }

    const targetTile = grid.find((t) => t.x === newX && t.y === newY);
    if (!targetTile) return;

    if (targetTile.type === 'BOULDER') {
      soundEngine.playAlarm('WARNING');
      setBattery((b) => Math.max(0, b - 15)); // Wheel collision penalty
      return;
    }

    // Spend battery
    soundEngine.playClick();
    const nextBattery = battery - 4;
    setBattery(Math.max(0, nextBattery));

    setRoverPos({ x: newX, y: newY });

    // Discover tile and collect resources
    const updatedGrid = grid.map((t) => {
      if (t.x === newX && t.y === newY) {
        if (!t.discovered) {
          if (t.type === 'ICE_DEPOSIT') {
            setWaterCollectedKg((w) => w + 20);
            soundEngine.playToggle(true);
          } else if (t.type === 'MINERAL_VEIN') {
            setMineralsCollected((m) => m + 15);
            soundEngine.playToggle(true);
          }
        }
        return { ...t, discovered: true };
      }
      return t;
    });
    setGrid(updatedGrid);

    // Return to base victory condition: at least 40kg water collected and back at base (0,0)
    if (newX === 0 && newY === 0 && (waterCollectedKg >= 40 || mineralsCollected >= 30)) {
      setWon(true);
      setGameOver(true);
      const finalScore = 800 + waterCollectedKg * 10 + mineralsCollected * 10 + nextBattery * 5;
      setScore(finalScore);
      onScoreEarned(finalScore);
      soundEngine.playVictory();
    } else if (nextBattery <= 0) {
      setGameOver(true);
      soundEngine.playFailure();
    }
  };

  const handlePulseRadar = () => {
    if (battery < 10) return;
    setBattery((b) => b - 10);
    soundEngine.playToggle(true);
    setRadarActive(true);
    // Reveal all tiles adjacent to rover
    setGrid((prev) =>
      prev.map((t) => {
        const dist = Math.abs(t.x - roverPos.x) + Math.abs(t.y - roverPos.y);
        return dist <= 2 ? { ...t, discovered: true } : t;
      })
    );
    setTimeout(() => setRadarActive(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-white max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-emerald-300">MINI-GAME 4: Planetary Rover Exploration</h3>
            <p className="text-xs text-slate-400">Prospect crater terrain for water ice & rare minerals, then return to base</p>
          </div>
        </div>
        <button onClick={onClose} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold">✕ Close</button>
      </div>

      {!gameOver ? (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> Battery
              </span>
              <span className={`text-lg font-mono font-bold ${battery < 20 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {battery}%
              </span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Water Ice Recovered</span>
              <span className="text-lg font-mono font-bold text-cyan-400">{waterCollectedKg} kg</span>
            </div>
            <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Minerals Recovered</span>
              <span className="text-lg font-mono font-bold text-amber-400">{mineralsCollected} kg</span>
            </div>
          </div>

          {/* Grid Map */}
          <div className="grid grid-cols-7 gap-1.5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 mx-auto w-fit">
            {grid.map((tile) => {
              const isRover = tile.x === roverPos.x && tile.y === roverPos.y;
              return (
                <div
                  key={`${tile.x}-${tile.y}`}
                  className={`w-11 h-11 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                    isRover
                      ? 'bg-emerald-500 border-white text-slate-950 ring-2 ring-emerald-400 z-10 scale-105 shadow-lg'
                      : tile.x === 0 && tile.y === 0
                      ? 'bg-blue-900/60 border-blue-500 text-blue-300'
                      : !tile.discovered
                      ? 'bg-slate-900/90 border-slate-800/80 text-slate-700'
                      : tile.type === 'BOULDER'
                      ? 'bg-red-950/80 border-red-800 text-red-400'
                      : tile.type === 'ICE_DEPOSIT'
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : tile.type === 'MINERAL_VEIN'
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-800/40 border-slate-800 text-slate-600'
                  }`}
                >
                  {isRover ? '🚜' : tile.x === 0 && tile.y === 0 ? '🏠' : !tile.discovered ? '·' : tile.type === 'BOULDER' ? '🪨' : tile.type === 'ICE_DEPOSIT' ? '❄️' : tile.type === 'MINERAL_VEIN' ? '💎' : ''}
                </div>
              );
            })}
          </div>

          {/* D-Pad Controls */}
          <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700">
            <div className="space-y-1 text-xs text-slate-300">
              <div>🎯 <b>Objective:</b> Drill 40kg Water Ice (❄️) or Minerals (💎), then return to Outpost Dock (🏠).</div>
              <div>⚠️ Watch your battery! Avoid impassable boulders (🪨).</div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={() => moveRover(0, -1)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-bold text-sm active:scale-95 flex items-center justify-center"
              >
                ▲
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={() => moveRover(-1, 0)}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-bold text-sm active:scale-95 flex items-center justify-center"
                >
                  ◀
                </button>
                <button
                  onClick={handlePulseRadar}
                  className="px-2 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-xs active:scale-95 flex items-center gap-1"
                >
                  <Radio className="w-3.5 h-3.5" /> GPR
                </button>
                <button
                  onClick={() => moveRover(1, 0)}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-bold text-sm active:scale-95 flex items-center justify-center"
                >
                  ▶
                </button>
              </div>
              <button
                onClick={() => moveRover(0, 1)}
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg font-bold text-sm active:scale-95 flex items-center justify-center"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className={`text-4xl font-extrabold ${won ? 'text-emerald-400' : 'text-red-400'}`}>
            {won ? 'SURFACE EXPEDITION SUCCESS!' : 'ROVER STRANDED'}
          </div>
          <p className="text-sm text-slate-300">
            {won
              ? `Pristine space resources delivered to outpost airlock! Score: +${score} pts`
              : 'Rover battery drained to zero in the planetary dust. Crew had to launch a recovery tether.'}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={initMap}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 rounded-xl font-bold flex items-center gap-2 text-slate-950"
            >
              <RotateCcw className="w-4 h-4" /> New Expedition Map
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

