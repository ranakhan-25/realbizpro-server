'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_personal
      ADD COLUMN IF NOT EXISTS height VARCHAR(100),
      ADD COLUMN IF NOT EXISTS weight VARCHAR(100);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_failed_list
      ADD COLUMN IF NOT EXISTS height VARCHAR(100),
      ADD COLUMN IF NOT EXISTS weight VARCHAR(100);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_personal
      DROP COLUMN IF EXISTS height,
      DROP COLUMN IF EXISTS weight;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee_failed_list
      DROP COLUMN IF EXISTS height,
      DROP COLUMN IF EXISTS weight;
    `);
  },
};
