// Migration to add `actions` column to `sys_features` table
// This migration uses Sequelize queryInterface to add a JSONB column that stores an array of allowed actions.

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add actions column with default value ['read','write','update','delete']
    await queryInterface.addColumn('sys_features', 'actions', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: ['read', 'write', 'update', 'delete'],
    });
    // Optionally, you may deprecate `action_type` column in future migrations.
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sys_features', 'actions');
  },
};
