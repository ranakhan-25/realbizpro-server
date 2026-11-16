'use strict';

/**
 * Migration: Revert/Sync Building Management features and menus
 * Separates "Building Management" (Service Charge & Costing, Building Committee)
 * from "Building Services" (Utility, Security, Parking, Other Services) per meeting decisions.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      // 1. Sync sys_features
      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET name = 'Building Management | Service Charge & Costing' 
         WHERE code = 'CS_MGMT_SERVICE_CHARGE' OR id = 1075`,
        { transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET name = 'Building Management | Building Committee' 
         WHERE code = 'CS_MGMT_COMMITTEE' OR id = 1076`,
        { transaction: tx },
      );

      // 2. Sync sys_menus
      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET title = 'Building Management | Service Charge & Costing' 
         WHERE url = '/dashboard/customer-service/service-charge' OR id = 919`,
        { transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET title = 'Building Management | Building Committee' 
         WHERE url = '/dashboard/customer-service/building-committee' OR id = 920`,
        { transaction: tx },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET name = 'Building Services | Service Charge & Costing' 
         WHERE code = 'CS_MGMT_SERVICE_CHARGE' OR id = 1075`,
        { transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_features 
         SET name = 'Building Services | Building Committee' 
         WHERE code = 'CS_MGMT_COMMITTEE' OR id = 1076`,
        { transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET title = 'Building Services | Service Charge & Costing' 
         WHERE url = '/dashboard/customer-service/service-charge' OR id = 919`,
        { transaction: tx },
      );

      await queryInterface.sequelize.query(
        `UPDATE sys_menus 
         SET title = 'Building Services | Building Committee' 
         WHERE url = '/dashboard/customer-service/building-committee' OR id = 920`,
        { transaction: tx },
      );
    });
  },
};
