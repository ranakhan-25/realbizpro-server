'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('crm_employee_kpis')) return;
    await queryInterface.createTable('crm_employee_kpis', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      type: { type: Sequelize.ENUM('INDIVIDUAL', 'TEAM'), allowNull: false },
      name: { type: Sequelize.STRING(150), allowNull: false },
      user_id: { type: Sequelize.UUID, allowNull: true, references: { model: 'sys_users', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      team_id: { type: Sequelize.BIGINT, allowNull: true, references: { model: 'crm_teams', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      work_type_1: { type: Sequelize.STRING(100), allowNull: false },
      target_1: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      work_type_2: { type: Sequelize.STRING(100), allowNull: false },
      target_2: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      work_type_3: { type: Sequelize.STRING(100), allowNull: false },
      target_3: { type: Sequelize.DECIMAL(15, 2), allowNull: false },
      from_date: { type: Sequelize.DATEONLY, allowNull: false },
      to_date: { type: Sequelize.DATEONLY, allowNull: false },
      status: { type: Sequelize.ENUM('ACTIVE', 'INACTIVE'), allowNull: false, defaultValue: 'ACTIVE' },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },
  async down(queryInterface) { await queryInterface.dropTable('crm_employee_kpis'); },
};
