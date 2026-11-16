'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'hrm_pay_slip',
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
          defaultValue: Sequelize.literal(
            'gen_random_uuid()',
          ),
        },
        employee_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'hrm_employee_list',
            key: 'uuid',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        employee_code: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        employee_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        period_month: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        period_year: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        gross_salary: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        working_days: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        absent_days: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        absent_amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        deduction: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        net_salary: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        bank_payable_amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        cash_payable_amount: {
          type: Sequelize.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: 'Generated',
        },
        generated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP',
          ),
        },
        org_id: {
          type: Sequelize.BIGINT,
          allowNull: true,
          references: {
            model: 'sys_organizations',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        created_by: {
          type: Sequelize.STRING,
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
      'hrm_pay_slip',
      [
        'org_id',
        'employee_id',
        'period_year',
        'period_month',
      ],
      {
        unique: true,
        name: 'hrm_pay_slip_unique_period_employee',
      },
    );
    await queryInterface.addIndex(
      'hrm_pay_slip',
      ['org_id', 'period_year', 'period_month'],
      { name: 'hrm_pay_slip_period_idx' },
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable(
      'hrm_pay_slip',
    );
  },
};
