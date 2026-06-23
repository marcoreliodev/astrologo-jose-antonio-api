import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from '../common/enums/role.enum';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'char', length: 26 })
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 200 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Exclude()
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
