require('dotenv').config();

module.exports = {
  development: {
    username:
      process.env.DATABASE_USERNAME || 'postgres',
    password:
      process.env.DATABASE_PASSWORD || 'postgres',
    database:
      process.env.DATABASE_NAME || 'easy_hrm',
    host:
      process.env.DATABASE_HOST || 'localhost',
    port:
      parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeders',
    migrationStorageTableName: 'sequelize_meta',
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port:
      parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    ssl: process.env.DB_SSL === 'true',
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeders',
    migrationStorageTableName: 'sequelize_meta',
  },
  test: {
    username:
      process.env.DB_USERNAME || 'postgres',
    password:
      process.env.DATABASE_PASSWORD || 'postgres',
    database:
      process.env.DB_DATABASE_TEST ||
      'easy_hrm_test',
    host:
      process.env.DATABASE_HOST || 'localhost',
    port:
      parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    seederStorageTableName: 'sequelize_seeders',
    migrationStorageTableName: 'sequelize_meta',
  },
};
