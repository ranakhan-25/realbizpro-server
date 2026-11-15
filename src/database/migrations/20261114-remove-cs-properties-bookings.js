'use strict';

/**
 * Migration: Remove/Deactivate Customer Service Bookings & Property Portfolio
 * Route: /dashboard/customer-service/customers/properties-bookings
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      const now = new Date();

      // 1. Deactivate in sys_menus
      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET is_visible = false, deleted_at = :now, updated_at = :now
         WHERE url LIKE '%/dashboard/customer-service/customers/properties-bookings%'`,
        { replacements: { now }, transaction: tx },
      );

      // 2. Deactivate in sys_features
      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET is_active = false, deleted_at = :now, updated_at = :now
         WHERE code = 'CS_CUST_BOOKINGS' 
            OR route_path LIKE '%/dashboard/customer-service/customers/properties-bookings%'`,
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
         WHERE url LIKE '%/dashboard/customer-service/customers/properties-bookings%'`,
        { replacements: { now }, transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET is_active = true, deleted_at = NULL, updated_at = :now
         WHERE code = 'CS_CUST_BOOKINGS'`,
        { replacements: { now }, transaction: tx },
      );
    });
  },
};
