import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ChartsService } from './charts.service';
import { CreateChartDto } from './dto/create-chart.dto';
import { GeoSearchDto } from './dto/geo-search.dto';

@ApiTags('Charts')
@ApiBearerAuth()
@Controller('charts')
@UseGuards(AuthGuard('jwt'))
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get('cities')
  searchCities(@Query() query: GeoSearchDto) {
    return this.chartsService.searchCities(query.place);
  }

  @Post()
  @ApiOperation({ summary: 'Gerar e salvar mapa astral' })
  create(@Request() req, @Body() dto: CreateChartDto) {
    return this.chartsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar meus mapas astrais' })
  findAll(@Request() req) {
    return this.chartsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mapa astral por ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.chartsService.findOne(id, req.user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover mapa astral' })
  remove(@Param('id') id: string, @Request() req) {
    return this.chartsService.remove(id, req.user);
  }
}

@ApiTags('Admin / Charts')
@ApiBearerAuth()
@Controller('admin/charts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os mapas astrais' })
  findAll() {
    return this.chartsService.findAllAdmin();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar mapas astrais de um usuário' })
  findByUser(@Param('userId') userId: string) {
    return this.chartsService.findAllByUserAdmin(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mapa astral por ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.chartsService.findOne(id, req.user);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover mapa astral' })
  remove(@Param('id') id: string, @Request() req) {
    return this.chartsService.remove(id, req.user);
  }
}
