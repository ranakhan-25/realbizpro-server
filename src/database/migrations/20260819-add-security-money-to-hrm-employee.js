'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'hrm_employee',
      'security_money',
      {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'hrm_employee',
      'security_money',
    );
  },
};
