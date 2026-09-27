module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hrm_employee_salary', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      employee_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'hrm_employee',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      gross_salary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      food_allowance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 1250,
      },
      transportation_allowance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 450,
      },
      medical_allowance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 750,
      },
      total_allowances: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      remaining_after_allowances: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      house_rent: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      basic_salary: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      created_by: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'sys_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      updated_by: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'sys_users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hrm_employee_salary');
  },
};
