'use strict';

/**
 * Migration: Create cs_change_requests table
 * Scope: Customer Service - Ownership Transfer, Resale & Change Requests Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('cs_change_requests')) {
        await queryInterface.createTable(
          'cs_change_requests',
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
            request_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            request_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            customer_profile_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_customer_profiles',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            customer_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            unit: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            project: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            booking_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                model: 'pr_flat_land_bookings',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            reason: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            transfer_fee: {
              type: Sequelize.DECIMAL(14, 2),
              allowNull: false,
              defaultValue: 0,
            },
            new_buyer_name: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            new_buyer_nid: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            new_buyer_phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Legal Verification',
            },
            applied_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_DATE'),
            },
            approval_notes: {
              type: Sequelize.TEXT,
              allowNull: true,
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

        // Add CHECK constraint on status
        await queryInterface.sequelize.query(
          `ALTER TABLE "cs_change_requests"
           ADD CONSTRAINT "chk_cs_cr_status"
           CHECK ("status" IN ('Draft', 'Legal Verification', 'HOD Approval', 'Accounts Clearance', 'Completed', 'Rejected'));`,
          { transaction },
        );

        // Add CHECK constraint on request_type
        await queryInterface.sequelize.query(
          `ALTER TABLE "cs_change_requests"
           ADD CONSTRAINT "chk_cs_cr_type"
           CHECK ("request_type" IN ('Ownership Transfer', 'Resale', 'Cancellation & Refund', 'Unit Swap'));`,
          { transaction },
        );

        // Composite index on status and deleted_at
        await queryInterface.addIndex(
          'cs_change_requests',
          ['status', 'deleted_at'],
          {
            name: 'idx_cs_cr_status_deleted',
            transaction,
          },
        );

        // Composite index on request_type and deleted_at
        await queryInterface.addIndex(
          'cs_change_requests',
          ['request_type', 'deleted_at'],
          {
            name: 'idx_cs_cr_type_deleted',
            transaction,
          },
        );

        // Index on deleted_at
        await queryInterface.addIndex(
          'cs_change_requests',
          ['deleted_at'],
          {
            name: 'idx_cs_cr_deleted_at',
            transaction,
          },
        );

        // Index on customer_profile_id
        await queryInterface.addIndex(
          'cs_change_requests',
          ['customer_profile_id'],
          {
            name: 'idx_cs_cr_customer_profile_id',
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_change_requests').catch(() => {});
  },
};

