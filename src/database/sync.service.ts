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

  async onApplicationBootstrap() {
    await this.initializeDatabase();
  }
  private async initializeDatabase() {
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
    await this.sequelize.sync({
      force: false,
      alter: false,
    });
    this.logger.log('Database synchronized');
  }
}
