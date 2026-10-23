module.exports = {
  up: async (queryInterface, Sequelize) => {
    const base = {
      id: { type: Sequelize.BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      uuid: { type: Sequelize.UUID, allowNull: false, unique: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    };
    await queryInterface.createTable('parties', {
      ...base,
      code: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(200), allowNull: false },
      type: { type: Sequelize.ENUM('Vendor', 'Customer', 'Contractor', 'Subcontractor', 'Other'), allowNull: false },
      contact_person: { type: Sequelize.STRING(200), allowNull: true },
      phone: { type: Sequelize.STRING(40), allowNull: true },
      email: { type: Sequelize.STRING(200), allowNull: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      city: { type: Sequelize.STRING(120), allowNull: true },
      state: { type: Sequelize.STRING(120), allowNull: true },
      country: { type: Sequelize.STRING(120), allowNull: true },
      whatsapp: { type: Sequelize.STRING(40), allowNull: true },
      trade_license_no: { type: Sequelize.STRING(120), allowNull: true },
      trade_license_expiry: { type: Sequelize.DATEONLY, allowNull: true },
      nid_no: { type: Sequelize.STRING(120), allowNull: true },
      tin_no: { type: Sequelize.STRING(120), allowNull: true },
      bin_no: { type: Sequelize.STRING(120), allowNull: true },
      owner_name: { type: Sequelize.STRING(200), allowNull: true },
      business_type: { type: Sequelize.ENUM('Individual', 'Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'NGO', 'Other'), allowNull: true },
      bank_name: { type: Sequelize.STRING(200), allowNull: true },
      account_no: { type: Sequelize.STRING(120), allowNull: true },
      branch: { type: Sequelize.STRING(120), allowNull: true },
      accounting_group: { type: Sequelize.STRING(200), allowNull: true },
      payable_account: { type: Sequelize.STRING(200), allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
    });
    await queryInterface.createTable('party_documents', {
      ...base,
      party_id: { type: Sequelize.UUID, allowNull: false, references: { model: 'parties', key: 'uuid' }, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
      title: { type: Sequelize.STRING(200), allowNull: false },
      file: { type: Sequelize.TEXT, allowNull: false },
    });
    await queryInterface.addIndex('parties', ['type']);
    await queryInterface.addIndex('parties', ['status']);
    await queryInterface.addIndex('party_documents', ['party_id']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('party_documents');
    await queryInterface.dropTable('parties');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_parties_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_parties_business_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_parties_status";');
  },
};
