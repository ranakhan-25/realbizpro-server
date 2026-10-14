'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_planning
      ADD COLUMN IF NOT EXISTS min_working_hour TIME NULL,
      ADD COLUMN IF NOT EXISTS max_working_hour TIME NULL,
      ADD COLUMN IF NOT EXISTS absent_rule_type VARCHAR(20) NULL,
      ADD COLUMN IF NOT EXISTS absent_hour TIME NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_planning
      DROP COLUMN IF EXISTS absent_hour,
      DROP COLUMN IF EXISTS absent_rule_type,
      DROP COLUMN IF EXISTS max_working_hour,
      DROP COLUMN IF EXISTS min_working_hour;
    `);
  },
};
