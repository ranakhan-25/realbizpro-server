'use strict';

/**
 * Migration: Create cs_utility_technicians, cs_warranty_items, and cs_utility_tickets tables
 * Scope: Customer Service - Building Services | Utility Service Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      // 1. Table: cs_utility_technicians
      if (!tables.includes('cs_utility_technicians')) {
        await queryInterface.createTable(
          'cs_utility_technicians',
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
            specialty: {
              type: Sequelize.STRING(50),
              allowNull: false, // 'Plumber', 'Electrician', 'Sanitary Specialist', 'HVAC / Generator', 'Multi-skilled'
            },
            technician_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'In-house', // 'In-house', 'Vendor'
            },
            vendor_name: {
              type: Sequelize.STRING(150),
              allowNull: true,
            },
            is_active: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
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
          'cs_utility_technicians',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_utility_technicians_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_utility_technicians',
          ['specialty'],
          {
            name: 'idx_cs_utility_technicians_specialty',
            transaction,
          },
        );
      }

      // 2. Table: cs_warranty_items
      if (!tables.includes('cs_warranty_items')) {
        await queryInterface.createTable(
          'cs_warranty_items',
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
            unit: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            customer_name: {
              type: Sequelize.STRING(150),
              allowNull: true,
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
            item_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            category: {
              type: Sequelize.STRING(50),
              allowNull: false, // 'Electrical', 'Plumbing', 'Sanitary', 'Water Fittings', 'Other'
            },
            brand: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            model_no: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            serial_number: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            location: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            quantity: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 1,
            },
            warranty_start_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            warranty_end_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            coverage_details: {
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
          'cs_warranty_items',
          ['organization_id', 'project_id'],
          {
            name: 'idx_cs_warranty_items_org_proj',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_warranty_items',
          ['warranty_end_date'],
          {
            name: 'idx_cs_warranty_items_end_date',
            transaction,
          },
        );
      }

      // 3. Table: cs_utility_tickets
      if (!tables.includes('cs_utility_tickets')) {
        await queryInterface.createTable(
          'cs_utility_tickets',
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
            ticket_number: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            queue_serial: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            unit: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            customer_name: {
              type: Sequelize.STRING(150),
              allowNull: false,
            },
            customer_phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            category: {
              type: Sequelize.STRING(50),
              allowNull: false, // 'Plumbing', 'Electrical', 'Sanitary', 'Other'
            },
            description: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            priority: {
              type: Sequelize.STRING(20),
              allowNull: false,
              defaultValue: 'Medium', // 'Low', 'Medium', 'High', 'Emergency'
            },
            status: {
              type: Sequelize.STRING(30),
              allowNull: false,
              defaultValue: 'Open', // 'Open', 'Assigned', 'In Progress', 'Resolved', 'Handed Over', 'Closed'
            },
            technician_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_utility_technicians',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            warranty_item_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'cs_warranty_items',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            cost_type: {
              type: Sequelize.STRING(10),
              allowNull: false,
              defaultValue: 'PAID', // 'FREE' or 'PAID'
            },
            estimated_charge: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0.0,
            },
            actual_charge: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: true,
            },
            assigned_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            resolved_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            handed_over_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            closed_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            resolution_notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            customer_feedback: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            customer_rating: {
              type: Sequelize.INTEGER,
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
          'cs_utility_tickets',
          ['organization_id', 'project_id', 'queue_serial'],
          {
            name: 'idx_cs_utility_tickets_org_proj_serial',
            transaction,
          },
        );

        await queryInterface.addIndex(
          'cs_utility_tickets',
          ['status'],
          {
            name: 'idx_cs_utility_tickets_status',
            transaction,
          },
        );
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_utility_tickets', { transaction });
      await queryInterface.dropTable('cs_warranty_items', { transaction });
      await queryInterface.dropTable('cs_utility_technicians', { transaction });
    });
  },
};

