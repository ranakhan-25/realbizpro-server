'use strict';

module.exports = {
  up: async (queryInterface) => {
    const table = 'pr_project_billing_records';
    const columns = await queryInterface.describeTable(table);

    if (columns.project_id && columns.projectId) {
      await queryInterface.sequelize.query(
        'UPDATE "pr_project_billing_records" SET "project_id" = COALESCE("project_id", "projectId") WHERE "project_id" IS NULL',
      );
      await queryInterface.removeColumn(table, 'projectId');
    }

    const updatedColumns = await queryInterface.describeTable(table);
    if (updatedColumns.project_id) {
      const [rows] = await queryInterface.sequelize.query(
        'SELECT COUNT(*)::int AS missing FROM "pr_project_billing_records" WHERE "project_id" IS NULL',
      );
      if (Number(rows[0]?.missing) > 0) {
        throw new Error('Cannot require project_id: existing billing rows have no project.');
      }
      await queryInterface.sequelize.query(
        'ALTER TABLE "pr_project_billing_records" ALTER COLUMN "project_id" SET NOT NULL',
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'pr_project_billing_records';
    const columns = await queryInterface.describeTable(table);
    if (columns.project_id && !columns.projectId) {
      await queryInterface.sequelize.query(
        'ALTER TABLE "pr_project_billing_records" ALTER COLUMN "project_id" DROP NOT NULL',
      );
      await queryInterface.addColumn(table, 'projectId', {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'project',
          key: 'uuid',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      await queryInterface.sequelize.query(
        'UPDATE "pr_project_billing_records" SET "projectId" = "project_id"',
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE "pr_project_billing_records" ALTER COLUMN "projectId" SET NOT NULL',
      );
    }
  },
};
