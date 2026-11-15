'use strict';

/**
 * Migration: Create Customer Service Documents & Land Records Tables
 * - cs_customer_documents
 * - cs_registration_trackings
 * - cs_mutation_trackings
 *
 * Scope: Customer Service | Documents & Land Records Module
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables({ transaction });

      // 1. Table: cs_customer_documents
      if (!tables.includes('cs_customer_documents')) {
        await queryInterface.createTable(
          'cs_customer_documents',
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
            doc_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            doc_title: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            doc_category: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Sale Agreement (Baina)',
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            unit_name: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            file_name: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            file_size: {
              type: Sequelize.STRING(50),
              allowNull: true,
            },
            file_url: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            file_key: {
              type: Sequelize.TEXT,
              allowNull: true,
            },
            upload_date: {
              type: Sequelize.DATEONLY,
              allowNull: false,
              defaultValue: Sequelize.NOW,
            },
            verification_status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Pending Vetting',
            },
            verified_by: {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_users',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            verified_at: {
              type: Sequelize.DATE,
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

        await queryInterface.addIndex('cs_customer_documents', ['organization_id', 'project_id'], {
          name: 'idx_cs_docs_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_customer_documents', ['doc_category'], {
          name: 'idx_cs_docs_category',
          transaction,
        });
        await queryInterface.addIndex('cs_customer_documents', ['verification_status'], {
          name: 'idx_cs_docs_status',
          transaction,
        });
      }

      // 2. Table: cs_registration_trackings
      if (!tables.includes('cs_registration_trackings')) {
        await queryInterface.createTable(
          'cs_registration_trackings',
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
            reg_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            unit_name: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            project_name: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            sub_registrar_office: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            deed_draft_status: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Draft Ready',
            },
            registration_date_scheduled: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            total_govt_fees: {
              type: Sequelize.DECIMAL(14, 2),
              allowNull: false,
              defaultValue: 0,
            },
            fee_receipt_collected: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            registered_deed_no: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            status: {
              type: Sequelize.STRING(50),
              allowNull: false,
              defaultValue: 'Documents Gathering',
            },
            delivered_date: {
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

        await queryInterface.addIndex('cs_registration_trackings', ['organization_id', 'project_id'], {
          name: 'idx_cs_reg_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_registration_trackings', ['status'], {
          name: 'idx_cs_reg_status',
          transaction,
        });
      }

      // 3. Table: cs_mutation_trackings
      if (!tables.includes('cs_mutation_trackings')) {
        await queryInterface.createTable(
          'cs_mutation_trackings',
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
            mut_code: {
              type: Sequelize.STRING(50),
              allowNull: false,
              unique: true,
            },
            customer_name: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            unit_name: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            project_name: {
              type: Sequelize.STRING(255),
              allowNull: true,
            },
            mutation_app_no: {
              type: Sequelize.STRING(100),
              allowNull: false,
            },
            ac_land_office: {
              type: Sequelize.STRING(255),
              allowNull: false,
            },
            current_stage: {
              type: Sequelize.STRING(100),
              allowNull: false,
              defaultValue: 'Kanungo/Surveyor Inquiry',
            },
            hearing_date: {
              type: Sequelize.DATEONLY,
              allowNull: true,
            },
            dcr_number: {
              type: Sequelize.STRING(100),
              allowNull: true,
            },
            dcr_fee_amount: {
              type: Sequelize.DECIMAL(10, 2),
              allowNull: false,
              defaultValue: 1170.0,
            },
            dcr_paid: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false,
            },
            khatian_number: {
              type: Sequelize.STRING(100),
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

        await queryInterface.addIndex('cs_mutation_trackings', ['organization_id', 'project_id'], {
          name: 'idx_cs_mut_org_proj',
          transaction,
        });
        await queryInterface.addIndex('cs_mutation_trackings', ['current_stage'], {
          name: 'idx_cs_mut_stage',
          transaction,
        });
        await queryInterface.addIndex('cs_mutation_trackings', ['mutation_app_no'], {
          name: 'idx_cs_mut_app_no',
          transaction,
        });
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('cs_mutation_trackings', { transaction });
      await queryInterface.dropTable('cs_registration_trackings', { transaction });
      await queryInterface.dropTable('cs_customer_documents', { transaction });
    });
  },
};
