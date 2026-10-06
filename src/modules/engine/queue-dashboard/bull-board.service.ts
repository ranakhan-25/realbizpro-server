import {
  Injectable,
  INestApplication,
} from '@nestjs/common';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

@Injectable()
export class BullBoardService {
  setup(app: INestApplication) {
    try {
      const queueToken =
        getQueueToken('attendance');
      const container = (app as any).container;
      let hasQueue = false;

      if (
        container &&
        typeof container.getModules === 'function'
      ) {
        const modules = container.getModules();
        for (const moduleRef of modules.values()) {
          if (
            moduleRef.providers &&
            moduleRef.providers.has(queueToken)
          ) {
            hasQueue = true;
            break;
          }
        }
      }

      if (!hasQueue) {
        return;
      }

      const attendanceQueue = app.get<Queue>(
        queueToken,
        { strict: false },
      );

      if (attendanceQueue) {
        const serverAdapter =
          new ExpressAdapter();
        serverAdapter.setBasePath(
          '/admin/queues',
        );

        createBullBoard({
          queues: [
            new BullAdapter(attendanceQueue),
          ],
          serverAdapter,
        });

        app.use(
          '/admin/queues',
          serverAdapter.getRouter(),
        );
      }
    } catch (error) {
      console.warn(
        '⚠️ BullBoard setup skipped:',
        error instanceof Error
          ? error.message
          : error,
      );
    }
  }
}
