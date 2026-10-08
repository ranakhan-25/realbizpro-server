module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      ADD COLUMN IF NOT EXISTS latitude VARCHAR(30) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      ADD COLUMN IF NOT EXISTS longitude VARCHAR(30) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      ADD COLUMN IF NOT EXISTS location_name VARCHAR(255) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      ADD COLUMN IF NOT EXISTS attendance_location VARCHAR(500) NULL;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      ADD COLUMN IF NOT EXISTS attendance_radius_meters INTEGER NULL;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      DROP COLUMN IF EXISTS attendance_radius_meters;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      DROP COLUMN IF EXISTS attendance_location;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      DROP COLUMN IF EXISTS location_name;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      DROP COLUMN IF EXISTS longitude;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_office
      DROP COLUMN IF EXISTS latitude;
    `);
  },
};
