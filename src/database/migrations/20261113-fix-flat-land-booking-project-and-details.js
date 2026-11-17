'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const table of ['pr_flat_land', 'pr_flat_land_bookings']) {
      const columns = await queryInterface.describeTable(table);
      if (columns.project_id && columns.projectId) {
        await queryInterface.sequelize.query(
          `UPDATE "${table}" SET "project_id" = COALESCE("project_id", "projectId") WHERE "project_id" IS NULL`,
        );
        await queryInterface.removeColumn(table, 'projectId');
      }
    }

    const bookingColumns = await queryInterface.describeTable('pr_flat_land_bookings');
    if (bookingColumns.project_id) {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT COUNT(*)::int AS missing FROM "pr_flat_land_bookings" WHERE "project_id" IS NULL',
      );
      if (Number(rows[0]?.missing) > 0) {
        throw new Error('Cannot require project_id: existing bookings have no project.');
      }
      await queryInterface.sequelize.query(
        'ALTER TABLE "pr_flat_land_bookings" ALTER COLUMN "project_id" SET NOT NULL',
      );
    }

    if (!bookingColumns.details) {
      await queryInterface.addColumn('pr_flat_land_bookings', 'details', {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const bookingColumns = await queryInterface.describeTable('pr_flat_land_bookings');
    if (bookingColumns.details) {
      await queryInterface.removeColumn('pr_flat_land_bookings', 'details');
    }

    for (const table of ['pr_flat_land', 'pr_flat_land_bookings']) {
      const columns = await queryInterface.describeTable(table);
      if (columns.project_id && !columns.projectId) {
        if (table === 'pr_flat_land_bookings') {
          await queryInterface.sequelize.query(
            'ALTER TABLE "pr_flat_land_bookings" ALTER COLUMN "project_id" DROP NOT NULL',
          );
        }
        await queryInterface.addColumn(table, 'projectId', {
          type: Sequelize.UUID,
          allowNull: true,
          references: { model: 'project', key: 'uuid' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        });
        await queryInterface.sequelize.query(
          `UPDATE "${table}" SET "projectId" = "project_id"`,
        );
        if (table === 'pr_flat_land_bookings') {
          await queryInterface.sequelize.query(
            'ALTER TABLE "pr_flat_land_bookings" ALTER COLUMN "projectId" SET NOT NULL',
          );
        }
      }
    }
  },
};
