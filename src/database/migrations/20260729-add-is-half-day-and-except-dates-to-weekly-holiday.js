'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add is_half_day column to hrm_weekly_holiday
    const tableInfoHwh = await queryInterface.describeTable('hrm_weekly_holiday').catch(() => ({}));
    if (!tableInfoHwh.is_half_day) {
      await queryInterface.addColumn('hrm_weekly_holiday', 'is_half_day', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    // 2. Add is_half_day column to hrm_weekly_holiday_days
    const tableInfoDays = await queryInterface.describeTable('hrm_weekly_holiday_days').catch(() => ({}));
    if (!tableInfoDays.is_half_day) {
      await queryInterface.addColumn('hrm_weekly_holiday_days', 'is_half_day', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
    }

    // 3. Create hrm_weekly_holiday_except_dates table
    const tableExists = await queryInterface.showAllTables().then(tables => tables.includes('hrm_weekly_holiday_except_dates'));
    if (!tableExists) {
      await queryInterface.createTable('hrm_weekly_holiday_except_dates', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        hwh_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'hrm_weekly_holiday',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        except_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hrm_weekly_holiday_except_dates').catch(() => {});
    await queryInterface.removeColumn('hrm_weekly_holiday_days', 'is_half_day').catch(() => {});
    await queryInterface.removeColumn('hrm_weekly_holiday', 'is_half_day').catch(() => {});
  },
};
