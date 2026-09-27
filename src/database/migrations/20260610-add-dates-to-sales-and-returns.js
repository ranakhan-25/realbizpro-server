module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfoItem = await queryInterface.describeTable('pos_sale_item').catch(() => ({}));
    if (!tableInfoItem.sale_date) {
      await queryInterface.addColumn('pos_sale_item', 'sale_date', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    const tableInfoReturn = await queryInterface.describeTable('pos_sale_return').catch(() => ({}));
    if (!tableInfoReturn.return_date) {
      await queryInterface.addColumn('pos_sale_return', 'return_date', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    const tableInfoReturnItem = await queryInterface.describeTable('pos_sale_return_item').catch(() => ({}));
    if (!tableInfoReturnItem.return_date) {
      await queryInterface.addColumn('pos_sale_return_item', 'return_date', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    // 2. Populate existing rows from parent tables
    await queryInterface.sequelize.query(`
      UPDATE pos_sale_item psi
      SET sale_date = ps.sale_date
      FROM pos_sale ps
      WHERE psi.sale_id = ps.id;
    `);

    await queryInterface.sequelize.query(`
      UPDATE pos_sale_return
      SET return_date = created_at;
    `);

    await queryInterface.sequelize.query(`
      UPDATE pos_sale_return_item psri
      SET return_date = psr.created_at
      FROM pos_sale_return psr
      WHERE psri.return_id = psr.id;
    `);

    // 3. Fallback for any orphans to ensure no nulls exist before altering
    await queryInterface.sequelize.query(`
      UPDATE pos_sale_item SET sale_date = NOW() WHERE sale_date IS NULL;
    `);
    await queryInterface.sequelize.query(`
      UPDATE pos_sale_return SET return_date = NOW() WHERE return_date IS NULL;
    `);
    await queryInterface.sequelize.query(`
      UPDATE pos_sale_return_item SET return_date = NOW() WHERE return_date IS NULL;
    `);

    // 4. Change columns to NOT NULL
    await queryInterface.changeColumn('pos_sale_item', 'sale_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('pos_sale_return', 'return_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.changeColumn('pos_sale_return_item', 'return_date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('pos_sale_item', 'sale_date');
    await queryInterface.removeColumn('pos_sale_return', 'return_date');
    await queryInterface.removeColumn('pos_sale_return_item', 'return_date');
  }
};
