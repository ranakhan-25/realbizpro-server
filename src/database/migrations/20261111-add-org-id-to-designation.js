'use strict';

/** Add `org_id` column and index to `designation` table to match `Designation` model. */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('designation');
    if (!tableInfo.org_id) {
      await queryInterface.addColumn('designation', 'org_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'sys_organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      await queryInterface.addIndex('designation', ['org_id'], {
        name: 'Designation_org_id_idx',
      });
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeIndex('designation', 'Designation_org_id_idx');
    } catch (_) {}
    try {
      await queryInterface.removeColumn('designation', 'org_id');
    } catch (_) {}
  },
};
