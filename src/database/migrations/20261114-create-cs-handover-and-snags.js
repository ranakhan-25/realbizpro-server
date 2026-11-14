'use strict';

/**
 * Migration: Create and align Customer Service Handover & Snags
 * Tables:
 *  - cs_booking_handovers (align columns, drop restrictive checks, make booking_id nullable)
 *  - cs_handover_snags (create new table for defect/snag tracking)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Align cs_booking_handovers table
      const tables = await queryInterface.showAllTables();
      if (tables.includes('cs_booking_handovers')) {
        // Drop old check constraint if exists
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE "cs_booking_handovers" DROP CONSTRAINT IF EXISTS "chk_cs_booking_handovers_status";`,
            { transaction }
          );
        } catch (e) {
          // Ignore if constraint does not exist
        }

        // Drop unique constraint on booking_id if exists so multiple records can be null or updated
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE "cs_booking_handovers" DROP CONSTRAINT IF EXISTS "cs_booking_handovers_booking_id_key";`,
            { transaction }
          );
        } catch (e) {}

        // Make booking_id nullable
        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE "cs_booking_handovers" ALTER COLUMN "booking_id" DROP NOT NULL;`,
            { transaction }
          );
        } catch (e) {}

        const [existingCols] = await queryInterface.sequelize.query(
          `SELECT column_name FROM information_schema.columns WHERE table_name = 'cs_booking_handovers';`,
          { transaction }
        );
        const colNames = existingCols.map((c) => c.column_name);

        const colsToAdd = [
          { name: 'handover_code', type: Sequelize.STRING(50) },
          { name: 'customer_name', type: Sequelize.STRING(255) },
          { name: 'unit_name', type: Sequelize.STRING(100) },
          { name: 'project_name', type: Sequelize.STRING(255) },
          { name: 'target_handover_date', type: Sequelize.DATEONLY },
          { name: 'readiness_percentage', type: Sequelize.INTEGER, defaultValue: 0 },
          { name: 'joint_inspection_done', type: Sequelize.BOOLEAN, defaultValue: false },
          { name: 'possession_cert_issued', type: Sequelize.BOOLEAN, defaultValue: false },
          { name: 'keys_delivered_count', type: Sequelize.INTEGER, defaultValue: 0 },
          { name: 'electric_meter_reading', type: Sequelize.STRING(100) },
          { name: 'gas_meter_reading', type: Sequelize.STRING(100) },
          { name: 'water_meter_reading', type: Sequelize.STRING(100) },
          { name: 'signed_by_customer', type: Sequelize.BOOLEAN, defaultValue: false },
        ];

        for (const col of colsToAdd) {
          if (!colNames.includes(col.name)) {
            await queryInterface.addColumn(
              'cs_booking_handovers',
              col.name,
              {
                type: col.type,
                allowNull: true,
                defaultValue: col.defaultValue !== undefined ? col.defaultValue : null,
              },
              { transaction }
            );
          }
        }
      }

      // 2. Create cs_handover_snags table if not exists
      if (!tables.includes('cs_handover_snags')) {
        await queryInterface.createTable(
          'cs_handover_snags',
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
            organization_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                model: 'sys_organizations',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            project_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            handover_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_booking_handovers',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
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
            snag_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            unit_name: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            defect_location: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            description: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            severity: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Minor',
            },
            assigned_contractor: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            target_rectification_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Reported',
            },
            rectified_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
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
          { transaction }
        );

        // Indexes for cs_handover_snags
        await queryInterface.addIndex(
          'cs_handover_snags',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_snags_org_proj',
            transaction,
          }
        );
        await queryInterface.addIndex('cs_handover_snags', ['status'], {
          name: 'idx_cs_snags_status',
          transaction,
        });
        await queryInterface.addIndex('cs_handover_snags', ['handover_id'], {
          name: 'idx_cs_snags_handover_id',
          transaction,
        });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_handover_snags').catch(() => {});
  },
};
