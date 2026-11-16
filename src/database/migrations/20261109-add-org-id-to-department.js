module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('hrm_department');

    // `department` is a compatibility view over `hrm_department` in the
    // deployed database. Add the model's mapped column to the source table.
    if (!columns.org_id) {
      await queryInterface.addColumn('hrm_department', 'org_id', {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'sys_organizations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    // Keep the compatibility view in sync with the Department model.
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW department AS
      SELECT id, uuid, created_at, updated_at, deleted_at, name,
        "departmentHeadId", "addedById", "createdBy", "updatedBy",
        "deletedBy", status, org_id
      FROM hrm_department
    `);
  },

  down: async (queryInterface) => {
    // Restore the original compatibility view before removing its source
    // column, otherwise PostgreSQL rejects the DROP COLUMN operation.
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW department AS
      SELECT id, uuid, created_at, updated_at, deleted_at, name,
        "departmentHeadId", "addedById", "createdBy", "updatedBy",
        "deletedBy", status
      FROM hrm_department
    `);

    const columns = await queryInterface.describeTable('hrm_department');
    if (columns.org_id) {
      await queryInterface.removeColumn('hrm_department', 'org_id');
    }
  },
};
