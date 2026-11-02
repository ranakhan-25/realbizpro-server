'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('share_project_investments')) {
        await queryInterface.createTable('share_project_investments', {
          id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
          uuid: { type: Sequelize.UUID, allowNull: false, unique: true, defaultValue: Sequelize.UUIDV4 },
          project_uuid: { type: Sequelize.UUID, allowNull: false, references: { model: 'share_projects', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
          investor_id: { type: Sequelize.BIGINT, allowNull: false, references: { model: 'share_users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT' },
          quantity: { type: Sequelize.INTEGER, allowNull: false },
          share_price: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          share_value: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          service_fee: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          total_amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
          status: { type: Sequelize.ENUM('prepared', 'confirmed', 'cancelled'), allowNull: false, defaultValue: 'prepared' },
          created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
          deleted_at: { type: Sequelize.DATE, allowNull: true },
        }, { transaction });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('share_project_investments').catch(() => {});
  },
};
