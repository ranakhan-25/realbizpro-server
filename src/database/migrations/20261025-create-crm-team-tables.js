'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableNames = new Set(tables.map((table) =>
      typeof table === 'string' ? table : table.tableName,
    ));

    if (!tableNames.has('crm_teams')) {
      await queryInterface.createTable('crm_teams', {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
        name: { type: Sequelize.STRING(150), allowNull: false },
        leader_id: { type: Sequelize.STRING, allowNull: true },
        department: { type: Sequelize.STRING(150), allowNull: true },
        is_active: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
        created_by: { type: Sequelize.STRING, allowNull: true },
        updated_by: { type: Sequelize.STRING, allowNull: true },
        deleted_by: { type: Sequelize.STRING, allowNull: true },
        project_id: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      });
      await queryInterface.addIndex('crm_teams', ['name']);
      await queryInterface.addIndex('crm_teams', ['leader_id']);
    }

    if (!tableNames.has('crm_team_members')) {
      await queryInterface.createTable('crm_team_members', {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
        uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
        team_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'crm_teams', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
        user_id: { type: Sequelize.STRING, allowNull: false },
        role_in_team: { type: Sequelize.STRING(100), allowNull: true },
        is_active: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
        created_by: { type: Sequelize.STRING, allowNull: true },
        updated_by: { type: Sequelize.STRING, allowNull: true },
        deleted_by: { type: Sequelize.STRING, allowNull: true },
        project_id: { type: Sequelize.STRING, allowNull: true },
        created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
        deleted_at: { type: Sequelize.DATE, allowNull: true },
      });
      await queryInterface.addIndex('crm_team_members', ['team_id']);
      await queryInterface.addIndex('crm_team_members', ['user_id']);
    }
  },

  // This migration may skip existing CRM tables; keep rollback non-destructive.
  async down() {},
};
