module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pr_asset_purchase_order', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      reference: { type: Sequelize.STRING(100), allowNull: true },
      company_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'sys_company', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      supplier_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'supplier_accounts', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      project_type_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'project_types', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      project_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'project', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      title_of_work_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'categories', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      task_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_task', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      site_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'sites', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      category_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_asset_category', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      requisition_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_asset_requisition', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      subtotal: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      grand_total: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      attachment: { type: Sequelize.TEXT, allowNull: true },
      added_by_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'sys_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      approval_layer: { type: Sequelize.ENUM('pending', 'all_approvals_completed', 'rasel_hosain', 'admin'), allowNull: false, defaultValue: 'pending' },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'), allowNull: false, defaultValue: 'pending' },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.createTable('pr_asset_purchase_order_items', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      purchase_order_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_asset_purchase_order', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      item_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_asset_item_entry', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      unit_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_unit', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      item_code: { type: Sequelize.STRING(100), allowNull: false },
      item_name: { type: Sequelize.STRING(255), allowNull: false },
      details: { type: Sequelize.TEXT, allowNull: true },
      unit: { type: Sequelize.STRING(255), allowNull: true },
      quantity: { type: Sequelize.DECIMAL(15, 3), allowNull: false, defaultValue: 0 },
      rate: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('pr_asset_purchase_order', ['date']);
    await queryInterface.addIndex('pr_asset_purchase_order', ['supplier_id']);
    await queryInterface.addIndex('pr_asset_purchase_order', ['project_id']);
    await queryInterface.addIndex('pr_asset_purchase_order_items', ['purchase_order_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pr_asset_purchase_order_items');
    await queryInterface.dropTable('pr_asset_purchase_order');
  },
};
