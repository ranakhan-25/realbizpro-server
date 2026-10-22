'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const names = tables.map((table) => typeof table === 'string' ? table : table.tableName);
    if (!names.includes('pr_asset_category')) {
      await queryInterface.createTable('pr_asset_category', {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
        type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'Asset' },
        code: { type: Sequelize.STRING(100), allowNull: false, unique: true },
        name: { type: Sequelize.STRING(255), allowNull: false },
        createdBy: { type: Sequelize.STRING, allowNull: true },
        updatedBy: { type: Sequelize.STRING, allowNull: true },
        deletedBy: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      });
    }
  },

  async down(queryInterface) { await queryInterface.dropTable('pr_asset_category'); },
};
