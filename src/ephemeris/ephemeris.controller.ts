import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EphemerisCurrentService } from './ephemeris-current.service';

@ApiTags('Ephemeris')
@Controller('ephemeris')
export class EphemerisController {
  constructor(
    private readonly ephemerisDailyService: EphemerisCurrentService,
  ) {}

  @Get('current')
  @ApiOperation({ summary: 'Posições atuais dos planetas (tempo real)' })
  getCurrent() {
    return this.ephemerisDailyService.getCurrent();
  }
}
