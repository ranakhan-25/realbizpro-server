'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('crm_campaigns');
    if (!columns.lead_source_id) {
      await queryInterface.addColumn('crm_campaigns', 'lead_source_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'crm_lead_sources', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
    if (!columns.form_id) {
      await queryInterface.addColumn('crm_campaigns', 'form_id', {
        type: Sequelize.STRING(150),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const columns = await queryInterface.describeTable('crm_campaigns');
    if (columns.form_id) await queryInterface.removeColumn('crm_campaigns', 'form_id');
    if (columns.lead_source_id) await queryInterface.removeColumn('crm_campaigns', 'lead_source_id');
  },
};
