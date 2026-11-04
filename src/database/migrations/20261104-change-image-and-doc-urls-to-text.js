'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('share_project_images', 'url', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn('share_project_documents', 'url', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.changeColumn('share_projects', 'thumbnail_url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('share_project_images', 'url', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('share_project_documents', 'url', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('share_projects', 'thumbnail_url', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};

