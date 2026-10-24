module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pr_subcontract_packages', {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      name: { type: Sequelize.STRING(150), allowNull: false, unique: true },
      unit: { type: Sequelize.STRING(80), allowNull: false },
      status: { type: Sequelize.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addIndex('pr_subcontract_packages', ['status']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pr_subcontract_packages');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_pr_subcontract_packages_status";');
  },
};
