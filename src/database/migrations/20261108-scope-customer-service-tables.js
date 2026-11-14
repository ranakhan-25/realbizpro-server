'use strict';

/**
 * Migration: Scope Customer Service Tables (Multi-Tenancy & Project Scoping)
 * Tables: cs_customer_profiles, cs_booking_handovers, cs_change_requests
 * Adds: organization_id, project_id, composite indexes, and backfills existing rows
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const targetTables = [
        {
          name: 'cs_customer_profiles',
          indexName: 'idx_cs_customer_profiles_org_proj',
        },
        {
          name: 'cs_booking_handovers',
          indexName: 'idx_cs_booking_handovers_org_proj',
        },
        {
          name: 'cs_change_requests',
          indexName: 'idx_cs_change_requests_org_proj',
        },
      ];

      for (const target of targetTables) {
        // 1. Check if table exists
        const tableExists = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = :tableName`,
          {
            replacements: { tableName: target.name },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!tableExists || tableExists.length === 0) {
          continue;
        }

        // 2. Check and add organization_id
        const orgColExists = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'organization_id'`,
          {
            replacements: { tableName: target.name },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!orgColExists || orgColExists.length === 0) {
          await queryInterface.addColumn(
            target.name,
            'organization_id',
            {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: {
                model: 'sys_organizations',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction },
          );
        }

        // 3. Check and add project_id
        const projColExists = await queryInterface.sequelize.query(
          `SELECT 1 FROM information_schema.columns 
           WHERE table_schema = 'public' AND table_name = :tableName AND column_name = 'project_id'`,
          {
            replacements: { tableName: target.name },
            type: Sequelize.QueryTypes.SELECT,
            transaction,
          },
        );

        if (!projColExists || projColExists.length === 0) {
          await queryInterface.addColumn(
            target.name,
            'project_id',
            {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                model: 'project',
                key: 'uuid',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction },
          );
        }

        // 4. Add composite index on (organization_id, project_id)
        try {
          await queryInterface.addIndex(
            target.name,
            ['organization_id', 'project_id'],
            {
              name: target.indexName,
              transaction,
            },
          );
        } catch (idxErr) {
          // Ignore if index already exists
        }
      }

      // ==========================================
      // BACKFILL DATA FOR EXISTING ROWS
      // ==========================================

      // Backfill cs_customer_profiles
      await queryInterface.sequelize.query(
        `UPDATE cs_customer_profiles cp
         SET organization_id = COALESCE(u.org_id, 1)
         FROM sys_users u
         WHERE cp.created_by = u.id
           AND cp.organization_id IS NULL;`,
        { transaction },
      );
      // Fallback for any customer profile still without org
      await queryInterface.sequelize.query(
        `UPDATE cs_customer_profiles SET organization_id = 1 WHERE organization_id IS NULL;`,
        { transaction },
      );

      // Backfill cs_booking_handovers
      await queryInterface.sequelize.query(
        `UPDATE cs_booking_handovers bh
         SET project_id = b."projectId"
         FROM pr_flat_land_bookings b
         WHERE bh.booking_id = b.uuid
           AND bh.project_id IS NULL;`,
        { transaction },
      );
      await queryInterface.sequelize.query(
        `UPDATE cs_booking_handovers bh
         SET organization_id = COALESCE(u.org_id, 1)
         FROM sys_users u
         WHERE bh.created_by = u.id
           AND bh.organization_id IS NULL;`,
        { transaction },
      );
      await queryInterface.sequelize.query(
        `UPDATE cs_booking_handovers SET organization_id = 1 WHERE organization_id IS NULL;`,
        { transaction },
      );

      // Backfill cs_change_requests
      // A. If booking_id is provided, derive project_id from pr_flat_land_bookings
      await queryInterface.sequelize.query(
        `UPDATE cs_change_requests cr
         SET project_id = b."projectId"
         FROM pr_flat_land_bookings b
         WHERE cr.booking_id = b.uuid
           AND cr.project_id IS NULL;`,
        { transaction },
      );

      // B. If project_id is still NULL and project string exists, match against project table
      await queryInterface.sequelize.query(
        `UPDATE cs_change_requests cr
         SET project_id = p.uuid
         FROM project p
         WHERE cr.project_id IS NULL
           AND cr.project IS NOT NULL
           AND (p.name ILIKE cr.project OR p.code ILIKE cr.project);`,
        { transaction },
      );

      // C. Set organization_id from creator user (fallback to 1)
      await queryInterface.sequelize.query(
        `UPDATE cs_change_requests cr
         SET organization_id = COALESCE(u.org_id, 1)
         FROM sys_users u
         WHERE cr.created_by = u.id
           AND cr.organization_id IS NULL;`,
        { transaction },
      );
      await queryInterface.sequelize.query(
        `UPDATE cs_change_requests SET organization_id = 1 WHERE organization_id IS NULL;`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    const targetTables = [
      {
        name: 'cs_customer_profiles',
        indexName: 'idx_cs_customer_profiles_org_proj',
      },
      {
        name: 'cs_booking_handovers',
        indexName: 'idx_cs_booking_handovers_org_proj',
      },
      {
        name: 'cs_change_requests',
        indexName: 'idx_cs_change_requests_org_proj',
      },
    ];

    for (const target of targetTables) {
      try {
        await queryInterface.removeIndex(target.name, target.indexName);
      } catch (e) {}

      try {
        await queryInterface.removeColumn(target.name, 'project_id');
      } catch (e) {}

      try {
        await queryInterface.removeColumn(target.name, 'organization_id');
      } catch (e) {}
    }
  },
};
