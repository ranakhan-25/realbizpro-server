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
      await this.syncWithDuplicateIndexRecovery();
      this.logger.log('Database synchronized successfully.');
    } catch (error: any) {
      this.logger.warn(
        `Full database sync encountered an issue: ${error?.message ?? error}. Falling back to individual model sync...`,
      );
      if (error?.parent) {
        this.logger.warn(`PostgreSQL error detail: ${error.parent.message} (code: ${error.parent.code ?? 'N/A'})`);
      }

      await this.syncModelsIndividually();
      this.logger.log('Fallback model sync completed. Server proceeding to start.');
    }
  }

  private async syncModelsIndividually(): Promise<void> {
    const models = Object.values(this.sequelize.models);
    let successCount = 0;
    for (const model of models) {
      try {
        await model.sync({ force: false, alter: false });
        successCount += 1;
      } catch (err: any) {
        this.logger.warn(
          `Model sync warning for "${model.name}": ${err?.message ?? err}`,
        );
      }
    }
    this.logger.log(
      `Individual model sync finished: ${successCount}/${models.length} models ready.`,
    );
  }

  private async syncWithDuplicateIndexRecovery(): Promise<void> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      try {
        await this.sequelize.sync({
          force: false,
          alter: false,
        });
        return;
      } catch (error: any) {
        if (error?.parent?.code !== '42P07') {
          throw error;
        }

        const indexName = this.getCreatedIndexName(error?.sql);
        if (!indexName) {
          throw error;
        }

        const safeIndexName = indexName.replaceAll('"', '""');
        await this.sequelize.query(
          `DROP INDEX IF EXISTS "${safeIndexName}"`,
        );
        this.logger.warn(
          `Dropped duplicate index "${indexName}" before database sync retry.`,
        );
      }
    }

    throw new Error('Database sync exceeded duplicate index recovery retries');
  }

  private getCreatedIndexName(sql?: string): string | undefined {
    const match = sql?.match(
      /CREATE\s+(?:UNIQUE\s+)?INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?"([^"]+)"/i,
    );
    return match?.[1];
  }
}
