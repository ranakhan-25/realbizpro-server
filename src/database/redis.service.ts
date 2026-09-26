import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisConfig } from '../common/types/redisConfig.type';

@Injectable()
export class RedisService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    RedisService.name,
  );
  private client: Redis;
  private subscriber: Redis;
  private publisher: Redis;

  constructor(
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    const redisConfig =
      this.configService.get<RedisConfig>(
        'redis',
      );

    try {
      // Main client for general operations
      this.client = new Redis(redisConfig.url, {
        keyPrefix: redisConfig.keyPrefix,
        enableReadyCheck:
          redisConfig.enableReadyCheck,
        maxRetriesPerRequest:
          redisConfig.maxRetriesPerRequest,
        lazyConnect: redisConfig.lazyConnect,
        keepAlive: redisConfig.keepAlive,
        family: redisConfig.family,
        connectTimeout:
          redisConfig.connectTimeout,
        commandTimeout:
          redisConfig.commandTimeout,
        db: redisConfig.db,
      });

      // Separate clients for pub/sub operations
      this.subscriber = new Redis(
        redisConfig.url,
        {
          keyPrefix: redisConfig.keyPrefix,
          lazyConnect: true,
          db: redisConfig.db,
        },
      );

      this.publisher = new Redis(
        redisConfig.url,
        {
          keyPrefix: redisConfig.keyPrefix,
          lazyConnect: true,
          db: redisConfig.db,
        },
      );

      // Event listeners for connection monitoring
      this.client.on('connect', () => {
        this.logger.log('Redis client connected');
      });

      this.client.on('ready', () => {
        this.logger.log('Redis client ready');
      });

      this.client.on('error', (error) => {
        this.logger.error(
          'Redis client error:',
          error,
        );
      });

      this.client.on('close', () => {
        this.logger.warn(
          'Redis client connection closed',
        );
      });

      this.client.on('reconnecting', () => {
        this.logger.log(
          'Redis client reconnecting...',
        );
      });

      // Connect if not lazy connecting
      if (!redisConfig.lazyConnect) {
        await this.client.connect();
        await this.subscriber.connect();
        await this.publisher.connect();
      }

      this.logger.log(
        'Redis service initialized successfully',
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize Redis service:',
        error,
      );
      throw error;
    }
  }

  private async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
      }
      if (this.subscriber) {
        await this.subscriber.quit();
      }
      if (this.publisher) {
        await this.publisher.quit();
      }
      this.logger.log(
        'Redis connections closed successfully',
      );
    } catch (error) {
      this.logger.error(
        'Error closing Redis connections:',
        error,
      );
    }
  }

  // Basic operations
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(
    key: string,
    value: string,
    ttlSeconds?: number,
  ): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.setex(
        key,
        ttlSeconds,
        value,
      );
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return this.client.exists(key);
  }

  async expire(
    key: string,
    seconds: number,
  ): Promise<number> {
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  // JSON operations
  async setJson(
    key: string,
    value: any,
    ttlSeconds?: number,
  ): Promise<'OK'> {
    const jsonString = JSON.stringify(value);
    return this.set(key, jsonString, ttlSeconds);
  }

  async getJson<T = any>(
    key: string,
  ): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(
        `Failed to parse JSON for key ${key}:`,
        error,
      );
      return null;
    }
  }

  // Hash operations
  async hset(
    key: string,
    field: string,
    value: string,
  ): Promise<number> {
    return this.client.hset(key, field, value);
  }

  async hget(
    key: string,
    field: string,
  ): Promise<string | null> {
    return this.client.hget(key, field);
  }

  async hgetall(
    key: string,
  ): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async hdel(
    key: string,
    field: string,
  ): Promise<number> {
    return this.client.hdel(key, field);
  }

  // List operations
  async lpush(
    key: string,
    ...values: string[]
  ): Promise<number> {
    return this.client.lpush(key, ...values);
  }

  async rpush(
    key: string,
    ...values: string[]
  ): Promise<number> {
    return this.client.rpush(key, ...values);
  }

  async lpop(
    key: string,
  ): Promise<string | null> {
    return this.client.lpop(key);
  }

  async rpop(
    key: string,
  ): Promise<string | null> {
    return this.client.rpop(key);
  }

  async llen(key: string): Promise<number> {
    return this.client.llen(key);
  }

  // Set operations
  async sadd(
    key: string,
    ...members: string[]
  ): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async srem(
    key: string,
    ...members: string[]
  ): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async sismember(
    key: string,
    member: string,
  ): Promise<number> {
    return this.client.sismember(key, member);
  }

  // Pub/Sub operations
  async publish(
    channel: string,
    message: string,
  ): Promise<number> {
    return this.publisher.publish(
      channel,
      message,
    );
  }

  async publishJson(
    channel: string,
    data: any,
  ): Promise<number> {
    return this.publisher.publish(
      channel,
      JSON.stringify(data),
    );
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void,
  ): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on(
      'message',
      (receivedChannel, message) => {
        if (receivedChannel === channel) {
          callback(message);
        }
      },
    );
  }

  async unsubscribe(
    channel: string,
  ): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  // Pattern matching
  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }
  async scan(
    cursor: string = '0', // Redis cursors are strings
    pattern?: string,
    count?: number,
  ): Promise<[string, string[]]> {
    if (pattern && count) {
      return this.client.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        count,
      );
    } else if (pattern) {
      return this.client.scan(
        cursor,
        'MATCH',
        pattern,
      );
    } else if (count) {
      return this.client.scan(
        cursor,
        'COUNT',
        count,
      );
    } else {
      return this.client.scan(cursor);
    }
  }

  // Transaction support
  multi() {
    return this.client.multi();
  }

  // Pipeline support
  pipeline() {
    return this.client.pipeline();
  }

  // Health check
  async ping(): Promise<string> {
    return this.client.ping();
  }

  async info(section?: string): Promise<string> {
    return section
      ? this.client.info(section)
      : this.client.info();
  }

  // Direct client access for advanced operations
  getClient(): Redis {
    return this.client;
  }

  getSubscriber(): Redis {
    return this.subscriber;
  }

  getPublisher(): Redis {
    return this.publisher;
  }
  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }
}
