'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_bonus_setting
      ADD COLUMN IF NOT EXISTS office_ids BIGINT[] NULL DEFAULT ARRAY[]::BIGINT[];
    `);

    await queryInterface.sequelize.query(`
      UPDATE hrm_attendance_bonus_setting
      SET office_ids = ARRAY[office_id]::BIGINT[]
      WHERE office_id IS NOT NULL
        AND (
          office_ids IS NULL
          OR cardinality(office_ids) = 0
        );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendance_bonus_setting
      DROP COLUMN IF EXISTS office_ids;
    `);
  },
};
