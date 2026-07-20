import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { LogsService } from './logs.service';

@ApiTags('Admin / Logs')
@ApiBearerAuth()
@Controller('admin/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar últimas linhas do log' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 200 })
  getLogs(@Query('limit') limit?: number) {
    return this.logsService.getLastLines(limit ? Number(limit) : 200);
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Limpar arquivo de log' })
  clearLogs() {
    this.logsService.clearLogs();
  }
}
