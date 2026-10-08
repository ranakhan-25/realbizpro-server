'use strict';

const { intelligentUpsert } = require('../seeder.helper');
const { v4: uuidv4 } = require('uuid');

const modulesData = [
  {
    uuid: uuidv4(),
    name: 'HRMS',
    description: 'HRMS module with all related features',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    uuid: uuidv4(),
    name: 'POS',
    description: 'POS module with all related features',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    uuid: uuidv4(),
    name: 'Production',
    description: 'Production module with all related features',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    uuid: uuidv4(),
    name: 'System',
    description: 'System module with all related features',
    created_at: new Date(),
    updated_at: new Date(),
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const tableName = 'sys_modules';
    const uniqueKey = 'name';
    await intelligentUpsert(queryInterface, tableName, modulesData, uniqueKey);
  },

  async down(queryInterface) {
    const moduleNames = modulesData.map(m => m.name);
    await queryInterface.bulkDelete('sys_modules', { name: moduleNames });
  },
};