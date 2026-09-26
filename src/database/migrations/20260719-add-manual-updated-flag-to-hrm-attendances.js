'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      ADD COLUMN IF NOT EXISTS is_manual_updated BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      DROP COLUMN IF EXISTS is_manual_updated;
    `);
  },
};
