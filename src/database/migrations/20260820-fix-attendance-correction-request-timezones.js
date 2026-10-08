'use strict';

const TABLE_NAME = 'hrm_attendance_correction_requests';
const TIME_COLUMNS = ['requested_in_time', 'requested_out_time'];

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      for (const column of TIME_COLUMNS) {
        await queryInterface.sequelize.query(
          `ALTER TABLE "${TABLE_NAME}"
           ALTER COLUMN "${column}" TYPE TIMESTAMP WITH TIME ZONE
           USING "${column}" AT TIME ZONE 'UTC'`,
          { transaction },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      for (const column of TIME_COLUMNS) {
        await queryInterface.sequelize.query(
          `ALTER TABLE "${TABLE_NAME}"
           ALTER COLUMN "${column}" TYPE TIMESTAMP WITHOUT TIME ZONE
           USING "${column}" AT TIME ZONE 'UTC'`,
          { transaction },
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
