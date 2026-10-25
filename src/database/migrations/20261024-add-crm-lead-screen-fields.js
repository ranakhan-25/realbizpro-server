'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const add = async (table, column, definition) => {
      const description = await queryInterface.describeTable(table);
      if (!description[column]) await queryInterface.addColumn(table, column, definition);
    };
    await add('crm_leads', 'lead_date', { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal('CURRENT_DATE') });
    await add('crm_leads', 'credit_officer_id', { type: Sequelize.STRING, allowNull: true });
    await add('crm_leads', 'birth_date', { type: Sequelize.DATEONLY, allowNull: true });
    await add('crm_leads', 'anniversary_date', { type: Sequelize.DATEONLY, allowNull: true });
    await add('crm_leads', 'area_id', { type: Sequelize.BIGINT, allowNull: true, references: { model: 'crm_areas', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' });
    await add('crm_leads', 'price_range_id', { type: Sequelize.BIGINT, allowNull: true, references: { model: 'crm_price_ranges', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' });
    await add('crm_leads', 'lead_type', { type: Sequelize.STRING(100), allowNull: true });
    await add('crm_leads', 'initial_remark', { type: Sequelize.TEXT, allowNull: true });
    await add('crm_leads', 'query', { type: Sequelize.TEXT, allowNull: true });
    await add('crm_lead_call_assigns', 'assigned_user_type', { type: Sequelize.STRING(50), allowNull: true });
    await add('crm_lead_transfer_logs', 'transfer_type', { type: Sequelize.STRING(50), allowNull: true });
    await add('crm_lead_transfer_logs', 'followup', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await add('crm_lead_transfer_logs', 'manual_set', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await add('crm_lead_transfer_logs', 'assigned_quantity', { type: Sequelize.INTEGER, allowNull: true });
  },

  async down(queryInterface) {
    for (const [table, columns] of Object.entries({
      crm_leads: ['lead_date', 'credit_officer_id', 'birth_date', 'anniversary_date', 'area_id', 'price_range_id', 'lead_type', 'initial_remark', 'query'],
      crm_lead_call_assigns: ['assigned_user_type'],
      crm_lead_transfer_logs: ['transfer_type', 'followup', 'manual_set', 'assigned_quantity'],
    })) {
      const description = await queryInterface.describeTable(table);
      for (const column of columns) if (description[column]) await queryInterface.removeColumn(table, column);
    }
  },
};
