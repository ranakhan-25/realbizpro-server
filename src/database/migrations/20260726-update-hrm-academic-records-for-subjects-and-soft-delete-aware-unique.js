'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE
        c text;
      BEGIN
        BEGIN
          ALTER TYPE enum_hrm_academic_records_entry_type
          ADD VALUE IF NOT EXISTS 'SUBJECT';
        EXCEPTION
          WHEN duplicate_object THEN
            NULL;
          WHEN undefined_object THEN
            NULL;
        END;

        SELECT conname INTO c
        FROM pg_constraint
        WHERE conrelid = 'hrm_academic_records'::regclass
          AND contype = 'u'
          AND conkey = ARRAY[
            (SELECT attnum
             FROM pg_attribute
             WHERE attrelid = 'hrm_academic_records'::regclass
               AND attname = 'entry_type'),
            (SELECT attnum
             FROM pg_attribute
             WHERE attrelid = 'hrm_academic_records'::regclass
               AND attname = 'name')
          ];

        IF c IS NOT NULL THEN
          EXECUTE format(
            'ALTER TABLE hrm_academic_records DROP CONSTRAINT %I',
            c
          );
        END IF;

        FOR c IN
          SELECT indexname
          FROM pg_indexes
          WHERE tablename = 'hrm_academic_records'
            AND indexdef ILIKE '%UNIQUE%'
            AND indexdef ILIKE '%entry_type%'
            AND indexdef ILIKE '%name%'
        LOOP
          EXECUTE format('DROP INDEX IF EXISTS %I', c);
        END LOOP;
      END$$;
    `);

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_hrm_academic_records_entry_type_name_active
      ON hrm_academic_records (entry_type, name)
      WHERE deleted_at IS NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS uq_hrm_academic_records_entry_type_name_active;
    `);

    await queryInterface.sequelize.query(`
      DO $$
      DECLARE
        c text;
      BEGIN
        SELECT conname INTO c
        FROM pg_constraint
        WHERE conrelid = 'hrm_academic_records'::regclass
          AND contype = 'u'
          AND conkey = ARRAY[
            (SELECT attnum
             FROM pg_attribute
             WHERE attrelid = 'hrm_academic_records'::regclass
               AND attname = 'entry_type'),
            (SELECT attnum
             FROM pg_attribute
             WHERE attrelid = 'hrm_academic_records'::regclass
               AND attname = 'name')
          ];

        IF c IS NULL THEN
          EXECUTE 'ALTER TABLE hrm_academic_records ADD CONSTRAINT uq_hrm_academic_records_entry_type_name UNIQUE (entry_type, name)';
        END IF;
      END$$;
    `);
  },
};
