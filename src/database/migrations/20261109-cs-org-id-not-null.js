'use strict';

const CS_TABLES = [
  'cs_booking_handovers',
  'cs_building_expenses',
  'cs_building_incomes',
  'cs_change_requests',
  'cs_committee_decisions',
  'cs_committee_members',
  'cs_customer_profiles',
  'cs_flat_service_charges',
  'cs_parking_assignments',
  'cs_parking_external_rentals',
  'cs_parking_slots',
  'cs_security_companies',
  'cs_security_guards',
  'cs_security_rosters',
  'cs_security_visitor_logs',
  'cs_service_charge_rates',
  'cs_utility_technicians',
  'cs_utility_tickets',
  'cs_warranty_items',
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (const table of CS_TABLES) {
      // Alter column to NOT NULL
      await queryInterface.changeColumn(table, 'organization_id', {
        type: Sequelize.BIGINT,
        allowNull: false,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    for (const table of CS_TABLES) {
      await queryInterface.changeColumn(table, 'organization_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
      });
    }
  },
};

