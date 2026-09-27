// src/config/redis.config.ts
import { registerAs } from '@nestjs/config';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { RedisConfig } from '../common/types/redisConfig.type';
import validateConfig from './validate.config';

class RedisEnvironmentVariables {
  @IsString()
  REDIS_URL: string;

  @IsOptional()
  @IsString()
  REDIS_KEY_PREFIX?: string;

  @IsOptional()
  @IsNumber()
  REDIS_RETRY_DELAY?: number;

  @IsOptional()
  @IsBoolean()
  REDIS_ENABLE_READY_CHECK?: boolean;

  @IsOptional()
  @IsNumber()
  REDIS_MAX_RETRIES_PER_REQUEST?: number;

  @IsOptional()
  @IsBoolean()
  REDIS_LAZY_CONNECT?: boolean;

  @IsOptional()
  @IsNumber()
  REDIS_KEEP_ALIVE?: number;

  @IsOptional()
  @IsNumber()
  REDIS_FAMILY?: number;

  @IsOptional()
  @IsNumber()
  REDIS_CONNECT_TIMEOUT?: number;

  @IsOptional()
  @IsNumber()
  REDIS_COMMAND_TIMEOUT?: number;

  @IsOptional()
  @IsNumber()
  REDIS_DB?: number;
}

export default registerAs<RedisConfig>(
  'redis',
  () => {
    validateConfig(
      process.env,
      RedisEnvironmentVariables,
    );

    return {
      url: process.env.REDIS_URL,
      keyPrefix:
        process.env.REDIS_KEY_PREFIX ||
        'realbiz_pro:',
      enableReadyCheck:
        process.env.REDIS_ENABLE_READY_CHECK ===
        'true',
      maxRetriesPerRequest: parseInt(
        process.env
          .REDIS_MAX_RETRIES_PER_REQUEST || '3',
        10,
      ),
      lazyConnect:
        process.env.REDIS_LAZY_CONNECT !==
        'false',
      keepAlive: parseInt(
        process.env.REDIS_KEEP_ALIVE || '30000',
        10,
      ),
      family: parseInt(
        process.env.REDIS_FAMILY || '4',
        10,
      ),
      connectTimeout: parseInt(
        process.env.REDIS_CONNECT_TIMEOUT ||
          '10000',
        10,
      ),
      commandTimeout: parseInt(
        process.env.REDIS_COMMAND_TIMEOUT ||
          '5000',
        10,
      ),
      db: parseInt(
        process.env.REDIS_DB || '0',
        10,
      ),
    };
  },
);
