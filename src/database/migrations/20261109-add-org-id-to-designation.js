module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('hrm_designation');

    // `designation` is a compatibility view over `hrm_designation` in the
    // deployed database, so keep the model's orgId mapping on the source table.
    if (!columns.org_id) {
      await queryInterface.addColumn('hrm_designation', 'org_id', {
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

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW designation AS
      SELECT id, uuid, created_at, updated_at, deleted_at, name,
        "departmentId", "addedById", "createdBy", "updatedBy",
        "deletedBy", status, org_id
      FROM hrm_designation
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE VIEW designation AS
      SELECT id, uuid, created_at, updated_at, deleted_at, name,
        "departmentId", "addedById", "createdBy", "updatedBy",
        "deletedBy", status
      FROM hrm_designation
    `);

    const columns = await queryInterface.describeTable('hrm_designation');
    if (columns.org_id) {
      await queryInterface.removeColumn('hrm_designation', 'org_id');
    }
  },
};
