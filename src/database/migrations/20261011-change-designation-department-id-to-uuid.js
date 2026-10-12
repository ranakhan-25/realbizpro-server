'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "designation"
      ALTER COLUMN "departmentId" TYPE uuid
      USING "departmentId"::uuid;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "designation"
      DROP CONSTRAINT IF EXISTS "designation_departmentId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "designation"
      ADD CONSTRAINT "designation_departmentId_fkey"
      FOREIGN KEY ("departmentId")
      REFERENCES "department" ("uuid");
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "designation"
      DROP CONSTRAINT IF EXISTS "designation_departmentId_fkey";
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "designation"
      ALTER COLUMN "departmentId" TYPE character varying
      USING "departmentId"::text;
    `);
  },
};
