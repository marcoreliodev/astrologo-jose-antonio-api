import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Chart } from './charts.entity';
import { CreateChartDto } from './dto/create-chart.dto';
import { EphemerisService } from './ephemeris.service';
import { NominatimService } from './nominatim.service';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/user.entity';
import { find } from 'geo-tz';

@Injectable()
export class ChartsService {
  constructor(
    @InjectRepository(Chart)
    private readonly chartsRepository: Repository<Chart>,
    private readonly ephemerisService: EphemerisService,
    private readonly nominatimService: NominatimService,
    @InjectPinoLogger(ChartsService.name)
    private readonly logger: PinoLogger,
  ) {}

  async searchCities(query: string) {
    return this.nominatimService.search(query);
  }

  async create(userId: string, dto: CreateChartDto): Promise<Chart> {
    const [timezone] = find(dto.lat, dto.lon);

    const chartData = this.ephemerisService.calculate({
      year: dto.birthYear,
      month: dto.birthMonth,
      day: dto.birthDay,
      hour: dto.birthHour,
      min: dto.birthMin,
      lat: dto.lat,
      lon: dto.lon,
    });

    const chart = this.chartsRepository.create({
      id: uuidv7(),
      ...dto,
      userId,
      timezone,
      chartData,
    });

    const saved = await this.chartsRepository.save(chart);

    this.logger.info(
      { chart_id: saved.id, user_id: userId },
      'Mapa astral criado',
    );
    return saved;
  }

  async findAllByUser(userId: string): Promise<Chart[]> {
    return this.chartsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, requester: User): Promise<Chart> {
    const chart = await this.chartsRepository.findOne({ where: { id } });
    if (!chart) throw new NotFoundException('Mapa astral não encontrado');

    if (requester.role !== Role.ADMIN && chart.userId !== requester.id) {
      throw new ForbiddenException('Acesso negado');
    }

    return chart;
  }

  async remove(id: string, requester: User): Promise<void> {
    const chart = await this.findOne(id, requester);
    await this.chartsRepository.remove(chart);
    this.logger.info(
      { chart_id: id, user_id: requester.id },
      'Mapa astral removido',
    );
  }

  async findAllAdmin(): Promise<Chart[]> {
    return this.chartsRepository.find({
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });
  }

  async findAllByUserAdmin(userId: string): Promise<Chart[]> {
    return this.chartsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
