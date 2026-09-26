module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_shift_groups
      ADD COLUMN IF NOT EXISTS effective_to DATE NULL;

      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'roster_start_date'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'effective_from'
        ) THEN
          ALTER TABLE hrm_employee_roster_logs
          RENAME COLUMN roster_start_date TO effective_from;
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'roster_end_date'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'effective_to'
        ) THEN
          ALTER TABLE hrm_employee_roster_logs
          RENAME COLUMN roster_end_date TO effective_to;
        END IF;
      END $$;
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'effective_from'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'roster_start_date'
        ) THEN
          ALTER TABLE hrm_employee_roster_logs
          RENAME COLUMN effective_from TO roster_start_date;
        END IF;

        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'effective_to'
        ) AND NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'hrm_employee_roster_logs'
            AND column_name = 'roster_end_date'
        ) THEN
          ALTER TABLE hrm_employee_roster_logs
          RENAME COLUMN effective_to TO roster_end_date;
        END IF;
      END $$;

      ALTER TABLE hrm_shift_groups
      DROP COLUMN IF EXISTS effective_to;
    `);
  },
};
