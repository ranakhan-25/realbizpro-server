'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plans = [
      {
        uuid: uuidv4(),
        name: 'Free Trial',
        code: 'TRIAL',
        description: '14-day trial with full feature evaluation access for new businesses',
        monthly_price: 0.00,
        yearly_price: 0.00,
        billing_cycle: 'monthly',
        duration_days: 14,
        trial_days: 14,
        max_users: 5,
        max_projects: 3,
        max_storage_mb: 2048,
        features: JSON.stringify(['all_features', 'crm', 'procurement', 'projects', 'hrm']),
        status: 'active',
        subscribers_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        name: 'Starter Plan',
        code: 'STARTER',
        description: 'Designed for boutique builders, architects, and small real estate teams',
        monthly_price: 49.00,
        yearly_price: 490.00,
        billing_cycle: 'monthly',
        duration_days: 30,
        trial_days: 0,
        max_users: 15,
        max_projects: 10,
        max_storage_mb: 10240,
        features: JSON.stringify(['crm', 'projects', 'basic_reporting', 'lead_tracking']),
        status: 'active',
        subscribers_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        name: 'Professional Plan',
        code: 'PRO',
        description: 'Comprehensive ERP suite for growing property developers and agencies',
        monthly_price: 129.00,
        yearly_price: 1290.00,
        billing_cycle: 'monthly',
        duration_days: 30,
        trial_days: 0,
        max_users: 50,
        max_projects: 50,
        max_storage_mb: 51200,
        features: JSON.stringify(['crm', 'procurement', 'projects', 'investor_management', 'billing', 'advanced_reporting']),
        status: 'active',
        subscribers_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        name: 'Enterprise Plan',
        code: 'ENTERPRISE',
        description: 'High capacity infrastructure, custom workflows, and dedicated account support',
        monthly_price: 299.00,
        yearly_price: 2990.00,
        billing_cycle: 'monthly',
        duration_days: 30,
        trial_days: 0,
        max_users: 250,
        max_projects: 200,
        max_storage_mb: 204800,
        features: JSON.stringify(['all_features', 'custom_delegation', 'api_access', 'audit_logs', 'priority_sla']),
        status: 'active',
        subscribers_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    for (const plan of plans) {
      const existing = await queryInterface.rawSelect(
        'sys_plans',
        {
          where: { code: plan.code },
        },
        ['id'],
      );

      if (!existing) {
        await queryInterface.bulkInsert('sys_plans', [plan]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sys_plans', {
      code: ['TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'],
    });
  },
};
