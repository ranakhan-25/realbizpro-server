'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_pos_challan_claim_item_cause" ADD VALUE IF NOT EXISTS 'NOTHING'`,
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE "pos_challan_claim_item" ALTER COLUMN "cause" SET DEFAULT 'NOTHING'`,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE "pos_challan_claim_item" ALTER COLUMN "cause" DROP DEFAULT`,
    );
  },
};
