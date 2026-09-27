module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_office_time
      ADD COLUMN IF NOT EXISTS name VARCHAR(255) NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_office_time
      DROP COLUMN IF EXISTS name;
    `);
  },
};
