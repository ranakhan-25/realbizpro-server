'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_device_data
      ADD COLUMN IF NOT EXISTS attendance_source_type VARCHAR(20) NOT NULL DEFAULT 'DEVICE',
      ADD COLUMN IF NOT EXISTS latitude VARCHAR(30) NULL,
      ADD COLUMN IF NOT EXISTS longitude VARCHAR(30) NULL,
      ADD COLUMN IF NOT EXISTS location_name VARCHAR(255) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS pos_warehouse
      ADD COLUMN IF NOT EXISTS latitude VARCHAR(30) NULL,
      ADD COLUMN IF NOT EXISTS longitude VARCHAR(30) NULL,
      ADD COLUMN IF NOT EXISTS location_name VARCHAR(255) NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS pos_warehouse
      DROP COLUMN IF EXISTS location_name,
      DROP COLUMN IF EXISTS longitude,
      DROP COLUMN IF EXISTS latitude;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_device_data
      DROP COLUMN IF EXISTS location_name,
      DROP COLUMN IF EXISTS longitude,
      DROP COLUMN IF EXISTS latitude,
      DROP COLUMN IF EXISTS attendance_source_type;
    `);
  },
};
