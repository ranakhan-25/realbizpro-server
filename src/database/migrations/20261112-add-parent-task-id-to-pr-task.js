'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('pr_task');
    if (columns.parent_task_id) return;

    await queryInterface.addColumn('pr_task', 'parent_task_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'pr_task', key: 'uuid' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addIndex('pr_task', ['parent_task_id'], {
      name: 'pr_task_parent_task_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('pr_task', 'pr_task_parent_task_id_idx').catch(() => {});
    const columns = await queryInterface.describeTable('pr_task');
    if (columns.parent_task_id) {
      await queryInterface.removeColumn('pr_task', 'parent_task_id');
    }
  },
};
