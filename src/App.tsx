import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationState, SimSpeed, Planet, ModuleType, Difficulty, AstronautProfile } from './simulationEngine/types';
import { createDefaultState } from './simulationEngine/defaults';
import { simulateTick } from './simulationEngine/simulator';
import { SeededRNG, checkForRandomEmergency, resolveEmergency } from './eventEngine/emergencies';
import { CAMPAIGN_MISSIONS } from './missionEngine/missions';
import { ACHIEVEMENTS_LIST, Achievement } from './scoring/achievements';
import { saveGame, loadGame } from './storage/saveSystem';
import { soundEngine } from './audio/soundEngine';

// Components
import { CinematicIntro } from './scenes/CinematicIntro';
import { MissionDashboard } from './game/dashboard/MissionDashboard';
import { HabitatBuilder } from './game/habitat/HabitatBuilder';
import { MiniGamesHub } from './game/minigames/MiniGamesHub';
import { TrainingAcademy } from './game/academy/TrainingAcademy';
import { ScienceLabView } from './science/ScienceLabView';
import { NasaDataView } from './nasaData/NasaDataView';
import { AstronautCustomizer } from './game/astronaut/AstronautCustomizer';
import { NovaAssistantModal } from './nova/NovaAssistantModal';
import { EmergencyModal } from './eventEngine/EmergencyModal';
import { SettingsModal } from './components/SettingsModal';
import { TestRunnerModal } from './tests/TestRunnerModal';
import { AboutProjectView } from './components/AboutProjectView';
import { HowToPlayModal } from './components/HowToPlayModal';
import { MissionReportModal } from './components/MissionReportModal';
import confetti from 'canvas-confetti';

export function App() {
  // Navigation / View State
  const [inGame, setInGame] = useState<boolean>(false);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet>('MOON');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('EXPLORER');
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);

  // Modals
  const [showNova, setShowNova] = useState<boolean>(false);
  const [showHabitat, setShowHabitat] = useState<boolean>(false);
  const [showMiniGames, setShowMiniGames] = useState<boolean>(false);
  const [showAcademy, setShowAcademy] = useState<boolean>(false);
  const [showScience, setShowScience] = useState<boolean>(false);
  const [showNasaData, setShowNasaData] = useState<boolean>(false);
  const [showAstronaut, setShowAstronaut] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showTests, setShowTests] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  // Core Simulation State
  const [gameState, setGameState] = useState<SimulationState>(() => createDefaultState('MOON', 'EXPLORER'));
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(false);

  // Seeded RNG for predictable events
  const rngRef = useRef<SeededRNG>(new SeededRNG(Date.now()));

  // Check saved game on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved && saved.state) {
      setHasSavedGame(true);
    }
  }, []);

  // Main Simulation Loop (1-second tick)
  useEffect(() => {
    if (!inGame || gameState.isPaused || gameState.simSpeed === 0 || gameState.isGameOver) {
      return;
    }

    const interval = setInterval(() => {
      setGameState((prevState) => {
        // Delta hours based on simSpeed (1x = 0.1h = 6 mins; 3x = 0.3h; 10x = 1.0h)
        const deltaHours = prevState.simSpeed === 1 ? 0.1 : prevState.simSpeed === 3 ? 0.3 : 1.0;
        let next = simulateTick(prevState, deltaHours);

        // Emergency event roll if none active
        if (!next.activeEmergency && !next.isGameOver) {
          const emergency = checkForRandomEmergency(next, rngRef.current);
          if (emergency) {
            next.activeEmergency = emergency;
            soundEngine.playAlarm(emergency.severity === 'CRITICAL' ? 'CRITICAL' : 'SOLAR_STORM');
          }
        }

        // Mission objective completion check
        const activeMission = CAMPAIGN_MISSIONS[currentMissionIndex] || CAMPAIGN_MISSIONS[0];
        const allCompleted = activeMission.objectives.every((obj) => obj.isCompleted(next));

        if (allCompleted && !next.missionVictory && next.sol >= activeMission.durationSols) {
          next.missionVictory = true;
          soundEngine.playVictory();
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
          setShowReport(true);
        }

        // Check if game over
        if (next.isGameOver && !prevState.isGameOver) {
          soundEngine.playFailure();
          setShowReport(true);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [inGame, gameState.isPaused, gameState.simSpeed, gameState.isGameOver, currentMissionIndex]);

  // Actions
  const handleStartNewMission = (planet: Planet = selectedPlanet) => {
    const fresh = createDefaultState(planet, selectedDifficulty);
    setGameState(fresh);
    setSelectedPlanet(planet);
    setCurrentMissionIndex(planet === 'MOON' ? 0 : 6);
    setInGame(true);
    soundEngine.playToggle(true);
  };

  const handleContinueMission = () => {
    const saved = loadGame();
    if (saved && saved.state) {
      setGameState(saved.state);
      setSelectedPlanet(saved.state.planet);
      setInGame(true);
      soundEngine.playToggle(true);
    }
  };

  const handleSpeedChange = (speed: SimSpeed) => {
    setGameState((prev) => ({
      ...prev,
      simSpeed: speed,
      isPaused: speed === 0,
    }));
  };

  const handleManualSave = () => {
    saveGame(gameState);
    setHasSavedGame(true);
  };

  const handleResetGame = () => {
    const resetState = createDefaultState(selectedPlanet, selectedDifficulty);
    setGameState(resetState);
    setHasSavedGame(false);
  };

  // Module actions
  const handleToggleModule = (modId: ModuleType) => {
    setGameState((prev) => {
      const next: SimulationState = JSON.parse(JSON.stringify(prev));
      const mod = next.modules[modId];
      mod.status = mod.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
      return next;
    });
  };

  const handleUpgradeModule = (modId: ModuleType) => {
    setGameState((prev) => {
      const next: SimulationState = JSON.parse(JSON.stringify(prev));
      const mod = next.modules[modId];
      const cost = Math.round(mod.buildCostMaterials * mod.level * 1.4);
      if (next.materialsKg >= cost && mod.level < 3) {
        next.materialsKg -= cost;
        mod.level += 1;
        mod.outputMultiplier += 0.35;
        mod.health = 100;
        soundEngine.playToggle(true);
      }
      return next;
    });
  };

  const handleRepairModule = (modId: ModuleType) => {
    setGameState((prev) => {
      const next: SimulationState = JSON.parse(JSON.stringify(prev));
      const mod = next.modules[modId];
      const cost = Math.round((100 - mod.health) * 0.4);
      if (next.materialsKg >= cost) {
        next.materialsKg -= cost;
        mod.health = 100;
        soundEngine.playToggle(true);
      }
      return next;
    });
  };

  const handleResolveEmergency = (optionId: string) => {
    if (!gameState.activeEmergency) return;
    const { nextState, success } = resolveEmergency(
      gameState,
      gameState.activeEmergency,
      optionId,
      rngRef.current
    );
    setGameState(nextState);
    if (success) {
      soundEngine.playToggle(true);
    } else {
      soundEngine.playAlarm('WARNING');
    }
  };

  const handleScoreEarned = (points: number) => {
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  };

  const handleSaveAstronautProfile = (prof: AstronautProfile) => {
    setGameState((prev) => ({
      ...prev,
      astronautProfile: prof,
    }));
  };

  const activeMission = CAMPAIGN_MISSIONS[currentMissionIndex] || CAMPAIGN_MISSIONS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-slate-950">
      {!inGame ? (
        <CinematicIntro
          hasSavedGame={hasSavedGame}
          onStartNewMission={() => handleStartNewMission(selectedPlanet)}
          onContinueMission={handleContinueMission}
          onOpenHowToPlay={() => setShowHowToPlay(true)}
          onOpenScienceLab={() => setShowScience(true)}
          onOpenNova={() => setShowNova(true)}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAbout={() => setShowAbout(true)}
          onOpenTests={() => setShowTests(true)}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={(p) => {
            setSelectedPlanet(p);
            soundEngine.playClick();
          }}
        />
      ) : (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
          <MissionDashboard
            state={gameState}
            currentMissionId={activeMission.id}
            onSpeedChange={handleSpeedChange}
            onOpenNova={() => setShowNova(true)}
            onOpenHabitat={() => setShowHabitat(true)}
            onOpenMiniGames={() => setShowMiniGames(true)}
            onOpenAcademy={() => setShowAcademy(true)}
            onOpenScience={() => setShowScience(true)}
            onOpenNasaData={() => setShowNasaData(true)}
            onOpenAstronaut={() => setShowAstronaut(true)}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
      )}

      {/* MODALS */}
      {showNova && <NovaAssistantModal state={gameState} onClose={() => setShowNova(false)} />}

      {showHabitat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowHabitat(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200"
              >
                ✕ Close
              </button>
            </div>
            <HabitatBuilder
              state={gameState}
              onToggleStatus={handleToggleModule}
              onUpgradeModule={handleUpgradeModule}
              onRepairModule={handleRepairModule}
            />
          </div>
        </div>
      )}

      {showMiniGames && (
        <MiniGamesHub
          planet={gameState.planet}
          onScoreEarned={handleScoreEarned}
          onClose={() => setShowMiniGames(false)}
        />
      )}

      {showAcademy && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <TrainingAcademy
            onCompleteExercise={handleScoreEarned}
            onClose={() => setShowAcademy(false)}
          />
        </div>
      )}

      {showScience && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <ScienceLabView
            onScoreEarned={handleScoreEarned}
            onClose={() => setShowScience(false)}
          />
        </div>
      )}

      {showNasaData && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <NasaDataView onClose={() => setShowNasaData(false)} />
        </div>
      )}

      {showAstronaut && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <AstronautCustomizer
            profile={gameState.astronautProfile}
            planet={gameState.planet}
            rank="Cadet"
            score={gameState.score}
            onSaveProfile={handleSaveAstronautProfile}
            onClose={() => setShowAstronaut(false)}
          />
        </div>
      )}

      {showSettings && (
        <SettingsModal
          onSaveManual={handleManualSave}
          onResetGame={handleResetGame}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showTests && <TestRunnerModal onClose={() => setShowTests(false)} />}

      {showAbout && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <AboutProjectView onClose={() => setShowAbout(false)} />
        </div>
      )}

      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}

      {gameState.activeEmergency && (
        <EmergencyModal
          emergency={gameState.activeEmergency}
          onResolveOption={handleResolveEmergency}
        />
      )}

      {showReport && (
        <MissionReportModal
          state={gameState}
          onRestartMission={() => {
            setShowReport(false);
            handleStartNewMission(selectedPlanet === 'MOON' ? 'MARS' : 'MOON');
          }}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default App;
