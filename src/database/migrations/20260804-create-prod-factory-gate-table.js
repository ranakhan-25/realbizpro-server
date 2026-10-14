'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create enum type for gate status
    await queryInterface.sequelize
      .query(
        `DO $$ BEGIN
           CREATE TYPE "enum_prod_factory_gate_status" AS ENUM ('Active', 'Inactive');
         EXCEPTION
           WHEN duplicate_object THEN null;
         END $$;`,
      )
      .catch(() => {});

    // 2. Create prod_factory_gate table if it doesn't exist
    const tableExists = await queryInterface
      .showAllTables()
      .then((tables) =>
        tables.includes('prod_factory_gate'),
      );
    if (!tableExists) {
      await queryInterface.createTable(
        'prod_factory_gate',
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
          factory_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            references: {
              model: 'prod_factory',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM(
              'Active',
              'Inactive',
            ),
            allowNull: false,
            defaultValue: 'Active',
          },
          created_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          deleted_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
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

      await queryInterface.addIndex(
        'prod_factory_gate',
        ['factory_id'],
        { name: 'prod_factory_gate_factory_id' },
      );
    }
  },

  async down(queryInterface) {
    await queryInterface
      .dropTable('prod_factory_gate')
      .catch(() => {});
    await queryInterface.sequelize
      .query(
        `DROP TYPE IF EXISTS "enum_prod_factory_gate_status"`,
      )
      .catch(() => {});
  },
};
