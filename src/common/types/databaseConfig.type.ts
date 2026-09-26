export interface DatabaseSyncOptions {
  enabled: boolean;
  force?: boolean;
  alter?: boolean;
  logSql?: boolean;
}

export interface DatabasePoolOptions {
  max: number;
  min: number;
  acquire: number;
  idle: number;
  evict: number;
}

export type DatabaseConfig = {
  // Essential - Required
  dialect:
    | 'postgres'
    | 'mysql'
    | 'mariadb'
    | 'sqlite'
    | 'mssql';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;

  // ⭐⭐⭐ ADDED: Sequelize Connection Pooling ⭐⭐⭐
  pool?: DatabasePoolOptions;

  // Optional - with sensible defaults
  sync?: DatabaseSyncOptions;
  dropSchema?: boolean;
  migrationsRun?: boolean;
  logging?: boolean;
  logLevel?: 'error' | 'warn' | 'info' | 'debug';
  migrationsDir?: string;
  entitiesDir?: string;
  maxConnections?: number;
  autoLoadModels?: boolean;
  idleTimeout?: number;
  connectionTimeout?: number;
  ssl?:
    | false
    | {
        rejectUnauthorized: boolean;
        mode: string;
      };
  timezone?: string;
  define?: {
    timestamps?: boolean;
    underscored?: boolean;
    freezeTableName?: boolean;
    paranoid?: boolean;
  };
};
