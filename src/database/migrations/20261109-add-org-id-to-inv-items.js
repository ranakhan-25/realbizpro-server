module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('inv_items');

    if (!columns.org_id) {
      await queryInterface.addColumn('inv_items', 'org_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'sys_organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable('inv_items');
    if (columns.org_id) {
      await queryInterface.removeColumn('inv_items', 'org_id');
    }
  },
};
