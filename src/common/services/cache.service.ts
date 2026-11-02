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

  // L1 In-Memory High-Speed Cache
  private readonly l1Cache = new Map<string, { value: any; expiresAt: number }>();

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
    const cacheKey = this.buildKey(
      key,
      options.prefix,
    );

    // 1. Check L1 in-memory cache first (0.001 ms)
    const l1Entry = this.l1Cache.get(cacheKey);
    if (l1Entry) {
      if (Date.now() < l1Entry.expiresAt) {
        return l1Entry.value as T;
      }
      this.l1Cache.delete(cacheKey);
    }

    // 2. Fall back to L2 Redis
    try {
      const redisVal = await this.redisService.getJson<T>(
        cacheKey,
      );
      if (redisVal !== null && redisVal !== undefined) {
        const l1Ttl = Math.min(options.ttl || this.defaultTTL, 60);
        this.l1Cache.set(cacheKey, {
          value: redisVal,
          expiresAt: Date.now() + l1Ttl * 1000,
        });
        return redisVal;
      }
      return null;
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
    const cacheKey = this.buildKey(
      key,
      options.prefix,
    );
    const ttl = options.ttl || this.defaultTTL;

    // 1. Write to L1 in-memory cache immediately
    this.l1Cache.set(cacheKey, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });

    // 2. Write to L2 Redis
    try {
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
    const cacheKey = this.buildKey(
      key,
      options.prefix,
    );

    // 1. Delete from L1 in-memory
    this.l1Cache.delete(cacheKey);

    // 2. Delete from L2 Redis
    try {
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

      // Invalidate in L1 memory
      const regexPattern = new RegExp(
        '^' + cachePattern.replace(/\*/g, '.*') + '$',
      );
      for (const k of this.l1Cache.keys()) {
        if (regexPattern.test(k)) {
          this.l1Cache.delete(k);
        }
      }

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
