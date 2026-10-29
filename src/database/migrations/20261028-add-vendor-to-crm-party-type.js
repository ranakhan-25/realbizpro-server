'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('crm_parties', 'party_type', {
      type: Sequelize.ENUM('Customer', 'Investor', 'Vendor', 'Other'),
      allowNull: false,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('crm_parties', 'party_type', {
      type: Sequelize.ENUM('Customer', 'Investor', 'Other'),
      allowNull: false,
    });
  },
};
