'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('crm_leads');
    if (columns.offer_id) return;

    await queryInterface.addColumn('crm_leads', 'offer_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable('crm_leads');
    if (columns.offer_id) await queryInterface.removeColumn('crm_leads', 'offer_id');
  },
};
