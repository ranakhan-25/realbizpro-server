const tables = [
  'inv_categories',
  'inv_sub_categories',
  'inv_brands',
  'inv_units',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const table of tables) {
      const columns = await queryInterface.describeTable(table);
      if (!columns.org_id) {
        await queryInterface.addColumn(table, 'org_id', {
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
    }
  },

  down: async (queryInterface) => {
    for (const table of [...tables].reverse()) {
      const columns = await queryInterface.describeTable(table);
      if (columns.org_id) {
        await queryInterface.removeColumn(table, 'org_id');
      }
    }
  },
};
