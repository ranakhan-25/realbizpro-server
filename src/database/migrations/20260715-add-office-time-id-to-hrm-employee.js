module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee
      ADD COLUMN IF NOT EXISTS office_time_id BIGINT NULL;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'fk_hrm_employee_office_time_id'
        ) THEN
          ALTER TABLE hrm_employee
          ADD CONSTRAINT fk_hrm_employee_office_time_id
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
      ALTER TABLE hrm_employee
      DROP CONSTRAINT IF EXISTS fk_hrm_employee_office_time_id;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE hrm_employee
      DROP COLUMN IF EXISTS office_time_id;
    `);
  },
};
