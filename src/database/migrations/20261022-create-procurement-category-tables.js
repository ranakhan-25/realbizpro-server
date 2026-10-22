'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((table) =>
      typeof table === 'string' ? table : table.tableName,
    );

    if (!tableNames.includes('pr_category')) {
      await queryInterface.createTable('pr_category', {
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
        uid: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        code: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        addedById: {
          type: Sequelize.STRING,
          allowNull: true,
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

    if (!tableNames.includes('pr_category_account_mapping')) {
      await queryInterface.createTable(
        'pr_category_account_mapping',
        {
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
          categoryId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'pr_category',
              key: 'uuid',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          inventoryAccountType: {
            type: Sequelize.ENUM('Create New', 'Existing'),
            allowNull: false,
            defaultValue: 'Create New',
          },
          inventoryAccountGroupCode: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          existingInventoryAccountId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          consumptionAccountType: {
            type: Sequelize.ENUM('Create New', 'Existing'),
            allowNull: false,
            defaultValue: 'Create New',
          },
          consumptionAccountGroupCode: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          existingConsumptionAccountId: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          createdBy: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          updatedBy: {
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
        },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pr_category_account_mapping');
    await queryInterface.dropTable('pr_category');
  },
};
