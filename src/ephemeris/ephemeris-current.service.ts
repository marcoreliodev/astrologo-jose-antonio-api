import { Injectable } from '@nestjs/common';
import * as sweph from 'sweph';
import * as path from 'path';

const BODIES = [
  { id: sweph.constants.SE_SUN, name: 'Sun' },
  { id: sweph.constants.SE_MOON, name: 'Moon' },
  { id: sweph.constants.SE_MERCURY, name: 'Mercury' },
  { id: sweph.constants.SE_VENUS, name: 'Venus' },
  { id: sweph.constants.SE_MARS, name: 'Mars' },
  { id: sweph.constants.SE_JUPITER, name: 'Jupiter' },
  { id: sweph.constants.SE_SATURN, name: 'Saturn' },
  { id: sweph.constants.SE_URANUS, name: 'Uranus' },
  { id: sweph.constants.SE_NEPTUNE, name: 'Neptune' },
  { id: sweph.constants.SE_PLUTO, name: 'Pluto' },
  { id: sweph.constants.SE_TRUE_NODE, name: 'NorthNode' },
  { id: sweph.constants.SE_CHIRON, name: 'Chiron' },
];

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
export class EphemerisCurrentService {
  constructor() {
    sweph.set_ephe_path(path.join(process.cwd(), 'ephe'));
  }

  getCurrent() {
    const now = new Date();

    const jdResult = sweph.utc_to_jd(
      now.getUTCFullYear(),
      now.getUTCMonth() + 1,
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      sweph.constants.SE_GREG_CAL,
    );

    const jd_et = jdResult.data[0];
    const flag = sweph.constants.SEFLG_SPEED | sweph.constants.SEFLG_SWIEPH;
    const flagEquatorial = flag | sweph.constants.SEFLG_EQUATORIAL;

    const bodies = BODIES.map((body) => {
      const result = sweph.calc(jd_et, body.id, flag);
      const resultEq = sweph.calc(jd_et, body.id, flagEquatorial);

      if (result.flag < 0) {
        throw new Error(
          `Erro ao calcular ${body.name}: ${(result as any).error}`,
        );
      }

      const [longitude, latitude, distance, lonSpeed] = result.data as number[];
      const declination =
        resultEq.flag >= 0
          ? parseFloat((resultEq.data as number[])[1].toFixed(6))
          : null;

      const sign = Math.floor(longitude / 30);
      const degInSign = longitude % 30;
      const deg = Math.floor(degInSign);
      const minTotal = (degInSign % 1) * 60;
      const min = Math.floor(minTotal);
      const sec = Math.floor((minTotal % 1) * 60);

      return {
        name: body.name,
        longitude: parseFloat(longitude.toFixed(6)),
        sign,
        signName: SIGN_NAMES[sign],
        degInSign: deg,
        minute: min,
        second: sec,
        longitudeFormatted: `${deg}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`,
        speedLongitude: parseFloat(lonSpeed.toFixed(6)),
        retrograde: lonSpeed < 0,
        latitude: parseFloat(latitude.toFixed(6)),
        distance: parseFloat(distance.toFixed(8)),
        declination,
      };
    });

    return {
      calculatedAt: now.toISOString(),
      bodies,
    };
  }
}
