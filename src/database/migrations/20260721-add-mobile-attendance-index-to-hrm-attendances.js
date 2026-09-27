'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_hrm_attendances_employee_date_active
      ON hrm_attendances (hrm_employee_id, date)
      WHERE deleted_at IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS idx_hrm_attendances_employee_date_active;
    `);
  },
};
