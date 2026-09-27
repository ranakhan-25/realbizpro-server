import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { DatabaseConfig } from 'src/common/types/databaseConfig.type';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(
    private configService: ConfigService,
  ) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    const databaseConfig =
      this.configService.get<DatabaseConfig>(
        'database',
      );

    if (!databaseConfig) {
      throw new Error(
        'Database configuration is not available',
      );
    }

    const baseOptions: SequelizeModuleOptions = {
      dialect: databaseConfig.dialect,
      host: databaseConfig.host,
      port: databaseConfig.port,
      username: databaseConfig.username,
      password: databaseConfig.password,
      database: databaseConfig.database,
      synchronize: false,
      autoLoadModels:
        databaseConfig.autoLoadModels,
      repositoryMode: true,
      logging: databaseConfig.logging
        ? this.getLoggingFunction()
        : false,
      validateOnly: false,
      timezone: databaseConfig.timezone,
      define: databaseConfig.define,
      pool: {
        max: databaseConfig.maxConnections,
        min: 0,
        idle: databaseConfig.idleTimeout,
        acquire: databaseConfig.connectionTimeout,
        evict: 1000,
      },
    };

    // Add SSL configuration for production environments
    if (databaseConfig.ssl) {
      baseOptions.dialectOptions = {
        ssl: databaseConfig.ssl,
      };
    }

    // SQLite specific configuration
    if (databaseConfig.dialect === 'sqlite') {
      baseOptions.storage =
        databaseConfig.database;
      delete baseOptions.host;
      delete baseOptions.port;
      delete baseOptions.username;
      delete baseOptions.password;
    }

    return baseOptions;
  }

  private getLoggingFunction() {
    const logLevel =
      this.configService.get<string>(
        'database.logLevel',
      );

    return (
      sql: string,
      timingOrOptions?: unknown,
    ) => {
      let timing: string | null = null;

      if (typeof timingOrOptions === 'number') {
        timing = `${timingOrOptions}ms`;
      } else if (
        timingOrOptions &&
        typeof timingOrOptions === 'object' &&
        'elapsedTime' in timingOrOptions
      ) {
        const elapsed = (timingOrOptions as any)
          .elapsedTime;
        timing = elapsed ? `${elapsed}ms` : null;
      }

      const message = timing
        ? `${sql} [${timing}]`
        : sql;

      switch (logLevel) {
        case 'debug':
          console.debug(
            `[Sequelize Debug] ${message}`,
          );
          break;
        case 'info':
          console.info(
            `[Sequelize Info] ${message}`,
          );
          break;
        case 'warn':
          console.warn(
            `[Sequelize Warn] ${message}`,
          );
          break;
        case 'error':
        default:
          console.error(
            `[Sequelize Error] ${message}`,
          );
          break;
      }
    };
  }
}
