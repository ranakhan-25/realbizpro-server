module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      ADD COLUMN IF NOT EXISTS attendance_type VARCHAR(20) NOT NULL DEFAULT 'DEVICE';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_attendances
      DROP COLUMN IF EXISTS attendance_type;
    `);
  },
};
