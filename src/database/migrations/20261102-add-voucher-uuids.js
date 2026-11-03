'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "vouchers"
      ADD COLUMN IF NOT EXISTS "uuid" uuid;
    `);
    await queryInterface.sequelize.query(`
      UPDATE "vouchers"
      SET "uuid" = md5(random()::text || clock_timestamp()::text)::uuid
      WHERE "uuid" IS NULL;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "vouchers"
      ALTER COLUMN "uuid" SET DEFAULT md5(random()::text || clock_timestamp()::text)::uuid,
      ALTER COLUMN "uuid" SET NOT NULL;
    `);
    await queryInterface.addConstraint('vouchers', {
      fields: ['uuid'],
      type: 'unique',
      name: 'vouchers_uuid_unique',
    }).catch(() => undefined);

    await queryInterface.sequelize.query(`
      ALTER TABLE "voucher_entries"
      DROP CONSTRAINT IF EXISTS "voucher_entries_voucherId_fkey";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "voucher_entries"
      ADD COLUMN IF NOT EXISTS "_voucher_uuid" uuid;
    `);
    await queryInterface.sequelize.query(`
      UPDATE "voucher_entries" e
      SET "_voucher_uuid" = v."uuid"
      FROM "vouchers" v
      WHERE v."id" = e."voucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "voucher_entries" DROP COLUMN "voucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "voucher_entries"
      RENAME COLUMN "_voucher_uuid" TO "voucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "voucher_entries"
      ADD CONSTRAINT "voucher_entries_voucherId_fkey"
      FOREIGN KEY ("voucherId") REFERENCES "vouchers" ("uuid")
      ON DELETE CASCADE;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_vouchers"
      ADD COLUMN IF NOT EXISTS "uuid" uuid;
    `);
    await queryInterface.sequelize.query(`
      UPDATE "payment_vouchers"
      SET "uuid" = md5(random()::text || clock_timestamp()::text)::uuid
      WHERE "uuid" IS NULL;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_vouchers"
      ALTER COLUMN "uuid" SET DEFAULT md5(random()::text || clock_timestamp()::text)::uuid,
      ALTER COLUMN "uuid" SET NOT NULL;
    `);
    await queryInterface.addConstraint('payment_vouchers', {
      fields: ['uuid'],
      type: 'unique',
      name: 'payment_vouchers_uuid_unique',
    }).catch(() => undefined);

    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_voucher_entries"
      DROP CONSTRAINT IF EXISTS "payment_voucher_entries_paymentVoucherId_fkey";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_voucher_entries"
      ADD COLUMN IF NOT EXISTS "_payment_voucher_uuid" uuid;
    `);
    await queryInterface.sequelize.query(`
      UPDATE "payment_voucher_entries" e
      SET "_payment_voucher_uuid" = v."uuid"
      FROM "payment_vouchers" v
      WHERE v."id" = e."paymentVoucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_voucher_entries" DROP COLUMN "paymentVoucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_voucher_entries"
      RENAME COLUMN "_payment_voucher_uuid" TO "paymentVoucherId";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "payment_voucher_entries"
      ADD CONSTRAINT "payment_voucher_entries_paymentVoucherId_fkey"
      FOREIGN KEY ("paymentVoucherId") REFERENCES "payment_vouchers" ("uuid")
      ON DELETE CASCADE;
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('vouchers', 'vouchers_uuid_unique').catch(() => undefined);
    await queryInterface.removeConstraint('payment_vouchers', 'payment_vouchers_uuid_unique').catch(() => undefined);
    await queryInterface.removeColumn('vouchers', 'uuid');
    await queryInterface.removeColumn('payment_vouchers', 'uuid');
  },
};
