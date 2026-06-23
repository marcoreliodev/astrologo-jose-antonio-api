import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class UpdateRoleDto {
  @ApiProperty({ enum: Role, example: Role.ADMIN })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role inválida' })
  role: Role;
}
