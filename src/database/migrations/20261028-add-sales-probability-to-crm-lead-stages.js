'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [columns] = await queryInterface.sequelize.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'crm_lead_stages'
        AND column_name = 'sales_probability'
    `);
    if (!columns.length) {
      await queryInterface.addColumn('crm_lead_stages', 'sales_probability', {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('crm_lead_stages', 'sales_probability');
  },
};
