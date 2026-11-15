'use strict';

/**
 * Migration: Create Parking Service Tables
 * - cs_parking_slots
 * - cs_parking_assignments
 * - cs_parking_external_rentals
 *
 * Scope: Customer Service - Building Services | Parking Service Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      // 1. Table: cs_parking_slots
      if (!tables.includes('cs_parking_slots')) {
        await queryInterface.createTable(
          'cs_parking_slots',
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
              allowNull: true,
              references: {
                model: 'sys_organizations',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            project_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            slot_number: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            floor_zone: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Ground Floor',
            },
            allowed_vehicle_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Car',
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'FREE',
            },
            notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
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
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_parking_slots',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_prk_slots_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_parking_slots',
          ['project_id', 'slot_number'],
          {
            name: 'idx_cs_prk_slots_proj_slot',
            unique: true,
            where: {
              deleted_at: null,
            },
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_parking_slots',
          ['project_id', 'status'],
          {
            name: 'idx_cs_prk_slots_proj_status',
            transaction,
          },
        );
      }

      // 2. Table: cs_parking_assignments
      if (!tables.includes('cs_parking_assignments')) {
        await queryInterface.createTable(
          'cs_parking_assignments',
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
              allowNull: true,
              references: {
                model: 'sys_organizations',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            project_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            slot_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                model: 'cs_parking_slots',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            flat_number: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            resident_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            resident_phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            vehicle_number: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            vehicle_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Car',
            },
            rfid_tag: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            start_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            end_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            is_active: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
            },
            release_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            release_reason: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
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
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_parking_assignments',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_prk_assign_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_parking_assignments',
          ['slot_id', 'is_active'],
          {
            name: 'idx_cs_prk_assign_slot_active',
            transaction,
          },
        );
      }

      // 3. Table: cs_parking_external_rentals
      if (!tables.includes('cs_parking_external_rentals')) {
        await queryInterface.createTable(
          'cs_parking_external_rentals',
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
              allowNull: true,
              references: {
                model: 'sys_organizations',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            project_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            slot_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                model: 'cs_parking_slots',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            renter_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            renter_phone: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            renter_nid: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            vehicle_number: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            vehicle_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Car',
            },
            monthly_rent: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            deposit_amount: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            start_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            end_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            payment_status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'DUE',
            },
            amount_collected: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            last_payment_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'ACTIVE',
            },
            notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
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
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_parking_external_rentals',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_prk_ext_rent_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_parking_external_rentals',
          ['slot_id', 'status'],
          {
            name: 'idx_cs_prk_ext_rent_slot_status',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_parking_external_rentals',
          ['project_id', 'payment_status'],
          {
            name: 'idx_cs_prk_ext_rent_pay_status',
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_parking_external_rentals', { transaction });
      await queryInterface.dropTable('cs_parking_assignments', { transaction });
      await queryInterface.dropTable('cs_parking_slots', { transaction });
    });
  },
};
