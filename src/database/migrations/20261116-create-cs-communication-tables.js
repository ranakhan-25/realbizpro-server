'use strict';

/**
 * Migration: Create Customer Service Communication Tables
 * - cs_communication_logs
 * - cs_site_visit_appointments
 * - cs_customer_feedbacks
 * And sequences:
 * - cs_comm_logs_code_seq (MSG-2026-XXXX)
 * - cs_site_visits_code_seq (VST-2026-XXXX)
 * - cs_feedback_code_seq (CSAT-2026-XXXX)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Create Sequences
      await queryInterface.sequelize.query(
        `CREATE SEQUENCE IF NOT EXISTS public.cs_comm_logs_code_seq START WITH 1001 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE SEQUENCE IF NOT EXISTS public.cs_site_visits_code_seq START WITH 101 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `CREATE SEQUENCE IF NOT EXISTS public.cs_feedback_code_seq START WITH 101 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;`,
        { transaction }
      );

      const tables = await queryInterface.showAllTables({ transaction });

      // 2. cs_communication_logs
      if (!tables.includes('cs_communication_logs')) {
        await queryInterface.createTable(
          'cs_communication_logs',
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
            comm_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            email: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            unit: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            channel: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'SMS',
            },
            type: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Payment Reminder',
            },
            subject: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            content: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Sent',
            },
            scheduled_for: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            sent_at: {
              type: Sequelize.DATE,
              allowNull: true,
            },
            sent_by: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            metadata: {
              type: Sequelize.JSONB,
              allowNull: true,
              defaultValue: '{}',
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
          { transaction }
        );

        await queryInterface.addIndex('cs_communication_logs', ['organization_id'], { transaction });
        await queryInterface.addIndex('cs_communication_logs', ['project_id'], { transaction });
        await queryInterface.addIndex('cs_communication_logs', ['comm_no'], { transaction });
        await queryInterface.addIndex('cs_communication_logs', ['channel'], { transaction });
        await queryInterface.addIndex('cs_communication_logs', ['status'], { transaction });
        await queryInterface.addIndex('cs_communication_logs', ['created_at'], { transaction });
      }

      // 3. cs_site_visit_appointments
      if (!tables.includes('cs_site_visit_appointments')) {
        await queryInterface.createTable(
          'cs_site_visit_appointments',
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
            visit_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
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
            visit_purpose: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Milestone Inspection',
            },
            appointment_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            time_slot: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: '10:00 AM - 11:30 AM',
            },
            assigned_escort_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            assigned_escort: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            safety_ppe_required: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Scheduled',
            },
            customer_notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            inspection_findings: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            checklist: {
              type: Sequelize.JSONB,
              allowNull: true,
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
          { transaction }
        );

        await queryInterface.addIndex('cs_site_visit_appointments', ['organization_id'], { transaction });
        await queryInterface.addIndex('cs_site_visit_appointments', ['project_id'], { transaction });
        await queryInterface.addIndex('cs_site_visit_appointments', ['visit_no'], { transaction });
        await queryInterface.addIndex('cs_site_visit_appointments', ['appointment_date'], { transaction });
        await queryInterface.addIndex('cs_site_visit_appointments', ['status'], { transaction });
        await queryInterface.addIndex('cs_site_visit_appointments', ['visit_purpose'], { transaction });
      }

      // 4. cs_customer_feedbacks
      if (!tables.includes('cs_customer_feedbacks')) {
        await queryInterface.createTable(
          'cs_customer_feedbacks',
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
            feedback_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
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
            survey_type: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Handover CSAT',
            },
            csat_score: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 5,
            },
            nps_score: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 10,
            },
            nps_category: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Promoter',
            },
            comments: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            follow_up_status: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Pending Review',
            },
            assigned_officer_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            assigned_officer: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            action_notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            submitted_at: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW,
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
          { transaction }
        );

        await queryInterface.addIndex('cs_customer_feedbacks', ['organization_id'], { transaction });
        await queryInterface.addIndex('cs_customer_feedbacks', ['project_id'], { transaction });
        await queryInterface.addIndex('cs_customer_feedbacks', ['feedback_no'], { transaction });
        await queryInterface.addIndex('cs_customer_feedbacks', ['survey_type'], { transaction });
        await queryInterface.addIndex('cs_customer_feedbacks', ['nps_category'], { transaction });
        await queryInterface.addIndex('cs_customer_feedbacks', ['follow_up_status'], { transaction });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_customer_feedbacks', { transaction });
      await queryInterface.dropTable('cs_site_visit_appointments', { transaction });
      await queryInterface.dropTable('cs_communication_logs', { transaction });
    });
  },
};
