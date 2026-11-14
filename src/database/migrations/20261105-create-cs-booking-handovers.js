'use strict';

/**
 * Migration: Create cs_booking_handovers table
 * Scope: Customer Service - Bookings & Property Portfolio Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('cs_booking_handovers')) {
        await queryInterface.createTable(
          'cs_booking_handovers',
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
            booking_id: {
              type: Sequelize.UUID,
              allowNull: false,
              unique: true,
              references: {
                model: 'pr_flat_land_bookings',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
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
            handover_status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Under Construction',
            },
            possession_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            dlp_start_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            dlp_expiry_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            key_register_no: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            possession_cert_no: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            total_snags_reported: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            total_snags_resolved: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            remarks: {
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

        // Add CHECK constraint on handover_status
        await queryInterface.sequelize.query(
          `ALTER TABLE "cs_booking_handovers"
           ADD CONSTRAINT "chk_cs_booking_handovers_status"
           CHECK ("handover_status" IN ('Under Construction', 'Ready for Snagging', 'DLP Active', 'Handed Over'));`,
          { transaction },
        );

        // Composite index on handover_status and deleted_at
        await queryInterface.addIndex(
          'cs_booking_handovers',
          ['handover_status', 'deleted_at'],
          {
            name: 'idx_cs_handover_status_deleted',
            transaction,
          },
        );

        // Index on deleted_at
        await queryInterface.addIndex(
          'cs_booking_handovers',
          ['deleted_at'],
          {
            name: 'idx_cs_handover_deleted_at',
            transaction,
          },
        );
      }
    });

    // Try enabling pg_trgm extension and adding trigram index if possible
    try {
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
    } catch {
      // Extension creation may require superuser privileges, continue gracefully
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_booking_handovers').catch(() => {});
  },
};

