'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((table) =>
      typeof table === 'string' ? table : table.tableName,
    );

    if (!tableNames.includes('pr_brand')) {
      await queryInterface.createTable('pr_brand', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
        },
        code: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        createdBy: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        updatedBy: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        deletedBy: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pr_brand');
  },
};
