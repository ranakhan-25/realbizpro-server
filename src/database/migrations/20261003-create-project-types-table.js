'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface
      .showAllTables()
      .then((tables) =>
        tables.includes('project_types'),
      );

    if (!tableExists) {
      await queryInterface.createTable(
        'project_types',
        {
          id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          uuid: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: true,
            defaultValue: Sequelize.literal(
              'gen_random_uuid()',
            ),
          },
          code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
              'CURRENT_TIMESTAMP',
            ),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
              'CURRENT_TIMESTAMP',
            ),
          },
          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface
      .dropTable('project_types')
      .catch(() => {});
  },
};
