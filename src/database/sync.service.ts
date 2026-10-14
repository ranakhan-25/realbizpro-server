/* eslint-disable prettier/prettier */

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/sequelize';
import { DatabaseSyncOptions } from 'node:sqlite';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class DatabaseSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(
    DatabaseSyncService.name,
  );

  constructor(
    private readonly configService: ConfigService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const syncCfg =
      this.configService.getOrThrow<DatabaseSyncOptions>(
        'database.sync',
        { infer: true },
      );

    if (!syncCfg.enabled) {
      this.logger.log(
        'Skipping database sync (database.sync.enabled=false).',
      );
      return;
    }

    try {
      await this.sequelize.sync({
        force: false,
        alter: false,
      });

      this.logger.log('Database synchronized');
    } catch (error: any) {
      this.logger.error(
        `Database sync failed: ${error?.message ?? error}`,
      );

      if (error?.parent) {
        this.logger.error(
          `PostgreSQL error: ${error.parent.message}`,
        );
        this.logger.error(
          `PostgreSQL code: ${error.parent.code ?? 'N/A'}`,
        );
        this.logger.error(
          `SQL: ${error.sql ?? 'N/A'}`,
        );
      }

      throw error;
    }
  }
}
