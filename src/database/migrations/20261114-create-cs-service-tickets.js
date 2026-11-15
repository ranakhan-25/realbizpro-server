'use strict';

/**
 * Migration: Create Customer Service Tickets table (cs_service_tickets)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('cs_service_tickets')) {
        await queryInterface.createTable(
          'cs_service_tickets',
          {
            id: {
              type: Sequelize.BIGINT,
              primaryKey: true,
              autoIncrement: true,
              allowNull: false,
            },
            uuid: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              allowNull: false,
              unique: true,
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
            project_name: {
              type: Sequelize.STRING(255),
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
            ticket_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            subject: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            unit: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            category: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Civil Work',
            },
            priority: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Medium',
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Open',
            },
            assigned_agent_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            assigned_agent: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            sla_remaining_hours: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 24,
            },
            sla_target_hours: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 24,
            },
            is_overdue: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            due_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            resolved_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            closed_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            remarks: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            replies: {
              type: Sequelize.JSONB,
              allowNull: false,
              defaultValue: '[]',
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
              defaultValue: Sequelize.NOW,
            },
            updated_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
            },
            deleted_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction },
        );

        await queryInterface.addIndex('cs_service_tickets', ['organization_id', 'project_id'], {
          name: 'idx_cs_tkt_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_service_tickets', ['status'], {
          name: 'idx_cs_tkt_status',
          transaction,
        });
        await queryInterface.addIndex('cs_service_tickets', ['priority'], {
          name: 'idx_cs_tkt_priority',
          transaction,
        });
        await queryInterface.addIndex('cs_service_tickets', ['category'], {
          name: 'idx_cs_tkt_category',
          transaction,
        });
        await queryInterface.addIndex('cs_service_tickets', ['ticket_no'], {
          name: 'idx_cs_tkt_no',
          transaction,
        });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_service_tickets');
  },
};
