'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // 1. Enhancements to lams_acquisition_leads
      const leadTableInfo = await queryInterface.describeTable('lams_acquisition_leads').catch(() => null);
      if (leadTableInfo) {
        const leadColsToAdd = {
          org_id: { type: Sequelize.STRING, allowNull: false, defaultValue: 'org-001' },
          lead_code: { type: Sequelize.STRING(50), allowNull: true },
          location: { type: Sequelize.TEXT, allowNull: true },
          mouza: { type: Sequelize.STRING(150), allowNull: true },
          khatian_no: { type: Sequelize.STRING(100), allowNull: true },
          dag_no: { type: Sequelize.STRING(100), allowNull: true },
          area_katha: { type: Sequelize.DECIMAL(12, 4), allowNull: true, defaultValue: 0 },
          area_sqft: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
          asking_price: { type: Sequelize.DECIMAL(15, 2), allowNull: true, defaultValue: 0 },
          source: { type: Sequelize.STRING(100), allowNull: true, defaultValue: 'Direct Owner' },
          priority: { type: Sequelize.STRING(20), allowNull: true, defaultValue: 'Medium' },
          assigned_to: { type: Sequelize.STRING(100), allowNull: true },
          notes: { type: Sequelize.TEXT, allowNull: true },
          co_owners_json: { type: Sequelize.JSONB, allowNull: true },
          map_url: { type: Sequelize.STRING(500), allowNull: true },
        };

        for (const [colName, colDef] of Object.entries(leadColsToAdd)) {
          if (!leadTableInfo[colName]) {
            await queryInterface.addColumn('lams_acquisition_leads', colName, colDef, { transaction });
          }
        }
      }

      // 2. Enhancements to lams_land_owners
      const ownerTableInfo = await queryInterface.describeTable('lams_land_owners').catch(() => null);
      if (ownerTableInfo) {
        if (ownerTableInfo.lead_id && !ownerTableInfo.lead_id.allowNull) {
          await queryInterface.changeColumn('lams_land_owners', 'lead_id', {
            type: Sequelize.UUID,
            allowNull: true,
          }, { transaction }).catch(() => {});
        }

        const ownerColsToAdd = {
          org_id: { type: Sequelize.STRING, allowNull: false, defaultValue: 'org-001' },
          father_name: { type: Sequelize.STRING(255), allowNull: true },
          bank_name: { type: Sequelize.STRING(150), allowNull: true },
          bank_account: { type: Sequelize.STRING(100), allowNull: true },
          nominee_json: { type: Sequelize.JSONB, allowNull: true },
        };

        for (const [colName, colDef] of Object.entries(ownerColsToAdd)) {
          if (!ownerTableInfo[colName]) {
            await queryInterface.addColumn('lams_land_owners', colName, colDef, { transaction });
          }
        }
      }

      // 3. Enhancements to lams_negotiation_processes
      const negTableInfo = await queryInterface.describeTable('lams_negotiation_processes').catch(() => null);
      if (negTableInfo) {
        const negColsToAdd = {
          org_id: { type: Sequelize.STRING, allowNull: false, defaultValue: 'org-001' },
          round_no: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
          counter_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          gap_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          final_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          negotiator: { type: Sequelize.STRING(150), allowNull: true },
        };

        for (const [colName, colDef] of Object.entries(negColsToAdd)) {
          if (!negTableInfo[colName]) {
            await queryInterface.addColumn('lams_negotiation_processes', colName, colDef, { transaction });
          }
        }
      }

      const allTables = await queryInterface.showAllTables({ transaction });

      // 4. Create lams_lead_stage_logs
      if (!allTables.includes('lams_lead_stage_logs')) {
        await queryInterface.createTable('lams_lead_stage_logs', {
          id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
          uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false },
          org_id: { type: Sequelize.STRING, allowNull: false },
          lead_id: { type: Sequelize.UUID, allowNull: false },
          from_stage: { type: Sequelize.STRING(50), allowNull: false },
          to_stage: { type: Sequelize.STRING(50), allowNull: false },
          remarks: { type: Sequelize.TEXT, allowNull: false },
          transitioned_by: { type: Sequelize.STRING(100), allowNull: true },
          created_by: { type: Sequelize.INTEGER, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      // 5. Create lams_settlement_payments
      if (!allTables.includes('lams_settlement_payments')) {
        await queryInterface.createTable('lams_settlement_payments', {
          id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
          uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false },
          org_id: { type: Sequelize.STRING, allowNull: false },
          settlement_id: { type: Sequelize.UUID, allowNull: false },
          lead_id: { type: Sequelize.UUID, allowNull: false },
          payment_no: { type: Sequelize.STRING(50), allowNull: false },
          installment_no: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
          amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          payment_date: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal('CURRENT_DATE') },
          payment_method: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'bank_transfer' },
          reference_no: { type: Sequelize.STRING(100), allowNull: true },
          status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'completed' },
          remarks: { type: Sequelize.TEXT, allowNull: true },
          receipt_url: { type: Sequelize.STRING(500), allowNull: true },
          created_by: { type: Sequelize.STRING, allowNull: true },
          updated_by: { type: Sequelize.STRING, allowNull: true },
          deleted_by: { type: Sequelize.STRING, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      // 6. Create inv_stock_balances
      if (!allTables.includes('inv_stock_balances')) {
        await queryInterface.createTable('inv_stock_balances', {
          id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
          uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false },
          org_id: { type: Sequelize.STRING, allowNull: false },
          warehouse_id: { type: Sequelize.BIGINT, allowNull: false },
          item_id: { type: Sequelize.UUID, allowNull: false },
          current_qty: { type: Sequelize.DECIMAL(15, 4), allowNull: false, defaultValue: 0 },
          reserved_qty: { type: Sequelize.DECIMAL(15, 4), allowNull: false, defaultValue: 0 },
          available_qty: { type: Sequelize.DECIMAL(15, 4), allowNull: false, defaultValue: 0 },
          avg_cost: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          last_movement_at: { type: Sequelize.DATE, allowNull: true },
          created_by: { type: Sequelize.STRING, allowNull: true },
          updated_by: { type: Sequelize.STRING, allowNull: true },
          deleted_by: { type: Sequelize.STRING, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }

      // 7. Create inv_movements
      if (!allTables.includes('inv_movements')) {
        await queryInterface.createTable('inv_movements', {
          id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4, allowNull: false },
          uuid: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false },
          org_id: { type: Sequelize.STRING, allowNull: false },
          movement_no: { type: Sequelize.STRING(50), allowNull: false },
          movement_type: { type: Sequelize.STRING(50), allowNull: false },
          movement_date: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal('CURRENT_DATE') },
          item_id: { type: Sequelize.UUID, allowNull: false },
          warehouse_id: { type: Sequelize.BIGINT, allowNull: false },
          to_warehouse_id: { type: Sequelize.BIGINT, allowNull: true },
          quantity: { type: Sequelize.DECIMAL(15, 4), allowNull: false, defaultValue: 0 },
          unit_rate: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          total_amount: { type: Sequelize.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
          reference_type: { type: Sequelize.STRING(50), allowNull: true },
          reference_id: { type: Sequelize.STRING(100), allowNull: true },
          issued_to: { type: Sequelize.STRING(150), allowNull: true },
          reason: { type: Sequelize.TEXT, allowNull: true },
          notes: { type: Sequelize.TEXT, allowNull: true },
          photo_url: { type: Sequelize.STRING(500), allowNull: true },
          created_by: { type: Sequelize.STRING, allowNull: true },
          updated_by: { type: Sequelize.STRING, allowNull: true },
          deleted_by: { type: Sequelize.STRING, allowNull: true },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inv_movements').catch(() => {});
    await queryInterface.dropTable('inv_stock_balances').catch(() => {});
    await queryInterface.dropTable('lams_settlement_payments').catch(() => {});
    await queryInterface.dropTable('lams_lead_stage_logs').catch(() => {});
  },
};
