'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_personal
      ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(255);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_personal
      DROP COLUMN IF EXISTS spouse_name;
    `);
  },
};
