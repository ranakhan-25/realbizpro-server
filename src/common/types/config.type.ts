import { AppConfig } from './appConfig.type';
import { AuthConfig } from './authConfig.type';
import { DatabaseConfig } from './databaseConfig.type';
import { MailConfig } from './mailConfig.type';
import { RedisConfig } from './redisConfig.type';
import { SecurityConfig } from './securityConfig.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  mail: MailConfig;
  security: SecurityConfig;
  redis: RedisConfig;
};
