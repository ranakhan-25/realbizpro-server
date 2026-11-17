'use strict';

/**
 * Keep the legacy `booking` table compatible with the BookingDetails model.
 * The create-booking model predates these optional detail fields, so existing
 * databases do not contain them.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('booking');
    const columns = {
      property_category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      property_size: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      property_facing: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      property_plot_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paid_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
        defaultValue: 0,
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    };

    for (const [name, definition] of Object.entries(columns)) {
      if (!table[name]) {
        await queryInterface.addColumn('booking', name, definition);
      }
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('booking');
    for (const name of [
      'property_category',
      'property_size',
      'property_facing',
      'property_plot_no',
      'duration',
      'paid_amount',
      'payment_status',
      'transaction_id',
    ]) {
      if (table[name]) {
        await queryInterface.removeColumn('booking', name);
      }
    }
  },
};
