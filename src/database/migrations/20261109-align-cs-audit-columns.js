'use strict';

/**
 * Migration: Align Audit Columns for Customer Service Tables
 * Adds updated_by and deleted_by (BIGINT, nullable) to the 9 CS tables
 * that currently only possess created_by.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const targetTables = [
        'cs_building_expenses',
        'cs_building_incomes',
        'cs_committee_decisions',
        'cs_committee_members',
        'cs_flat_service_charges',
        'cs_parking_assignments',
        'cs_parking_external_rentals',
        'cs_parking_slots',
        'cs_service_charge_rates',
      ];

      for (const tableName of targetTables) {
        // Check if table exists
        const [tableExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = :tableName`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!tableExists) {
          continue;
        }

        // 1. Check and add updated_by
        const [updatedByExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'updated_by'`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!updatedByExists) {
          await queryInterface.addColumn(
            tableName,
            'updated_by',
            {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            { transaction },
          );
        }

        // 2. Check and add deleted_by
        const [deletedByExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'deleted_by'`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!deletedByExists) {
          await queryInterface.addColumn(
            tableName,
            'deleted_by',
            {
              type: Sequelize.BIGINT,
              allowNull: true,
            },
            { transaction },
          );
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const targetTables = [
        'cs_building_expenses',
        'cs_building_incomes',
        'cs_committee_decisions',
        'cs_committee_members',
        'cs_flat_service_charges',
        'cs_parking_assignments',
        'cs_parking_external_rentals',
        'cs_parking_slots',
        'cs_service_charge_rates',
      ];

      for (const tableName of targetTables) {
        const [tableExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = :tableName`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!tableExists) {
          continue;
        }

        // Remove deleted_by if exists
        const [deletedByExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'deleted_by'`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (deletedByExists) {
          await queryInterface.removeColumn(tableName, 'deleted_by', { transaction });
        }

        // Remove updated_by if exists
        const [updatedByExists] = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'updated_by'`,
          {
            replacements: { tableName },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (updatedByExists) {
          await queryInterface.removeColumn(tableName, 'updated_by', { transaction });
        }
      }
    });
  },
};

