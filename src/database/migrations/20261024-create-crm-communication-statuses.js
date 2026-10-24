'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((table) =>
      typeof table === 'string' ? table : table.tableName,
    );

    if (!tableNames.includes('crm_communication_statuses')) {
      await queryInterface.createTable('crm_communication_statuses', {
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
          defaultValue: Sequelize.literal('gen_random_uuid()'),
        },
        name: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        status: {
          type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
          allowNull: false,
          defaultValue: 'ACTIVE',
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        is_default: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        lead_stage_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'crm_lead_stages',
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        added_by_id: {
          type: Sequelize.STRING,
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
      });

      await queryInterface.addIndex('crm_communication_statuses', ['name']);
      await queryInterface.addIndex('crm_communication_statuses', ['status']);
      await queryInterface.addIndex('crm_communication_statuses', ['lead_stage_id']);
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crm_communication_statuses');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_crm_communication_statuses_status";',
    );
  },
};
