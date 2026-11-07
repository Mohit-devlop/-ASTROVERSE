import React, { useState } from 'react';
import {
  Home,
  Wind,
  Filter,
  Droplet,
  Sun,
  BatteryCharging,
  Sprout,
  Shield,
  FlaskConical,
  Truck,
  Activity,
  ThermometerSnowflake,
  Wrench,
  Power,
  ChevronUp,
  Layers,
} from 'lucide-react';
import { HabitatModule, ModuleType, SimulationState } from '../../simulationEngine/types';
import { soundEngine } from '../../audio/soundEngine';

interface HabitatBuilderProps {
  state: SimulationState;
  onToggleStatus: (modId: ModuleType) => void;
  onUpgradeModule: (modId: ModuleType) => void;
  onRepairModule: (modId: ModuleType) => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Home,
  Wind,
  Filter,
  Droplet,
  Sun,
  BatteryCharging,
  Sprout,
  Shield,
  FlaskConical,
  Truck,
  Activity,
  ThermometerSnowflake,
};

export const HabitatBuilder: React.FC<HabitatBuilderProps> = ({
  state,
  onToggleStatus,
  onUpgradeModule,
  onRepairModule,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<ModuleType>('HABITAT');

  const selectedModule: HabitatModule = state.modules[selectedModuleId];
  const IconComp = ICON_MAP[selectedModule.iconName] || Home;

  const upgradeCost = Math.round(selectedModule.buildCostMaterials * selectedModule.level * 1.4);
  const repairCost = Math.round((100 - selectedModule.health) * 0.4);

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 text-white backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 text-blue-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
              OUTPOST HABITAT & SUBSYSTEM ARRAY
            </h2>
            <p className="text-xs text-slate-400">
              Manage life-support hardware, power allocation, and structural upgrades
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
          <span className="text-slate-400">Construction Stockpile:</span>
          <span className="text-amber-400 font-bold">{state.materialsKg} kg Materials</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Grid Selector */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(state.modules) as ModuleType[]).map((key) => {
            const mod = state.modules[key];
            const ModIcon = ICON_MAP[mod.iconName] || Home;
            const isSelected = selectedModuleId === key;

            return (
              <button
                key={key}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedModuleId(key);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-800/50 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      mod.status === 'ONLINE'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    <ModIcon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      mod.status === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-600/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-extrabold text-slate-200 truncate">{mod.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>Lvl {mod.level}</span>
                    <span className="text-amber-300">{mod.powerDemandKw} kW</span>
                  </div>

                  {/* Health Bar */}
                  <div className="w-full bg-slate-700/60 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${
                        mod.health > 80 ? 'bg-emerald-400' : mod.health > 40 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${mod.health}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Module Detail Panel */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/30">
                <IconComp className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-100">{selectedModule.name}</h3>
                <span className="text-xs font-mono text-cyan-400">
                  Upgrade Tier: Level {selectedModule.level} of 3
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedModule.description}</p>

            <div className="space-y-2.5 text-xs font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Power Consumption:</span>
                <span className="text-amber-400 font-bold">{selectedModule.powerDemandKw} kW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hardware Condition:</span>
                <span
                  className={`font-bold ${
                    selectedModule.health > 70
                      ? 'text-emerald-400'
                      : selectedModule.health > 40
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {selectedModule.health.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Output Multiplier:</span>
                <span className="text-cyan-400 font-bold">{selectedModule.outputMultiplier.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            {/* Power Toggle */}
            <button
              onClick={() => {
                soundEngine.playToggle(selectedModule.status !== 'ONLINE');
                onToggleStatus(selectedModule.id);
              }}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedModule.status === 'ONLINE'
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <Power className="w-4 h-4" />
              {selectedModule.status === 'ONLINE' ? 'Deactivate Subsystem (Cut Power)' : 'Energize Subsystem'}
            </button>

            {/* Repair */}
            {selectedModule.health < 95 && (
              <button
                onClick={() => onRepairModule(selectedModule.id)}
                disabled={state.materialsKg < repairCost}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  state.materialsKg >= repairCost
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                    : 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                Refurbish Maintenance ({repairCost} kg Mat)
              </button>
            )}

            {/* Upgrade */}
            {selectedModule.level < 3 && (
              <button
                onClick={() => onUpgradeModule(selectedModule.id)}
                disabled={state.materialsKg < upgradeCost}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  state.materialsKg >= upgradeCost
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500/40 shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
                Upgrade to Tier {selectedModule.level + 1} ({upgradeCost} kg Mat)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

