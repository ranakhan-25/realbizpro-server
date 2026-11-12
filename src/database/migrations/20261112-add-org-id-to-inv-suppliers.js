'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('inv_suppliers');
    if (!columns.org_id) {
      await queryInterface.addColumn('inv_suppliers', 'org_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'sys_organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      await queryInterface.addIndex('inv_suppliers', ['org_id'], {
        name: 'inv_suppliers_org_id_idx',
      });
    }
  },

  down: async (queryInterface) => {
    const columns = await queryInterface.describeTable('inv_suppliers');
    if (columns.org_id) {
      await queryInterface.removeIndex('inv_suppliers', 'inv_suppliers_org_id_idx');
      await queryInterface.removeColumn('inv_suppliers', 'org_id');
    }
  },
};
