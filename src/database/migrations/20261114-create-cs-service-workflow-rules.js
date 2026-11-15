'use strict';

/**
 * Migration: Create cs_service_workflow_rules table
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();

      if (!tables.includes('cs_service_workflow_rules')) {
        await queryInterface.createTable(
          'cs_service_workflow_rules',
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
            rule_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            rule_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            rule_type: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'SLA Policy',
            },
            category_or_trigger: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            first_response_target: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: '2 Hours',
            },
            resolution_target: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: '24 Hours',
            },
            escalation_target: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            assigned_department: {
              type: Sequelize.STRING(255),
              allowNull: false,
              defaultValue: 'Site Engineering & QA',
            },
            operating_hours: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Office Hours (Sat-Thu 9am-6pm)',
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Active',
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

        await queryInterface.addIndex('cs_service_workflow_rules', ['organization_id', 'project_id'], {
          name: 'idx_cs_rules_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_service_workflow_rules', ['rule_type'], {
          name: 'idx_cs_rules_type',
          transaction,
        });
        await queryInterface.addIndex('cs_service_workflow_rules', ['status'], {
          name: 'idx_cs_rules_status',
          transaction,
        });
        await queryInterface.addIndex('cs_service_workflow_rules', ['rule_code'], {
          name: 'idx_cs_rules_code',
          transaction,
        });

        // Seed 5 default real-world workflow rules for organization 1
        const initialRules = [
          {
            uuid: 'e7100001-0000-0000-0000-000000000001',
            organization_id: 1,
            rule_code: 'SLA-URG-01',
            rule_name: 'Critical Structural & MEP Incident',
            rule_type: 'SLA Policy',
            category_or_trigger: 'Water Seepage, Elevator Fault, Sub-station Earthing',
            first_response_target: '1 Hour',
            resolution_target: '24 Hours',
            escalation_target: 'Chief Project Engineer after 4 Hours',
            assigned_department: 'Site Engineering & QA',
            operating_hours: '24/7 Priority',
            status: 'Active',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            uuid: 'e7100001-0000-0000-0000-000000000002',
            organization_id: 1,
            rule_code: 'SLA-STD-02',
            rule_name: 'Finishing & Cosmetic Snagging',
            rule_type: 'SLA Policy',
            category_or_trigger: 'Tiles, Paint Touchup, Window Sealant, Door Lock',
            first_response_target: '4 Hours',
            resolution_target: '48 Hours',
            escalation_target: 'QA Supervisor after 24 Hours',
            assigned_department: 'Finishing Sub-contractor Care',
            operating_hours: 'Office Hours (Sat-Thu 9am-6pm)',
            status: 'Active',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            uuid: 'e7100001-0000-0000-0000-000000000003',
            organization_id: 1,
            rule_code: 'RTG-ACC-01',
            rule_name: 'Payment & Surcharge Inquiries Auto-Routing',
            rule_type: 'Auto-Routing',
            category_or_trigger: 'Installment clarification, Money receipt delay',
            first_response_target: '2 Hours',
            resolution_target: '24 Hours',
            escalation_target: 'Head of Accounts after 12 Hours',
            assigned_department: 'Post-Sales Accounts Team',
            operating_hours: 'Office Hours (Sat-Thu 9am-6pm)',
            status: 'Active',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            uuid: 'e7100001-0000-0000-0000-000000000004',
            organization_id: 1,
            rule_code: 'STAT-DLP-01',
            rule_name: 'Statutory 2-Year DLP Governance Rule',
            rule_type: 'Statutory Rule',
            category_or_trigger: 'Real Estate Act 2010 Section 13 (Workmanship & Structural Defect)',
            first_response_target: '2 Hours',
            resolution_target: '72 Hours',
            escalation_target: 'Managing Director / Project Director',
            assigned_department: 'Executive Quality Assurance',
            operating_hours: '24/7 Priority',
            status: 'Active',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            uuid: 'e7100001-0000-0000-0000-000000000005',
            organization_id: 1,
            rule_code: 'ESC-TIER-03',
            rule_name: 'Customer Detractor Auto-Escalation',
            rule_type: 'Escalation Matrix',
            category_or_trigger: 'NPS Rating <= 6 or Unresolved Complaint > 48 Hours',
            first_response_target: '30 Minutes',
            resolution_target: '12 Hours',
            escalation_target: 'Chief Customer Experience Officer',
            assigned_department: 'CX Leadership',
            operating_hours: 'Office Hours (Sat-Thu 9am-6pm)',
            status: 'Active',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ];

        await queryInterface.bulkInsert('cs_service_workflow_rules', initialRules, { transaction });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_service_workflow_rules');
  },
};
