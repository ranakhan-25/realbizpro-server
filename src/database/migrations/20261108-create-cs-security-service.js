'use strict';

/**
 * Migration: Create Security Service Tables
 * - cs_security_companies
 * - cs_security_guards
 * - cs_security_rosters
 * - cs_security_visitor_logs
 *
 * Scope: Customer Service - Building Services | Security Service Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      // 1. Table: cs_security_companies
      if (!tables.includes('cs_security_companies')) {
        await queryInterface.createTable(
          'cs_security_companies',
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
              allowNull: true,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            name: {
              type: Sequelize.STRING(200),
              allowNull: false,
            },
            contact_person: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            email: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            contract_start: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            contract_end: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            monthly_cost: {
              type: Sequelize.DECIMAL(14, 2),
              allowNull: false,
              defaultValue: 0.00,
            },
            liability_note: {
              type: Sequelize.TEXT,
              allowNull: false,
              defaultValue: '',
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'ACTIVE', // ACTIVE, EXPIRING_SOON, EXPIRED, TERMINATED
            },
            created_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_security_companies',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_sec_companies_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_security_companies',
          ['contract_end'],
          {
            name: 'idx_cs_sec_companies_contract_end',
            transaction,
          },
        );
      }

      // 2. Table: cs_security_guards
      if (!tables.includes('cs_security_guards')) {
        await queryInterface.createTable(
          'cs_security_guards',
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
              allowNull: true,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            national_id: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            source: {
              type: Sequelize.STRING(50),
              allowNull: false, // 'IN_HOUSE', 'COMPANY'
            },
            company_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_security_companies',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            badge_number: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'ACTIVE', // ACTIVE, ON_LEAVE, INACTIVE, TERMINATED
            },
            joined_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            emergency_contact: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_security_guards',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_sec_guards_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_security_guards',
          ['company_id'],
          {
            name: 'idx_cs_sec_guards_company',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_security_guards',
          ['source'],
          {
            name: 'idx_cs_sec_guards_source',
            transaction,
          },
        );
      }

      // 3. Table: cs_security_rosters
      if (!tables.includes('cs_security_rosters')) {
        await queryInterface.createTable(
          'cs_security_rosters',
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
            guard_id: {
              type: Sequelize.BIGINT,
              allowNull: false,
              references: {
                model: 'cs_security_guards',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE',
            },
            duty_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            shift_name: {
              type: Sequelize.STRING(50),
              allowNull: false, // Morning, Evening, Night, Custom
            },
            shift_start: {
              type: Sequelize.TIME,
              allowNull: false, // e.g. 06:00:00
            },
            shift_end: {
              type: Sequelize.TIME,
              allowNull: false, // e.g. 14:00:00
            },
            post_location: {
              type: Sequelize.STRING(150),
              allowNull: false, // Main Gate, Basement B1, Tower Lobby, etc.
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'SCHEDULED', // SCHEDULED, ON_DUTY, COMPLETED, ABSENT, RELIEVED
            },
            notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_security_rosters',
          ['organization_id', 'project_id', 'duty_date'],
          {
            name: 'idx_cs_sec_rosters_org_proj_date',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_security_rosters',
          ['guard_id', 'duty_date'],
          {
            name: 'idx_cs_sec_rosters_guard_date',
            transaction,
          },
        );
      }

      // 4. Table: cs_security_visitor_logs
      if (!tables.includes('cs_security_visitor_logs')) {
        await queryInterface.createTable(
          'cs_security_visitor_logs',
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
            visitor_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: false,
            },
            flat_visited: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            purpose: {
              type: Sequelize.STRING(100),
              allowNull: false, // Delivery, Guest / Personal, Contractor / Maintenance, Official / Courier, Other
            },
            in_time: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            out_time: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            guard_on_duty_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_security_guards',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            vehicle_number: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            national_id_or_badge: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'CHECKED_IN', // CHECKED_IN, CHECKED_OUT
            },
            remarks: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            created_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            updated_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            deleted_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            created_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.fn('NOW'),
            },
            deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        );

        await queryInterface.addIndex(
          'cs_security_visitor_logs',
          ['organization_id', 'project_id', 'status'],
          {
            name: 'idx_cs_sec_visitors_org_proj_status',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_security_visitor_logs',
          ['in_time'],
          {
            name: 'idx_cs_sec_visitors_in_time',
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_security_visitor_logs', { transaction });
      await queryInterface.dropTable('cs_security_rosters', { transaction });
      await queryInterface.dropTable('cs_security_guards', { transaction });
      await queryInterface.dropTable('cs_security_companies', { transaction });
    });
  },
};

