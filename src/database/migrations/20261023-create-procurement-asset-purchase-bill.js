module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('pr_asset_grn', 'already_billed', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await queryInterface.createTable('pr_asset_purchase_bill', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true }, uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      date: { type: Sequelize.DATEONLY, allowNull: false }, code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      project_type_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'project_types', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      project_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'project', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      supplier_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'supplier_accounts', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      subtotal: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }, discount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }, grand_total: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }, paid: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 }, due: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      note: { type: Sequelize.TEXT, allowNull: true }, attachment: { type: Sequelize.TEXT, allowNull: true }, added_by_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'sys_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' }, approval_layer: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'pending' },
      created_by: { type: Sequelize.STRING, allowNull: true }, updated_by: { type: Sequelize.STRING, allowNull: true }, deleted_by: { type: Sequelize.STRING, allowNull: true }, created_at: { type: Sequelize.DATE, allowNull: false }, updated_at: { type: Sequelize.DATE, allowNull: false }, deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.createTable('pr_asset_purchase_bill_grns', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true }, uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      purchase_bill_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_asset_purchase_bill', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      grn_id: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'pr_asset_grn', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      created_at: { type: Sequelize.DATE, allowNull: false }, updated_at: { type: Sequelize.DATE, allowNull: false }, deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('pr_asset_purchase_bill', ['date']); await queryInterface.addIndex('pr_asset_purchase_bill', ['supplier_id']); await queryInterface.addIndex('pr_asset_purchase_bill', ['project_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pr_asset_purchase_bill_grns'); await queryInterface.dropTable('pr_asset_purchase_bill'); await queryInterface.removeColumn('pr_asset_grn', 'already_billed');
  },
};
