'use strict';

/**
 * Migration: Create cs_customer_profiles table
 * Scope: Customer Service - Customer 360 Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('cs_customer_profiles')) {
        await queryInterface.createTable(
          'cs_customer_profiles',
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
              defaultValue: Sequelize.UUIDV4,
            },
            customer_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            customer_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            phone_number: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            nid_number: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            tin_number: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            address: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            nominee_name: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            nominee_relation: {
              type: Sequelize.STRING(50),
              allowNull: true,
              defaultValue: 'Spouse',
            },
            nominee_nid: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            customer_status: {
              type: Sequelize.ENUM('active', 'vip', 'disputed', 'closed'),
              allowNull: false,
              defaultValue: 'active',
            },
            joined_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_DATE'),
            },
            party_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'crm_parties',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            customer_account_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'customer_account',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            created_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
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
          { transaction },
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_customer_profiles').catch(() => {});
  },
};

