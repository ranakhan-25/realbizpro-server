'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      let existingTables = await queryInterface.showAllTables();
      if (!existingTables.includes('share_users')) {
        await queryInterface.createTable('share_users', {
          id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
          uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
          name: { type: Sequelize.STRING(150), allowNull: false },
          email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
          phone: { type: Sequelize.STRING(20), allowNull: true, unique: true },
          password_hash: { type: Sequelize.STRING(255), allowNull: false },
          role: { type: Sequelize.ENUM('project-owner', 'super-admin'), allowNull: false, defaultValue: 'project-owner' },
          status: { type: Sequelize.ENUM('active', 'blocked', 'pending'), allowNull: false, defaultValue: 'pending' },
          email_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          email_verification_token_hash: { type: Sequelize.STRING(255), allowNull: true },
          password_reset_token_hash: { type: Sequelize.STRING(255), allowNull: true },
          password_reset_expires_at: { type: Sequelize.DATE, allowNull: true },
          refresh_token_hash: { type: Sequelize.TEXT, allowNull: true },
          last_login_at: { type: Sequelize.DATE, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      existingTables = await queryInterface.showAllTables();
      if (!existingTables.includes('share_project_categories')) {
        await queryInterface.createTable('share_project_categories', {
          id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
          uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
          code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
          name: { type: Sequelize.STRING(150), allowNull: false },
          is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      existingTables = await queryInterface.showAllTables();
      if (!existingTables.includes('share_projects')) {
        await queryInterface.createTable('share_projects', {
          id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
          uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
          owner_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'share_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
          category_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'share_project_categories', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
          name: { type: Sequelize.STRING(200), allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: false },
          location: { type: Sequelize.STRING(255), allowNull: true },
          total_investment_amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          total_shares: { type: Sequelize.INTEGER, allowNull: false },
          price_per_share: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          minimum_investment: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          expected_annual_return: { type: Sequelize.DECIMAL(8, 2), allowNull: true },
          start_date: { type: Sequelize.DATEONLY, allowNull: true },
          end_date: { type: Sequelize.DATEONLY, allowNull: true },
          thumbnail_url: { type: Sequelize.STRING(255), allowNull: true },
          status: { type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected', 'published', 'unpublished'), allowNull: false, defaultValue: 'draft' },
          rejection_reason: { type: Sequelize.TEXT, allowNull: true },
          submitted_at: { type: Sequelize.DATE, allowNull: true },
          published_at: { type: Sequelize.DATE, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      const childTables = [
        ['share_project_images', {
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
          url: { type: Sequelize.STRING(255), allowNull: false }, alt_text: { type: Sequelize.STRING(255), allowNull: true }, sort_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        }],
        ['share_project_documents', {
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
          title: { type: Sequelize.STRING(255), allowNull: false }, url: { type: Sequelize.STRING(255), allowNull: false }, file_type: { type: Sequelize.STRING(50), allowNull: true },
        }],
        ['share_project_submissions', {
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
          type: { type: Sequelize.STRING(30), allowNull: false }, note: { type: Sequelize.TEXT, allowNull: true }, submitted_by: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'share_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
        }],
        ['share_project_reviews', {
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
          reviewed_by: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'share_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
          decision: { type: Sequelize.ENUM('approved', 'rejected'), allowNull: false }, reason: { type: Sequelize.TEXT, allowNull: true },
        }],
        ['share_project_status_history', {
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
          from_status: { type: Sequelize.STRING(30), allowNull: false }, to_status: { type: Sequelize.STRING(30), allowNull: false },
          changed_by: { type: Sequelize.BIGINT, allowNull: true }, note: { type: Sequelize.TEXT, allowNull: true },
        }],
      ];

      const currentTables = await queryInterface.showAllTables();
      for (const [tableName, columns] of childTables) {
        if (!currentTables.includes(tableName)) {
          await queryInterface.createTable(tableName, {
            id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
            uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
            ...columns,
            created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
            deleted_at: { type: Sequelize.DATE, allowNull: true },
          }, { transaction });
        }
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const table of ['share_project_status_history', 'share_project_reviews', 'share_project_submissions', 'share_project_documents', 'share_project_images', 'share_projects', 'share_project_categories', 'share_users']) {
        await queryInterface.dropTable(table, { transaction }).catch(() => {});
      }
    });
  },
};
