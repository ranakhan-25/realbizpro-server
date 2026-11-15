'use strict';

/**
 * Migration: Create Service Charge & Costing and Building Committee Tables
 * - cs_service_charge_rates
 * - cs_flat_service_charges
 * - cs_building_incomes
 * - cs_building_expenses
 * - cs_committee_members
 * - cs_committee_decisions
 *
 * Scope: Customer Service - Building Services | Service Charge & Building Committee Modules
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      // 1. Table: cs_service_charge_rates (Rate per project)
      if (!tables.includes('cs_service_charge_rates')) {
        await queryInterface.createTable(
          'cs_service_charge_rates',
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
            rate_basis: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'PER_SQFT', // 'PER_SQFT' | 'FIXED_PER_FLAT'
            },
            rate_per_sqft: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 5.0,
            },
            fixed_rate_per_flat: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 5000.0,
            },
            due_day_of_month: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 10,
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
          'cs_service_charge_rates',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_sc_rates_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex('cs_service_charge_rates', ['project_id'], {
          name: 'idx_cs_sc_rates_proj',
          unique: true,
          where: { deleted_at: null },
          transaction,
        });
      }

      // 2. Table: cs_flat_service_charges (Monthly charges per flat)
      if (!tables.includes('cs_flat_service_charges')) {
        await queryInterface.createTable(
          'cs_flat_service_charges',
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
            flat_size_sqft: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 1500.0,
            },
            billing_month: {
              type: Sequelize.STRING(20), // 'YYYY-MM'
              allowNull: false,
            },
            rate_applied: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            total_amount: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            paid_amount: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            payment_status: {
              type: Sequelize.STRING(50), // 'PAID' | 'PARTIAL' | 'DUE' | 'OVERDUE'
              allowNull: false,
              defaultValue: 'DUE',
            },
            due_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            payment_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            payment_method: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            reference_number: {
              type: Sequelize.STRING(100),
              allowNull: true,
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
          'cs_flat_service_charges',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_flat_sc_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_flat_service_charges',
          ['project_id', 'flat_number', 'billing_month'],
          {
            name: 'idx_cs_flat_sc_proj_flat_month',
            unique: true,
            where: { deleted_at: null },
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_flat_service_charges',
          ['project_id', 'billing_month', 'payment_status'],
          {
            name: 'idx_cs_flat_sc_proj_month_status',
            transaction,
          },
        );
      }

      // 3. Table: cs_building_incomes (Extra revenue: hall, rooftop, pool, mosque, parking, etc.)
      if (!tables.includes('cs_building_incomes')) {
        await queryInterface.createTable(
          'cs_building_incomes',
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
            income_type: {
              type: Sequelize.STRING(50), // 'COMMUNITY_HALL' | 'ROOFTOP_RENT' | 'PARKING' | 'SWIMMING_POOL' | 'MOSQUE' | 'OTHER'
              allowNull: false,
            },
            title: {
              type: Sequelize.STRING(200),
              allowNull: false,
            },
            amount: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            income_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            received_from: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            source_reference: {
              type: Sequelize.STRING(100),
              allowNull: true,
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
          'cs_building_incomes',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_bld_inc_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_building_incomes',
          ['project_id', 'income_type', 'income_date'],
          {
            name: 'idx_cs_bld_inc_proj_type_date',
            transaction,
          },
        );
      }

      // 4. Table: cs_building_expenses (Expenses: security, lift, utilities, cleaning, maintenance, etc.)
      if (!tables.includes('cs_building_expenses')) {
        await queryInterface.createTable(
          'cs_building_expenses',
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
            expense_type: {
              type: Sequelize.STRING(50), // 'SECURITY' | 'LIFT' | 'UTILITIES' | 'CLEANING' | 'MAINTENANCE' | 'OTHER'
              allowNull: false,
            },
            title: {
              type: Sequelize.STRING(200),
              allowNull: false,
            },
            vendor_name: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            amount: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            expense_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            invoice_reference: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            payment_status: {
              type: Sequelize.STRING(50), // 'PAID' | 'PENDING'
              allowNull: false,
              defaultValue: 'PAID',
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
          'cs_building_expenses',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_bld_exp_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_building_expenses',
          ['project_id', 'expense_type', 'expense_date'],
          {
            name: 'idx_cs_bld_exp_proj_type_date',
            transaction,
          },
        );
      }

      // 5. Table: cs_committee_members (Building Committee Roster)
      if (!tables.includes('cs_committee_members')) {
        await queryInterface.createTable(
          'cs_committee_members',
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
            member_type: {
              type: Sequelize.STRING(50), // 'DEVELOPER_REP' | 'FLAT_OWNER'
              allowNull: false,
              defaultValue: 'FLAT_OWNER',
            },
            flat_number: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            designation: {
              type: Sequelize.STRING(100), // 'President' | 'Secretary' | 'Treasurer' | 'Member' | 'Advisor'
              allowNull: false,
              defaultValue: 'Member',
            },
            responsibility: {
              type: Sequelize.STRING(200),
              allowNull: true,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            term_start: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            term_end: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50), // 'ACTIVE' | 'TERM_EXPIRED' | 'RESIGNED'
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
          'cs_committee_members',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_comm_mem_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_committee_members',
          ['project_id', 'status'],
          {
            name: 'idx_cs_comm_mem_proj_status',
            transaction,
          },
        );
      }

      // 6. Table: cs_committee_decisions (Meeting Minutes & Resolutions)
      if (!tables.includes('cs_committee_decisions')) {
        await queryInterface.createTable(
          'cs_committee_decisions',
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
            title: {
              type: Sequelize.STRING(200),
              allowNull: false,
            },
            meeting_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            agenda_category: {
              type: Sequelize.STRING(100), // 'Service Charge' | 'Security & Access' | 'Maintenance' | 'General Body'
              allowNull: false,
              defaultValue: 'General Body',
            },
            resolution_notes: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            status: {
              type: Sequelize.STRING(50), // 'APPROVED' | 'IN_PROGRESS' | 'IMPLEMENTED'
              allowNull: false,
              defaultValue: 'APPROVED',
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
          'cs_committee_decisions',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_comm_dec_org_proj',
            transaction,
          },
        );
        await queryInterface.addIndex(
          'cs_committee_decisions',
          ['project_id', 'meeting_date'],
          {
            name: 'idx_cs_comm_dec_proj_date',
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_committee_decisions', { transaction });
      await queryInterface.dropTable('cs_committee_members', { transaction });
      await queryInterface.dropTable('cs_building_expenses', { transaction });
      await queryInterface.dropTable('cs_building_incomes', { transaction });
      await queryInterface.dropTable('cs_flat_service_charges', { transaction });
      await queryInterface.dropTable('cs_service_charge_rates', { transaction });
    });
  },
};

