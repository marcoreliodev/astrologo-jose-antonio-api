import { Module } from '@nestjs/common';
import { EphemerisCurrentService } from './ephemeris-current.service';
import { EphemerisController } from './ephemeris.controller';

@Module({
  providers: [EphemerisCurrentService],
  controllers: [EphemerisController],
})
export class EphemerisModule {}
