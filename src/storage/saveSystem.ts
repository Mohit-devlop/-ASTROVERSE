import { SimulationState, AstronautProfile } from '../simulationEngine/types';
import { createDefaultState } from '../simulationEngine/defaults';

const SAVE_KEY = 'ASTROVERSE_SAVE_DATA_V1';

export interface SaveGamePayload {
  version: string;
  savedAt: string;
  state: SimulationState;
  completedMissionIds: string[];
  unlockedAchievementIds: string[];
  highScores: Record<string, number>;
  profile: AstronautProfile;
  settings: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    voiceEnabled: boolean;
    highQualityGraphics: boolean;
  };
}

export function saveGame(
  state: SimulationState,
  completedMissions: string[] = [],
  unlockedAchievements: string[] = [],
  highScores: Record<string, number> = {}
): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const payload: SaveGamePayload = {
      version: '1.0.0',
      savedAt: new Date().toISOString(),
      state,
      completedMissionIds: completedMissions,
      unlockedAchievementIds: unlockedAchievements,
      highScores,
      profile: state.astronautProfile,
      settings: {
        masterVolume: 0.8,
        musicVolume: 0.5,
        sfxVolume: 0.7,
        voiceEnabled: true,
        highQualityGraphics: true,
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.error('Failed to save game to localStorage:', err);
    return false;
  }
}

export function loadGame(): SaveGamePayload | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveGamePayload;
    if (parsed && parsed.state) {
      return parsed;
    }
  } catch (err) {
    console.error('Failed to load saved game:', err);
  }
  return null;
}

export function clearSaveGame(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function exportSaveToFile(): void {
  const data = loadGame();
  if (!data) return;
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Astroverse_Save_Sol${data.state.sol}_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

