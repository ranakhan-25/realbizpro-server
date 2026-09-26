module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_schedule_details
      ADD COLUMN IF NOT EXISTS override_existing_data BOOLEAN NOT NULL DEFAULT FALSE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_schedule_details
      ADD COLUMN IF NOT EXISTS generate_rostering_shift_automatically BOOLEAN NOT NULL DEFAULT FALSE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_schedule_details
      DROP COLUMN IF EXISTS generate_rostering_shift_automatically;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_schedule_details
      DROP COLUMN IF EXISTS override_existing_data;
    `);
  },
};
