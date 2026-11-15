import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { DatabaseConfig } from 'src/common/types/databaseConfig.type';
import validateConfig from './validate.config';

enum DatabaseDialect {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
  MARIADB = 'mariadb',
  SQLITE = 'sqlite',
  MSSQL = 'mssql',
}

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

class DatabaseEnvironmentVariablesValidator {
  // Required essentials
  @IsString()
  DATABASE_HOST!: string;

  @IsString()
  DATABASE_USERNAME?: string;

  @IsString()
  DATABASE_PASSWORD?: string;

  @IsString()
  DATABASE_NAME?: string;

  // Optional with defaults
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  DATABASE_PORT?: number;

  @IsEnum(DatabaseDialect)
  @IsOptional()
  DATABASE_DIALECT?: DatabaseDialect;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_MIGRATIONS_RUN?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_LOGGING?: boolean;

  @IsEnum(LogLevel)
  @IsOptional()
  DATABASE_LOG_LEVEL?: LogLevel;

  @IsString()
  @IsOptional()
  DATABASE_MIGRATIONS_DIR?: string;

  @IsString()
  @IsOptional()
  DATABASE_ENTITIES_DIR?: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  DATABASE_MAX_CONNECTIONS?: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_AUTO_LOAD_MODELS?: boolean;

  @IsInt()
  @Min(0)
  @Max(60000)
  @IsOptional()
  DATABASE_IDLE_TIMEOUT?: number;

  @IsInt()
  @Min(1000)
  @Max(60000)
  @IsOptional()
  DATABASE_CONNECTION_TIMEOUT?: number;

  @IsString()
  @IsOptional()
  DATABASE_TIMEZONE?: string;

  @IsString()
  @IsOptional()
  DATABASE_SSL_MODE?: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_REJECT_UNAUTHORIZED?: boolean;

  // Define options
  @IsBoolean()
  @IsOptional()
  DATABASE_TIMESTAMPS?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_UNDERSCORED?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_FREEZE_TABLE_NAME?: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_PARANOID?: boolean;

  // ⭐⭐⭐ Sequelize Pool Configuration ⭐⭐⭐
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  DATABASE_POOL_MAX?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  DATABASE_POOL_MIN?: number;

  @IsInt()
  @Min(1000)
  @Max(60000)
  @IsOptional()
  DATABASE_POOL_ACQUIRE?: number;

  @IsInt()
  @Min(1000)
  @Max(60000)
  @IsOptional()
  DATABASE_POOL_IDLE?: number;

  @IsInt()
  @Min(1000)
  @Max(60000)
  @IsOptional()
  DATABASE_POOL_EVICT?: number;
}

export default registerAs<DatabaseConfig>(
  'database',
  () => {
    // Validate environment variables
    validateConfig(
      process.env,
      DatabaseEnvironmentVariablesValidator,
    );

    const dialect =
      (process.env
        .DATABASE_DIALECT as DatabaseDialect) ||
      DatabaseDialect.POSTGRES;

    // Default ports for different dialects
    const getDefaultPort = (
      dialect: DatabaseDialect,
    ): number => {
      switch (dialect) {
        case DatabaseDialect.POSTGRES:
          return 5432;
        case DatabaseDialect.MYSQL:
        case DatabaseDialect.MARIADB:
          return 3306;
        case DatabaseDialect.MSSQL:
          return 1433;
        case DatabaseDialect.SQLITE:
          return 0;
        default:
          return 5432;
      }
    };

    const config: DatabaseConfig = {
      // Required essentials
      dialect,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT
        ? parseInt(process.env.DATABASE_PORT, 10)
        : getDefaultPort(dialect),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,

      // ⭐⭐⭐ Sequelize Connection Pooling ⭐⭐⭐
      pool: {
        max: process.env.DATABASE_POOL_MAX
          ? parseInt(
              process.env.DATABASE_POOL_MAX,
              10,
            )
          : 20, // Default: 20 connections max
        min: process.env.DATABASE_POOL_MIN
          ? parseInt(
              process.env.DATABASE_POOL_MIN,
              10,
            )
          : 2,
        acquire: process.env.DATABASE_POOL_ACQUIRE
          ? parseInt(
              process.env.DATABASE_POOL_ACQUIRE,
              10,
            )
          : 30000, // 30 seconds connection timeout
        idle: process.env.DATABASE_POOL_IDLE
          ? parseInt(
              process.env.DATABASE_POOL_IDLE,
              10,
            )
          : 10000, // Close idle connections after 10s
        evict: process.env.DATABASE_POOL_EVICT
          ? parseInt(
              process.env.DATABASE_POOL_EVICT,
              10,
            )
          : 10000, // Remove idle connections
      },

      sync: {
        enabled: false,
        force: false,
        alter: true,
        logSql: false,
      },
    };

    // Ensure sync is initialized
    config.sync ??= { enabled: false };

    // Sync configuration
    if (
      process.env.DATABASE_SYNCHRONIZE !==
      undefined
    ) {
      config.sync.enabled =
        process.env.DATABASE_SYNCHRONIZE ===
        'true';
    }

    if (process.env.DB_SYNC_FORCE !== undefined) {
      config.sync.force =
        process.env.DB_SYNC_FORCE === 'true';
    }

    if (
      process.env.DB_SYNC_LOG_SQL !== undefined
    ) {
      config.sync.logSql =
        process.env.DB_SYNC_LOG_SQL === 'true';
    }

    // Migration configuration
    if (
      process.env.DATABASE_MIGRATIONS_RUN !==
      undefined
    ) {
      config.migrationsRun =
        process.env.DATABASE_MIGRATIONS_RUN ===
        'true';
    }

    // Logging configuration
    if (
      process.env.DATABASE_LOGGING !== undefined
    ) {
      config.logging =
        process.env.DATABASE_LOGGING === 'true';
    }

    if (process.env.DATABASE_LOG_LEVEL) {
      config.logLevel = process.env
        .DATABASE_LOG_LEVEL as
        | 'error'
        | 'warn'
        | 'info'
        | 'debug';
    }

    // Directory configurations
    if (process.env.DATABASE_MIGRATIONS_DIR) {
      config.migrationsDir =
        process.env.DATABASE_MIGRATIONS_DIR;
    }

    if (process.env.DATABASE_ENTITIES_DIR) {
      config.entitiesDir =
        process.env.DATABASE_ENTITIES_DIR;
    }

    // Connection management (legacy support)
    if (process.env.DATABASE_MAX_CONNECTIONS) {
      config.maxConnections = parseInt(
        process.env.DATABASE_MAX_CONNECTIONS,
        10,
      );
    }

    if (
      process.env.DATABASE_AUTO_LOAD_MODELS !==
      undefined
    ) {
      config.autoLoadModels =
        process.env.DATABASE_AUTO_LOAD_MODELS ===
        'true';
    }

    // Timeout configurations
    if (process.env.DATABASE_IDLE_TIMEOUT) {
      config.idleTimeout = parseInt(
        process.env.DATABASE_IDLE_TIMEOUT,
        10,
      );
    }

    if (process.env.DATABASE_CONNECTION_TIMEOUT) {
      config.connectionTimeout = parseInt(
        process.env.DATABASE_CONNECTION_TIMEOUT,
        10,
      );
    }

    // SSL/TLS configuration
    if (
      process.env.DATABASE_SSL_ENABLED === 'true'
    ) {
      config.ssl = {
        rejectUnauthorized:
          process.env
            .DATABASE_SSL_REJECT_UNAUTHORIZED !==
          'false',
        mode:
          process.env.DATABASE_SSL_MODE ||
          'require',
      };
    }

    // Timezone
    if (process.env.DATABASE_TIMEZONE) {
      config.timezone =
        process.env.DATABASE_TIMEZONE;
    }

    // Sequelize model definition options
    const hasDefineOptions =
      process.env.DATABASE_TIMESTAMPS !==
        undefined ||
      process.env.DATABASE_UNDERSCORED !==
        undefined ||
      process.env.DATABASE_FREEZE_TABLE_NAME !==
        undefined ||
      process.env.DATABASE_PARANOID !== undefined;

    if (hasDefineOptions) {
      config.define = {};

      if (
        process.env.DATABASE_TIMESTAMPS !==
        undefined
      ) {
        config.define.timestamps =
          process.env.DATABASE_TIMESTAMPS ===
          'true';
      }

      if (
        process.env.DATABASE_UNDERSCORED !==
        undefined
      ) {
        config.define.underscored =
          process.env.DATABASE_UNDERSCORED ===
          'true';
      }

      if (
        process.env.DATABASE_FREEZE_TABLE_NAME !==
        undefined
      ) {
        config.define.freezeTableName =
          process.env
            .DATABASE_FREEZE_TABLE_NAME ===
          'true';
      }

      if (
        process.env.DATABASE_PARANOID !==
        undefined
      ) {
        config.define.paranoid =
          process.env.DATABASE_PARANOID ===
          'true';
      }
    }

    return config;
  },
);
