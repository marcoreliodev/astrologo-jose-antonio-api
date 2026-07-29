import { Injectable } from '@nestjs/common';
import { REELS_CONFIG, ReelEntry } from './reels.config';

export interface PlanetReel {
  planet: string;
  sign: number;
  signName: string;
  reels: ReelEntry[];
}

const SIGN_NAMES = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

@Injectable()
export class ReelsService {
  getReelsForChart(planets: { name: string; sign: number }[]): PlanetReel[] {
    const result: PlanetReel[] = [];

    for (const planet of planets) {
      const planetConfig = REELS_CONFIG[planet.name];
      if (!planetConfig) continue;

      const reels = planetConfig[planet.sign];
      if (!reels || reels.length === 0) continue;

      result.push({
        planet: planet.name,
        sign: planet.sign,
        signName: SIGN_NAMES[planet.sign],
        reels,
      });
    }

    return result;
  }
}
