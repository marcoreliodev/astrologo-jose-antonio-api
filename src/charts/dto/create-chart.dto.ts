import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateChartDto {
  @ApiProperty({ example: 'João Silva' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @ApiProperty({ example: 15 })
  @IsInt()
  @Min(1)
  @Max(31)
  birthDay: number;

  @ApiProperty({ example: 6 })
  @IsInt()
  @Min(1)
  @Max(12)
  birthMonth: number;

  @ApiProperty({ example: 1990 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  birthYear: number;

  @ApiProperty({ example: 14 })
  @IsInt()
  @Min(0)
  @Max(23)
  birthHour: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(0)
  @Max(59)
  birthMin: number;

  @ApiProperty({ example: -7.23 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: -35.88 })
  @IsNumber()
  lon: number;

  @ApiProperty({ example: 'Campina Grande' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: 'Paraíba' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Brasil' })
  @IsOptional()
  @IsString()
  country?: string;
}
