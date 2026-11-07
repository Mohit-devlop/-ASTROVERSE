import { SimulationState } from '../simulationEngine/types';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  checkUnlocked: (state: SimulationState) => boolean;
}

export type CommanderRank =
  | 'CADET'
  | 'EXPLORER'
  | 'SPACE ENGINEER'
  | 'MISSION COMMANDER'
  | 'LEGENDARY ASTRONAUT';

export function getCommanderRank(score: number): CommanderRank {
  if (score >= 9000) return 'LEGENDARY ASTRONAUT';
  if (score >= 5000) return 'MISSION COMMANDER';
  if (score >= 2500) return 'SPACE ENGINEER';
  if (score >= 1000) return 'EXPLORER';
  return 'CADET';
}

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first-landing',
    title: 'First Landing',
    description: 'Safely touch down and begin your first planetary mission.',
    icon: 'Rocket',
    points: 100,
    unlocked: true,
    checkUnlocked: (s) => s.sol >= 1,
  },
  {
    id: 'oxygen-guardian',
    title: 'Oxygen Guardian',
    description: 'Maintain cabin oxygen above 140 kg while operating the electrolyzer.',
    icon: 'Wind',
    points: 250,
    unlocked: false,
    checkUnlocked: (s) => s.oxygenKg >= 140 && s.modules.OXYGEN_GENERATOR.status === 'ONLINE',
  },
  {
    id: 'water-master',
    title: 'Water Master',
    description: 'Reach 90%+ water recovery efficiency with over 200 kg in reserves.',
    icon: 'Droplets',
    points: 300,
    unlocked: false,
    checkUnlocked: (s) => s.waterKg >= 200 && s.waterRecoveryEfficiency >= 0.9,
  },
  {
    id: 'power-engineer',
    title: 'Power Engineer',
    description: 'Fully charge the battery bank to 110+ kWh during daylight hours.',
    icon: 'Zap',
    points: 250,
    unlocked: false,
    checkUnlocked: (s) => s.batteryKwh >= 110,
  },
  {
    id: 'radiation-protector',
    title: 'Radiation Protector',
    description: 'Upgrade the Radiation Shelter to level 2 and withstand space radiation.',
    icon: 'ShieldCheck',
    points: 400,
    unlocked: false,
    checkUnlocked: (s) => s.modules.RADIATION_SHELTER.level >= 2,
  },
  {
    id: 'lunar-survivor',
    title: 'Lunar Survivor',
    description: 'Survive 5 lunar sols without any life-support failures.',
    icon: 'Moon',
    points: 500,
    unlocked: false,
    checkUnlocked: (s) => s.planet === 'MOON' && s.sol >= 5,
  },
  {
    id: 'mars-explorer',
    title: 'Mars Explorer',
    description: 'Establish a working Martian habitat and greenhouse.',
    icon: 'Compass',
    points: 500,
    unlocked: false,
    checkUnlocked: (s) => s.planet === 'MARS' && s.modules.GREENHOUSE.status === 'ONLINE',
  },
  {
    id: 'emergency-hero',
    title: 'Emergency Hero',
    description: 'Successfully resolve 3 major emergency events with crew intact.',
    icon: 'AlertTriangle',
    points: 600,
    unlocked: false,
    checkUnlocked: (s) => s.emergencyHistory.filter((e) => e.solved).length >= 3,
  },
  {
    id: 'science-genius',
    title: 'Science Genius',
    description: 'Accumulate over 100 Science Data points and upgrade the laboratory.',
    icon: 'Sparkles',
    points: 500,
    unlocked: false,
    checkUnlocked: (s) => s.scienceDataPoints >= 100,
  },
  {
    id: 'legendary-commander',
    title: 'Legendary Commander',
    description: 'Achieve a total mission score of 5,000+ points with 100% crew survival.',
    icon: 'Award',
    points: 1000,
    unlocked: false,
    checkUnlocked: (s) => s.score >= 5000 && s.crew.every((c) => c.health >= 80),
  },
];

