'use strict';

/**
 * Migration: Create Property Care tables:
 * 1. cs_warranty_dlp_claims
 * 2. cs_maintenance_requests
 * 3. cs_owners_associations
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();

      // 1. cs_warranty_dlp_claims
      if (!tables.includes('cs_warranty_dlp_claims')) {
        await queryInterface.createTable(
          'cs_warranty_dlp_claims',
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
            claim_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            unit: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            possession_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
              defaultValue: Sequelize.NOW,
            },
            dlp_expiry_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
            },
            defect_category: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Water Seepage',
            },
            severity: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Major',
            },
            assigned_engineer: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            assigned_engineer_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Claim Logged',
            },
            rectification_notes: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            signed_off_at: {
              type: Sequelize.DATE,
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

        await queryInterface.addIndex('cs_warranty_dlp_claims', ['organization_id', 'project_id'], {
          name: 'idx_cs_dlp_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_warranty_dlp_claims', ['status'], {
          name: 'idx_cs_dlp_status',
          transaction,
        });
        await queryInterface.addIndex('cs_warranty_dlp_claims', ['severity'], {
          name: 'idx_cs_dlp_severity',
          transaction,
        });
        await queryInterface.addIndex('cs_warranty_dlp_claims', ['claim_no'], {
          name: 'idx_cs_dlp_claim_no',
          transaction,
        });
      }

      // 2. cs_maintenance_requests
      if (!tables.includes('cs_maintenance_requests')) {
        await queryInterface.createTable(
          'cs_maintenance_requests',
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
            request_no: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            facility: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            maintenance_type: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Preventive',
            },
            scheduled_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
              defaultValue: Sequelize.NOW,
            },
            vendor_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
              defaultValue: 'In-house Facility Care',
            },
            vendor_id: {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            cost_estimate: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            actual_cost: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Scheduled',
            },
            completion_date: {
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

        await queryInterface.addIndex('cs_maintenance_requests', ['organization_id', 'project_id'], {
          name: 'idx_cs_mnt_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_maintenance_requests', ['status'], {
          name: 'idx_cs_mnt_status',
          transaction,
        });
        await queryInterface.addIndex('cs_maintenance_requests', ['maintenance_type'], {
          name: 'idx_cs_mnt_type',
          transaction,
        });
        await queryInterface.addIndex('cs_maintenance_requests', ['request_no'], {
          name: 'idx_cs_mnt_req_no',
          transaction,
        });
      }

      // 3. cs_owners_associations
      if (!tables.includes('cs_owners_associations')) {
        await queryInterface.createTable(
          'cs_owners_associations',
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
              allowNull: false,
            },
            association_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            association_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            president_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            contact_phone: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            total_flats: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            handed_over_count: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: 0,
            },
            monthly_service_charge_per_flat: {
              type: Sequelize.DECIMAL(12, 2),
              allowNull: false,
              defaultValue: 0,
            },
            association_bank_acc: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            handover_status: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Developer Managing',
            },
            transition_date: {
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

        await queryInterface.addIndex('cs_owners_associations', ['organization_id', 'project_id'], {
          name: 'idx_cs_oa_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_owners_associations', ['handover_status'], {
          name: 'idx_cs_oa_status',
          transaction,
        });
        await queryInterface.addIndex('cs_owners_associations', ['association_code'], {
          name: 'idx_cs_oa_code',
          transaction,
        });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cs_owners_associations');
    await queryInterface.dropTable('cs_maintenance_requests');
    await queryInterface.dropTable('cs_warranty_dlp_claims');
  },
};
