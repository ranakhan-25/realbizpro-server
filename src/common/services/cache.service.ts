// src/common/services/cache.service.ts
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { RedisService } from '../../database/redis.service';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(
    CacheService.name,
  );
  private readonly defaultTTL = 3600; // 1 hour
  private readonly defaultPrefix = 'cache';

  constructor(
    private readonly redisService: RedisService,
  ) {}

  private buildKey(
    key: string,
    prefix?: string,
  ): string {
    const cachePrefix =
      prefix || this.defaultPrefix;
    return `${cachePrefix}:${key}`;
  }

  async get<T = any>(
    key: string,
    options: CacheOptions = {},
  ): Promise<T | null> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      return await this.redisService.getJson<T>(
        cacheKey,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get cache for key ${key}:`,
        error,
      );
      return null;
    }
  }

  async set<T = any>(
    key: string,
    value: T,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      const ttl = options.ttl || this.defaultTTL;
      await this.redisService.setJson(
        cacheKey,
        value,
        ttl,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to set cache for key ${key}:`,
        error,
      );
      return false;
    }
  }

  async del(
    key: string,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      const result =
        await this.redisService.del(cacheKey);
      return result > 0;
    } catch (error) {
      this.logger.error(
        `Failed to delete cache for key ${key}:`,
        error,
      );
      return false;
    }
  }

  async exists(
    key: string,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      const result =
        await this.redisService.exists(cacheKey);
      return result > 0;
    } catch (error) {
      this.logger.error(
        `Failed to check cache existence for key ${key}:`,
        error,
      );
      return false;
    }
  }

  async expire(
    key: string,
    seconds: number,
    options: CacheOptions = {},
  ): Promise<boolean> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      const result =
        await this.redisService.expire(
          cacheKey,
          seconds,
        );
      return result > 0;
    } catch (error) {
      this.logger.error(
        `Failed to set expiry for cache key ${key}:`,
        error,
      );
      return false;
    }
  }

  async ttl(
    key: string,
    options: CacheOptions = {},
  ): Promise<number> {
    try {
      const cacheKey = this.buildKey(
        key,
        options.prefix,
      );
      return await this.redisService.ttl(
        cacheKey,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get TTL for cache key ${key}:`,
        error,
      );
      return -2; // Key doesn't exist
    }
  }

  async invalidatePattern(
    pattern: string,
    options: CacheOptions = {},
  ): Promise<number> {
    try {
      const cachePattern = this.buildKey(
        pattern,
        options.prefix,
      );
      const keys =
        await this.redisService.keys(
          cachePattern,
        );

      if (keys.length === 0) {
        return 0;
      }

      const pipeline =
        this.redisService.pipeline();
      keys.forEach((key) => pipeline.del(key));
      const results = await pipeline.exec();

      return results?.length || 0;
    } catch (error) {
      this.logger.error(
        `Failed to invalidate cache pattern ${pattern}:`,
        error,
      );
      return 0;
    }
  }

  // Utility method for cache-aside pattern
  async remember<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const cached = await this.get<T>(
      key,
      options,
    );
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, options);
    return value;
  }

  // Utility method for refreshing cache
  async refresh<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const value = await factory();
    await this.set(key, value, options);
    return value;
  }
}
