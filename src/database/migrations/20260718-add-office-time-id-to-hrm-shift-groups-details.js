module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_shift_groups_details
      ADD COLUMN IF NOT EXISTS office_time_id BIGINT NULL;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_hrm_shift_groups_details_office_time_id'
        ) THEN
          ALTER TABLE hrm_shift_groups_details
          ADD CONSTRAINT fk_hrm_shift_groups_details_office_time_id
          FOREIGN KEY (office_time_id)
          REFERENCES hrm_office_time(id)
          ON UPDATE CASCADE
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_shift_groups_details
      DROP CONSTRAINT IF EXISTS fk_hrm_shift_groups_details_office_time_id;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_shift_groups_details
      DROP COLUMN IF EXISTS office_time_id;
    `);
  },
};
