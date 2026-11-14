'use strict';

/**
 * Migration: Remove/Deactivate Customer Service Payments & Collections
 * Covers:
 * 1. CS_PAY_COLLECTIONS (/dashboard/customer-service/payments/collections-ledger-receipts)
 * 2. CS_PAY_DUES_AGEING (/dashboard/customer-service/payments/dues-ageing-recovery)
 * 3. CS_PAY_REFUNDS (/dashboard/customer-service/payments/refunds-adjustments)
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      const now = new Date();

      // 1. Deactivate in sys_menus
      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET is_visible = false, deleted_at = :now, updated_at = :now
         WHERE url LIKE '%/dashboard/customer-service/payments%'
            OR title LIKE '%Payments & Collections%'`,
        { replacements: { now }, transaction: tx },
      );

      // 2. Deactivate in sys_features
      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET is_active = false, deleted_at = :now, updated_at = :now
         WHERE code IN ('CS_PAY_COLLECTIONS', 'CS_PAY_DUES_AGEING', 'CS_PAY_REFUNDS') 
            OR route_path LIKE '%/dashboard/customer-service/payments%'`,
        { replacements: { now }, transaction: tx },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      const now = new Date();

      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET is_visible = true, deleted_at = NULL, updated_at = :now
         WHERE url LIKE '%/dashboard/customer-service/payments%'`,
        { replacements: { now }, transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET is_active = true, deleted_at = NULL, updated_at = :now
         WHERE code IN ('CS_PAY_COLLECTIONS', 'CS_PAY_DUES_AGEING', 'CS_PAY_REFUNDS')`,
        { replacements: { now }, transaction: tx },
      );
    });
  },
};
