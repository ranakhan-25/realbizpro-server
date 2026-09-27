module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'hrm_salary',
      'payment_mode',
      {
        type: Sequelize.ENUM(
          'Bank',
          'Cash',
          'Mobile Banking',
        ),
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'hrm_salary',
      'generation_types',
      {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: [],
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'hrm_salary',
      'generation_types',
    );
    await queryInterface.removeColumn(
      'hrm_salary',
      'payment_mode',
    );
  },
};
