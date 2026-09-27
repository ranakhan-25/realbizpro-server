'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DO $$
      DECLARE
        enum_type_name text;
      BEGIN
        SELECT format('%I.%I', namespace.nspname, type.typname)
        INTO enum_type_name
        FROM pg_attribute attribute
        JOIN pg_class relation
          ON relation.oid = attribute.attrelid
        JOIN pg_namespace namespace
          ON namespace.oid = relation.relnamespace
        JOIN pg_type type
          ON type.oid = attribute.atttypid
        WHERE relation.relname = 'hrm_academic_records'
          AND attribute.attname = 'entry_type'
          AND attribute.attnum > 0
          AND NOT attribute.attisdropped;

        IF enum_type_name IS NULL THEN
          RAISE EXCEPTION
            'Could not find the enum type for hrm_academic_records.entry_type';
        END IF;

        EXECUTE format(
          'ALTER TYPE %s ADD VALUE IF NOT EXISTS %L',
          enum_type_name,
          'SUBJECT'
        );
      END$$;
    `);
  },

  async down() {
    // PostgreSQL does not safely support removing a single enum value while
    // rows may still use it, so this migration is intentionally irreversible.
  },
};
