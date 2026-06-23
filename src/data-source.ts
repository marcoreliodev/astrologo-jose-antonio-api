import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'nestuser',
  password: process.env.DB_PASS || 'nestpass',
  database: process.env.DB_NAME || 'nestdb',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
});
