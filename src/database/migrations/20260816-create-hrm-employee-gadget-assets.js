'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'hrm_employee_gadget_assets',
      {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        uuid: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          unique: true,
        },
        employee_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          references: {
            model: 'hrm_employee',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        gadget_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        asset_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        asset_code: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        serial_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        brand: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        model: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        issue_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        return_date: {
          type: Sequelize.DATEONLY,
          allowNull: true,
        },
        condition: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM(
            'ASSIGNED',
            'RETURNED',
            'LOST',
            'DAMAGED',
          ),
          allowNull: false,
          defaultValue: 'ASSIGNED',
        },
        remarks: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_by: {
          type: Sequelize.BIGINT,
          allowNull: false,
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
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP',
          ),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP',
          ),
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
    );
    await queryInterface.addIndex(
      'hrm_employee_gadget_assets',
      ['employee_id'],
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      'hrm_employee_gadget_assets',
    );
  },
};
