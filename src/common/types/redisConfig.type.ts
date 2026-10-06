export type RedisConfig = {
  url: string;
  keyPrefix?: string;
  enableReadyCheck?: boolean;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
  keepAlive?: number;
  family?: number;
  connectTimeout?: number;
  commandTimeout?: number;
  db?: number;
};

export type RedisModuleConfig = {
  redis: RedisConfig;
};
