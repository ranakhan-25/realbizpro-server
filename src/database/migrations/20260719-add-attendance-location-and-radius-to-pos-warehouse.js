module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE pos_warehouse
      ADD COLUMN IF NOT EXISTS attendance_location VARCHAR(500) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE pos_warehouse
      ADD COLUMN IF NOT EXISTS attendance_radius_meters INTEGER NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE pos_warehouse
      DROP COLUMN IF EXISTS attendance_radius_meters;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE pos_warehouse
      DROP COLUMN IF EXISTS attendance_location;
    `);
  },
};
