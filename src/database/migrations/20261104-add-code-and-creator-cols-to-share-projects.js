'use strict';

/** Add `code`, `creator_name`, `creator_email`, `creator_phone`, `company_name`
 *  columns to `share_projects` table and `code` to `share_project_investments`.
 *  These columns are defined in the Sequelize model but were missing in the DB.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('share_projects');

    if (!tableInfo.code) {
      await queryInterface.addColumn('share_projects', 'code', {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      });
    }
    if (!tableInfo.creator_name) {
      await queryInterface.addColumn('share_projects', 'creator_name', {
        type: Sequelize.STRING(150),
        allowNull: true,
      });
    }
    if (!tableInfo.creator_email) {
      await queryInterface.addColumn('share_projects', 'creator_email', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!tableInfo.creator_phone) {
      await queryInterface.addColumn('share_projects', 'creator_phone', {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }
    if (!tableInfo.company_name) {
      await queryInterface.addColumn('share_projects', 'company_name', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }

    // Also add `code` to share_project_investments if missing
    const investInfo = await queryInterface.describeTable('share_project_investments');
    if (!investInfo.code) {
      await queryInterface.addColumn('share_project_investments', 'code', {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      });
    }
    if (!investInfo.investor_name) {
      await queryInterface.addColumn('share_project_investments', 'investor_name', {
        type: Sequelize.STRING(150),
        allowNull: true,
      });
    }
    if (!investInfo.investor_email) {
      await queryInterface.addColumn('share_project_investments', 'investor_email', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
    if (!investInfo.investor_phone) {
      await queryInterface.addColumn('share_project_investments', 'investor_phone', {
        type: Sequelize.STRING(20),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    for (const col of ['code', 'creator_name', 'creator_email', 'creator_phone', 'company_name']) {
      try { await queryInterface.removeColumn('share_projects', col); } catch (_) {}
    }
    for (const col of ['code', 'investor_name', 'investor_email', 'investor_phone']) {
      try { await queryInterface.removeColumn('share_project_investments', col); } catch (_) {}
    }
  },
};

