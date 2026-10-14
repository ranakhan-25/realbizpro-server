module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('pos_operation_summary').catch(() => ({}));
    if (!tableInfo.total_supplier_payment) {
      await queryInterface.addColumn('pos_operation_summary', 'total_supplier_payment', {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pos_operation_summary', 'total_supplier_payment').catch(() => {});
  }
};
