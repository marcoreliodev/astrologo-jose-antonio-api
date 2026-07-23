import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import * as path from 'path';
import * as fs from 'fs';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LogsModule } from './logs/logs.module';
import { User } from './users/user.entity';
import { Chart } from './charts/charts.entity';
import { ChartsModule } from './charts/charts.module';
import { EphemerisModule } from './ephemeris/ephemeris.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const logFilePath = path.resolve(
          config.get<string>('LOG_FILE_PATH', 'logs/app.log'),
        );
        fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        const isDev = config.get('NODE_ENV') !== 'production';

        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            transport: isDev
              ? {
                  targets: [
                    {
                      target: 'pino-pretty',
                      options: { colorize: true },
                      level: 'debug',
                    },
                    {
                      target: 'pino/file',
                      options: { destination: logFilePath },
                      level: 'info',
                    },
                  ],
                }
              : {
                  target: 'pino/file',
                  options: { destination: logFilePath },
                },
          },
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER', 'nestuser'),
        password: config.get('DB_PASS', 'nestpass'),
        database: config.get('DB_NAME', 'nestdb'),
        entities: [User, Chart],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    AdminModule,
    LogsModule,
    ChartsModule,
    EphemerisModule,
  ],
})
export class AppModule {}
