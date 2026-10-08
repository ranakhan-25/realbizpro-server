'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'hrm_employee',
      'pre_joining_reporting_date',
      {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'hrm_employee',
      'pre_joining_reporting_date',
    );
  },
};
