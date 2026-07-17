import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('charts')
export class Chart {
  @PrimaryColumn({ type: 'char', length: 36 })
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'birth_day' })
  birthDay: number;

  @Column({ name: 'birth_month' })
  birthMonth: number;

  @Column({ name: 'birth_year' })
  birthYear: number;

  @Column({ name: 'birth_hour' })
  birthHour: number;

  @Column({ name: 'birth_min' })
  birthMin: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lon: number;

  @Column({ length: 50 })
  timezone: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ type: 'json', name: 'chart_data' })
  chartData: object;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
