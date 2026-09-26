'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      ADD COLUMN IF NOT EXISTS punch_history JSONB NULL,
      ADD COLUMN IF NOT EXISTS in_location JSONB NULL,
      ADD COLUMN IF NOT EXISTS out_location JSONB NULL,
      ADD COLUMN IF NOT EXISTS late_in_duration VARCHAR(20) NULL,
      ADD COLUMN IF NOT EXISTS early_out_duration VARCHAR(20) NULL,
      ADD COLUMN IF NOT EXISTS overtime_duration VARCHAR(20) NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      DROP COLUMN IF EXISTS overtime_duration,
      DROP COLUMN IF EXISTS early_out_duration,
      DROP COLUMN IF EXISTS late_in_duration,
      DROP COLUMN IF EXISTS out_location,
      DROP COLUMN IF EXISTS in_location,
      DROP COLUMN IF EXISTS punch_history;
    `);
  },
};
