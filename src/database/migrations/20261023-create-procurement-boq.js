module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pr_procurement_boq', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      project_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'project', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
      company_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'sys_company', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      responsible_user_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'sys_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      added_by_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'sys_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING(255), allowNull: false },
      responsible_person: { type: Sequelize.STRING(255), allowNull: true },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      due_date: { type: Sequelize.DATEONLY, allowNull: false },
      boq_type: { type: Sequelize.STRING(100), allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'), allowNull: false, defaultValue: 'pending' },
      material_cost: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      equipment_misc_cost: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      labour_cost: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      subcontract_cost: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      subtotal: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      margin_overhead: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      grand_total: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      remarks: { type: Sequelize.TEXT, allowNull: true },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.createTable('pr_procurement_boq_items', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      boq_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_procurement_boq', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      item_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_item_entry', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      category_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_category', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      unit_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'pr_unit', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      item_name: { type: Sequelize.STRING(255), allowNull: false },
      item_code: { type: Sequelize.STRING(100), allowNull: true },
      unit: { type: Sequelize.STRING(255), allowNull: false },
      quantity: { type: Sequelize.DECIMAL(15, 3), allowNull: false, defaultValue: 0 },
      rate: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      cost_type: { type: Sequelize.ENUM('material', 'equipment_misc', 'labour', 'subcontract'), allowNull: false, defaultValue: 'material' },
      remarks: { type: Sequelize.TEXT, allowNull: true },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.createTable('pr_procurement_boq_notes', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      boq_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'pr_procurement_boq', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      note: { type: Sequelize.TEXT, allowNull: false },
      sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('pr_procurement_boq', ['project_id']);
    await queryInterface.addIndex('pr_procurement_boq', ['company_id']);
    await queryInterface.addIndex('pr_procurement_boq', ['date']);
    await queryInterface.addIndex('pr_procurement_boq_items', ['boq_id']);
    await queryInterface.addIndex('pr_procurement_boq_notes', ['boq_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pr_procurement_boq_notes');
    await queryInterface.dropTable('pr_procurement_boq_items');
    await queryInterface.dropTable('pr_procurement_boq');
  },
};
