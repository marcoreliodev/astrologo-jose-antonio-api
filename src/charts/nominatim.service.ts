import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface GeoResult {
  displayName: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

@Injectable()
export class NominatimService {
  constructor(
    @InjectPinoLogger(NominatimService.name)
    private readonly logger: PinoLogger,
  ) {}

  async search(query: string): Promise<GeoResult[]> {
    if (query.trim().length < 3) return [];

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&countrycodes=br`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AstrologoApp/1.0 (contato@seudominio.com)',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      const data: any[] = await response.json();

      return data.map((item) => ({
        displayName: item.display_name,
        city:
          item.address?.city ??
          item.address?.town ??
          item.address?.village ??
          item.address?.municipality ??
          '',
        state: item.address?.state ?? '',
        country: item.address?.country ?? '',
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
      }));
    } catch (err) {
      this.logger.error({ query, err }, 'Erro ao consultar Nominatim');
      throw new InternalServerErrorException('Erro ao buscar localização');
    }
  }
}
