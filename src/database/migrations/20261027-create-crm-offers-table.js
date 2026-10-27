'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tables = await queryInterface.showAllTables();
    if (tables.includes('crm_offers')) return;

    await queryInterface.createTable('crm_offers', {
      id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      name: { type: Sequelize.STRING(200), allowNull: false },
      status: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'active' },
      description: { type: Sequelize.TEXT, allowNull: true },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true },
      deleted_by: { type: Sequelize.STRING, allowNull: true },
      project_id: { type: Sequelize.STRING, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crm_offers');
  },
};
