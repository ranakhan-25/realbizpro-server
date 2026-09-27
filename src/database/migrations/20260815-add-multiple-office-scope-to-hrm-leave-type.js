'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_leave_type
        ADD COLUMN IF NOT EXISTS office_type_ids BIGINT[] NOT NULL DEFAULT ARRAY[]::BIGINT[],
        ADD COLUMN IF NOT EXISTS office_ids BIGINT[] NOT NULL DEFAULT ARRAY[]::BIGINT[],
        ADD COLUMN IF NOT EXISTS is_all_office_type BOOLEAN NOT NULL DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS is_all_office BOOLEAN NOT NULL DEFAULT TRUE;
    `);

    await queryInterface.sequelize.query(`
      UPDATE hrm_leave_type
      SET office_ids = ARRAY[office_id]::BIGINT[]
      WHERE office_id IS NOT NULL AND cardinality(office_ids) = 0;
    `);

    await queryInterface.sequelize.query(`
      UPDATE hrm_leave_type lt
      SET office_type_ids = ARRAY[sot.id]::BIGINT[]
      FROM sys_office_type sot
      WHERE lt.office_type IS NOT NULL
        AND LOWER(TRIM(lt.office_type)) = LOWER(TRIM(sot.name))
        AND cardinality(lt.office_type_ids) = 0;
    `);

    await queryInterface.sequelize.query(`
      UPDATE hrm_leave_type
      SET is_all_office = FALSE
      WHERE office_id IS NOT NULL OR cardinality(office_ids) > 0;

      UPDATE hrm_leave_type
      SET is_all_office_type = FALSE
      WHERE office_type IS NOT NULL OR cardinality(office_type_ids) > 0;

      UPDATE hrm_leave_type
      SET is_all_office = TRUE
      WHERE office_id IS NULL AND cardinality(office_ids) = 0;

      UPDATE hrm_leave_type
      SET is_all_office_type = TRUE
      WHERE office_type IS NULL AND cardinality(office_type_ids) = 0;

      ALTER TABLE hrm_leave_type
        DROP COLUMN IF EXISTS office_type,
        DROP COLUMN IF EXISTS office_id;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE IF EXISTS hrm_leave_type
        ADD COLUMN IF NOT EXISTS office_type VARCHAR(50),
        ADD COLUMN IF NOT EXISTS office_id BIGINT;

      UPDATE hrm_leave_type
      SET office_id = office_ids[1]
      WHERE cardinality(office_ids) > 0;

      UPDATE hrm_leave_type lt
      SET office_type = sot.name
      FROM sys_office_type sot
      WHERE sot.id = lt.office_type_ids[1];

      ALTER TABLE hrm_leave_type
        DROP COLUMN IF EXISTS office_type_ids,
        DROP COLUMN IF EXISTS office_ids,
        DROP COLUMN IF EXISTS is_all_office_type,
        DROP COLUMN IF EXISTS is_all_office;
    `);
  },
};
