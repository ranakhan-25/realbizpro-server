'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      ADD COLUMN IF NOT EXISTS check_in_location JSONB NULL,
      ADD COLUMN IF NOT EXISTS check_out_location JSONB NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      DROP COLUMN IF EXISTS check_out_location,
      DROP COLUMN IF EXISTS check_in_location;
    `);
  },
};
