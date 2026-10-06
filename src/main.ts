import './register-path-aliases';

import {
  INestApplication,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

import { AppModule } from './app.module';
import { setupGlobalConfig } from './common/setup/global.setup';
import { securitySetup } from './common/setup/security.setup';
import { setupSwagger } from './common/setup/swagger.setup';
import { getErrorMessage } from './common/utils/error.util';
import { BullBoardService } from './modules/engine/queue-dashboard/bull-board.service';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(
    AppModule,
    {
      logger: [
        'error',
        'warn',
        'log',
        'debug',
        'verbose',
      ],
    },
  );

  const configService = app.get(ConfigService);

  const nodeEnv =
    configService.get<string>('app.nodeEnv', {
      infer: true,
    }) ?? 'development';

  const port =
    configService.get<number>('app.port', {
      infer: true,
    }) ?? 5000;

  const backendDomain =
    configService.get<string>(
      'app.backendDomain',
      {
        infer: true,
      },
    ) ?? 'http://localhost';

  const apiPrefix =
    configService.get<string>('app.apiPrefix', {
      infer: true,
    }) ?? 'api';

  setupGlobalConfig(app);

  securitySetup(app);

  setupSwagger(app);

  /**
   * Queue Dashboard
   */
  if (nodeEnv !== 'production') {
    app.get(BullBoardService).setup(app);
  }

  /**
   * Verify Database
   */
  await verifyDatabase(app);

  /**
   * Graceful Shutdown
   */
  registerShutdownHooks(app);

  /**
   * Start Server
   */
  await app.listen(port, '0.0.0.0');

  const baseUrl = `${backendDomain}:${port}`;

  logger.log(`🚀 Server running at ${baseUrl}`);

  if (nodeEnv !== 'production') {
    logger.log(
      `📚 Swagger : ${baseUrl}/realbiz_pro/${apiPrefix}/docs`,
    );

    logger.log(
      `📊 Bull Board : ${baseUrl}/admin/queues`,
    );

    logger.log(
      `🏥 Health : ${baseUrl}/realbizpro/${apiPrefix}/v1/health`,
    );

    logger.log(`🌍 Environment : ${nodeEnv}`);
  }
}

async function verifyDatabase(
  app: INestApplication,
): Promise<void> {
  const sequelize = app.get<Sequelize>(
    getConnectionToken(),
  );

  try {
    await sequelize.authenticate();

    logger.log(
      `📦 Loaded Models : ${Object.keys(
        sequelize.models,
      ).join(', ')}`,
    );

    logger.log(
      '🎉 Database connected successfully.',
    );
  } catch (error) {
    logger.error(
      '❌ Database connection failed.',
      getErrorMessage(error),
    );

    process.exit(1);
  }
}

function registerShutdownHooks(
  app: INestApplication,
): void {
  const shutdown = async (
    signal: NodeJS.Signals,
  ): Promise<void> => {
    logger.warn(
      `${signal} received. Shutting down...`,
    );

    try {
      await app.close();

      logger.log(
        'Application closed successfully.',
      );

      process.exit(0);
    } catch (error) {
      logger.error(
        'Shutdown failed.',
        getErrorMessage(error),
      );

      process.exit(1);
    }
  };

  const registerSignal = (
    signal: NodeJS.Signals,
  ): void => {
    process.on(signal, () => {
      void shutdown(signal);
    });
  };

  registerSignal('SIGINT');
  registerSignal('SIGTERM');

  process.on(
    'uncaughtException',
    (error: Error): void => {
      logger.error(
        'Uncaught Exception',
        getErrorMessage(error),
      );

      process.exit(1);
    },
  );

  process.on(
    'unhandledRejection',
    (reason: unknown): void => {
      logger.error(
        'Unhandled Rejection',
        getErrorMessage(reason),
      );

      process.exit(1);
    },
  );
}

void bootstrap().catch((error: unknown) => {
  logger.error(
    'Application failed to start.',
    getErrorMessage(error),
  );

  process.exit(1);
});
