import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { Chart } from './charts.entity';
import { ChartsService } from './charts.service';
import { ChartsController, AdminChartsController } from './charts.controller';
import { EphemerisService } from './ephemeris.service';
import { NominatimService } from './nominatim.service';
import { ReelsModule } from 'src/reels/reels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chart]), LoggerModule, ReelsModule],
  providers: [ChartsService, EphemerisService, NominatimService],
  controllers: [ChartsController, AdminChartsController],
})
export class ChartsModule {}
