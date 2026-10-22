'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const names = tables.map((table) => typeof table === 'string' ? table : table.tableName);
    if (!names.includes('pr_item_entry')) {
      await queryInterface.createTable('pr_item_entry', {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
        item_code: { type: Sequelize.STRING(100), allowNull: false, unique: true },
        name: { type: Sequelize.STRING(255), allowNull: false },
        purchase_price: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        sale_price: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
        category_id: {
          type: Sequelize.UUID, allowNull: false,
          references: { model: 'pr_category', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
        },
        sub_category_id: {
          type: Sequelize.UUID, allowNull: true,
          references: { model: 'pr_sub_category', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL',
        },
        brand_id: {
          type: Sequelize.UUID, allowNull: true,
          references: { model: 'pr_brand', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL',
        },
        unit_id: {
          type: Sequelize.UUID, allowNull: false,
          references: { model: 'pr_unit', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
        },
        createdBy: { type: Sequelize.STRING, allowNull: true },
        updatedBy: { type: Sequelize.STRING, allowNull: true },
        deletedBy: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pr_item_entry');
  },
};
