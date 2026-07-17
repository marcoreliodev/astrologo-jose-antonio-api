import { Injectable } from '@nestjs/common';
import * as sweph from 'sweph';
import * as path from 'path';
import { find } from 'geo-tz';

const PLANETS = [
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
  { id: sweph.constants.SE_MEAN_NODE, name: 'NorthNode' },
  { id: sweph.constants.SE_CHIRON, name: 'Chiron' },
];

const ASPECT_DEFINITIONS = [
  { name: 'conjunction', angle: 0, orb: 8 },
  { name: 'sextile', angle: 60, orb: 6 },
  { name: 'square', angle: 90, orb: 8 },
  { name: 'trine', angle: 120, orb: 8 },
  { name: 'opposition', angle: 180, orb: 8 },
  { name: 'quincunx', angle: 150, orb: 3 },
  { name: 'semisextile', angle: 30, orb: 2 },
  { name: 'semisquare', angle: 45, orb: 2 },
  { name: 'sesquisquare', angle: 135, orb: 2 },
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
export class EphemerisService {
  constructor() {
    sweph.set_ephe_path(path.join(process.cwd(), 'ephe'));
  }

  private getUtcOffset(lat: number, lon: number, date: Date): number {
    const [timezone] = find(lat, lon);
    const formatter = new Intl.DateTimeFormat('en', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(date);
    const offsetStr =
      parts.find((p) => p.type === 'timeZoneName')?.value ?? 'UTC+0';
    // offsetStr exemplo: "GMT-3" ou "GMT+5:30"
    const match = offsetStr.match(/GMT([+-])(\d+)(?::(\d+))?/);
    if (!match) return 0;
    const sign = match[1] === '+' ? 1 : -1;
    const hours = parseInt(match[2]);
    const minutes = parseInt(match[3] ?? '0');
    return sign * (hours + minutes / 60);
  }

  calculate(input: {
    year: number;
    month: number;
    day: number;
    hour: number;
    min: number;
    lat: number;
    lon: number;
  }) {
    const birthDate = new Date(
      Date.UTC(input.year, input.month - 1, input.day),
    );
    const tzone = this.getUtcOffset(input.lat, input.lon, birthDate);

    const localHour = input.hour + input.min / 60;
    const utcHour = localHour - tzone;

    // ajustar se passar da meia-noite
    let year = input.year;
    let month = input.month;
    let day = input.day;
    let finalUtcHour = utcHour;

    if (utcHour >= 24) {
      finalUtcHour = utcHour - 24;
      // avançar um dia
      const date = new Date(Date.UTC(year, month - 1, day + 1));
      year = date.getUTCFullYear();
      month = date.getUTCMonth() + 1;
      day = date.getUTCDate();
    } else if (utcHour < 0) {
      finalUtcHour = utcHour + 24;
      // voltar um dia
      const date = new Date(Date.UTC(year, month - 1, day - 1));
      year = date.getUTCFullYear();
      month = date.getUTCMonth() + 1;
      day = date.getUTCDate();
    }

    const utcH = Math.floor(finalUtcHour);
    const utcM = Math.round((finalUtcHour - utcH) * 60);

    const jdResult = sweph.utc_to_jd(
      year,
      month,
      day,
      utcH,
      utcM,
      0,
      sweph.constants.SE_GREG_CAL,
    );

    const jd_et = jdResult.data[0]; // para calc (planetas)
    const jd_ut = jdResult.data[1]; // para houses

    const flag = sweph.constants.SEFLG_SPEED | sweph.constants.SEFLG_SWIEPH;

    // Planetas — usa calc (ET) não calc_ut
    const planets = PLANETS.map((planet) => {
      const result = sweph.calc(jd_et, planet.id, flag);

      if (result.flag < 0) {
        throw new Error(
          `Erro ao calcular ${planet.name}: ${(result as any).error}`,
        );
      }

      // data: [longitude, latitude, distance, lonSpeed, latSpeed, distSpeed]
      const longitude = result.data[0];
      const speed = result.data[3];
      const sign = Math.floor(longitude / 30);

      return {
        name: planet.name,
        longitude: parseFloat(longitude.toFixed(6)),
        sign,
        signName: SIGN_NAMES[sign],
        degInSign: parseFloat((longitude % 30).toFixed(4)),
        retrograde: speed < 0,
        speed: parseFloat(speed.toFixed(6)),
      };
    });

    // Casas Placidus — usa houses (UT)
    const housesResult = sweph.houses(jd_ut, input.lat, input.lon, 'P');

    if (housesResult.flag < 0) {
      throw new Error(`Erro ao calcular casas: ${(housesResult as any).error}`);
    }

    // housesResult.data é HouseData<12>: { cusps: number[], points: number[] }
    // cusps[0] = cúspide casa 1 ... cusps[11] = cúspide casa 12
    // points[0] = ASC, points[1] = MC
    const cusps = housesResult.data.houses.map((cusp: number, i: number) => {
      const sign = Math.floor(cusp / 30);
      return {
        house: i + 1,
        longitude: parseFloat(cusp.toFixed(4)),
        sign,
        signName: SIGN_NAMES[sign],
        degInSign: parseFloat((cusp % 30).toFixed(4)),
      };
    });

    const asc = housesResult.data.points[0];
    const mc = housesResult.data.points[1];

    const angles = {
      asc: parseFloat(asc.toFixed(4)),
      mc: parseFloat(mc.toFixed(4)),
      dsc: parseFloat(((asc + 180) % 360).toFixed(4)),
      ic: parseFloat(((mc + 180) % 360).toFixed(4)),
    };

    // Aspectos
    const aspects: object[] = [];
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const diff = Math.abs(planets[i].longitude - planets[j].longitude);
        const angle = diff > 180 ? 360 - diff : diff;

        for (const aspect of ASPECT_DEFINITIONS) {
          const orb = Math.abs(angle - aspect.angle);
          if (orb <= aspect.orb) {
            aspects.push({
              planet1: planets[i].name,
              planet2: planets[j].name,
              aspect: aspect.name,
              angle: parseFloat(angle.toFixed(2)),
              orb: parseFloat(orb.toFixed(2)),
            });
            break;
          }
        }
      }
    }

    return { planets, cusps, angles, aspects };
  }
}
