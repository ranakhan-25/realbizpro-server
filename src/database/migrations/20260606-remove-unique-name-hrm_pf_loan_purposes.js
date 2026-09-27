module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop any unique constraint that enforces uniqueness on the `name` column
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE c text;
      BEGIN
        SELECT conname INTO c
        FROM pg_constraint
        WHERE conrelid = 'hrm_pf_loan_purposes'::regclass
          AND contype = 'u'
          AND conkey = ARRAY(
            SELECT attnum FROM pg_attribute
            WHERE attrelid = 'hrm_pf_loan_purposes'::regclass
              AND attname = 'name'
          );

        IF c IS NOT NULL THEN
          EXECUTE format('ALTER TABLE hrm_pf_loan_purposes DROP CONSTRAINT %I', c);
        END IF;

        -- Also drop standalone unique indexes on the name column (if any)
        PERFORM (
          SELECT 1 FROM (
            SELECT indexname
            FROM pg_indexes
            WHERE tablename = 'hrm_pf_loan_purposes' AND indexdef ILIKE '%CREATE UNIQUE%(%"name%")%'
          ) t
        );

        -- Drop any unique index explicitly containing the name column
        FOR c IN SELECT indexname FROM pg_indexes WHERE tablename = 'hrm_pf_loan_purposes' AND indexdef ILIKE '%CREATE UNIQUE INDEX%(%name% )%'
        LOOP
          EXECUTE format('DROP INDEX IF EXISTS %I', c);
        END LOOP;
      END$$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate a simple unique constraint on name if you want to rollback
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_pf_loan_purposes
      ADD CONSTRAINT IF NOT EXISTS hrm_pf_loan_purposes_name_unique UNIQUE (name);
    `);
  }
};
