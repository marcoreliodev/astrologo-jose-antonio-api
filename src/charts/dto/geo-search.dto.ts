import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeoSearchDto {
  @ApiProperty({ example: 'Campina Grande' })
  @IsNotEmpty({ message: 'Nome da cidade é obrigatório' })
  @IsString()
  place: string;
}
