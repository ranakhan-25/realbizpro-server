module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pr_material_issues', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      issue_no: { type: Sequelize.STRING(60), allowNull: false, unique: true },
      grn_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'pr_grn', key: 'uuid' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      purpose: { type: Sequelize.TEXT, allowNull: false },
      issued_by_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'sys_users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      added_by_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'sys_users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      total_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'issued' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('pr_material_issue_items', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      material_issue_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'pr_material_issues', key: 'uuid' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      grn_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'pr_grn_items', key: 'uuid' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      item_code: { type: Sequelize.STRING(100), allowNull: false },
      item_name: { type: Sequelize.STRING(255), allowNull: false },
      details: { type: Sequelize.TEXT, allowNull: true },
      unit: { type: Sequelize.STRING(255), allowNull: true },
      quantity: { type: Sequelize.DECIMAL(15, 3), allowNull: false },
      rate: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.addIndex('pr_material_issue_items', ['material_issue_id']);
    await queryInterface.addIndex('pr_material_issue_items', ['grn_item_id']);
    await queryInterface.addIndex('pr_material_issues', ['grn_id']);
    await queryInterface.addIndex('pr_material_issues', ['date']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('pr_material_issue_items');
    await queryInterface.dropTable('pr_material_issues');
  },
};
