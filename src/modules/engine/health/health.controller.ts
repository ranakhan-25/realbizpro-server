import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as os from 'os';
import { Sequelize } from 'sequelize-typescript';
import { Public } from '../../../common/decorators/public.decorator';
import { RedisService } from '../../../database/redis.service';

interface SimpleHealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
  database: 'connected' | 'disconnected';
  redis: 'connected' | 'disconnected';
  uptime: number;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Check application health',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
  })
  @ApiResponse({
    status: 503,
    description: 'Health check failed',
  })
  async getHealth(): Promise<SimpleHealthResponse> {
    try {
      // Check database
      let databaseStatus:
        | 'connected'
        | 'disconnected' = 'disconnected';
      try {
        await this.sequelize.authenticate();
        databaseStatus = 'connected';
      } catch {
        databaseStatus = 'disconnected';
      }

      // Check Redis
      let redisStatus:
        | 'connected'
        | 'disconnected' = 'disconnected';
      try {
        await this.redisService.ping();
        redisStatus = 'connected';
      } catch {
        redisStatus = 'disconnected';
      }

      const response: SimpleHealthResponse = {
        status:
          databaseStatus === 'connected' &&
          redisStatus === 'connected'
            ? 'ok'
            : 'error',
        timestamp: new Date().toISOString(),
        database: databaseStatus,
        redis: redisStatus,
        uptime: Math.round(process.uptime()),
      };

      if (response.status === 'error') {
        throw new HttpException(
          response,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: 'error',
          timestamp: new Date().toISOString(),
          database: 'unknown',
          redis: 'unknown',
          uptime: Math.round(process.uptime()),
          error: 'Health check failed',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Get('ping')
  @Public()
  @ApiOperation({ summary: 'Simple ping' })
  ping() {
    return {
      status: 'ok',
      message: 'pong',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('system')
  @Public()
  @ApiOperation({
    summary:
      'Get system health in human-readable format',
  })
  async getSystemHealth() {
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    return {
      memory: {
        heap: this.formatBytes(
          memoryUsage.heapUsed,
        ),
        heapTotal: this.formatBytes(
          memoryUsage.heapTotal,
        ),
        rss: this.formatBytes(memoryUsage.rss),
        external: this.formatBytes(
          memoryUsage.external,
        ),
        totalMemory:
          this.formatBytes(totalMemory),
        freeMemory: this.formatBytes(freeMemory),
      },

      timestamp: new Date().toISOString(),
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(
      Math.log(bytes) / Math.log(k),
    );
    return (
      parseFloat(
        (bytes / Math.pow(k, i)).toFixed(2),
      ) +
      ' ' +
      sizes[i]
    );
  }
}
