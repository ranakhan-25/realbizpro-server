'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 1. Get or create Wholesale Management feature ID
    const [features] = await queryInterface.sequelize.query(
      `SELECT id FROM sys_features WHERE name = 'Wholesale Management' LIMIT 1`,
    );

    let featureId = features[0]?.id;

    if (!featureId) {
      const [posModules] = await queryInterface.sequelize.query(
        `SELECT id FROM sys_modules WHERE name = 'POS' LIMIT 1`,
      );
      const moduleId = posModules[0]?.id || null;

      const [newFeature] = await queryInterface.sequelize.query(
        `INSERT INTO sys_features (uuid, name, description, module_id, created_at, updated_at)
         VALUES ('${uuidv4()}', 'Wholesale Management', 'Wholesale POS, Delivery Tracking, Courier COD Collections & Config', ${moduleId ? moduleId : 'NULL'}, NOW(), NOW())
         RETURNING id;`,
      );
      featureId = newFeature[0]?.id;
    }

    const wholesalePermissions = [
      {
        uuid: uuidv4(),
        key: 'create_wholesale_sale',
        name: 'Create Wholesale Sale',
        resource: 'wholesale_sale',
        action: 'create',
        context: 'any',
        description: 'Allows creating new wholesale POS sales orders',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_wholesale_sale',
        name: 'View Wholesale Sale',
        resource: 'wholesale_sale',
        action: 'read',
        context: 'any',
        description: 'Allows viewing wholesale sales orders & reports',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'update_wholesale_delivery',
        name: 'Update Wholesale Delivery',
        resource: 'wholesale_sale',
        action: 'update',
        context: 'any',
        description: 'Allows updating delivery status & return penalty fees',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_wholesale_payment',
        name: 'Create Wholesale Payment',
        resource: 'wholesale_sale',
        action: 'create',
        context: 'any',
        description: 'Allows adding partial payments to wholesale sales',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_wholesale_config',
        name: 'View Wholesale Config',
        resource: 'wholesale_config',
        action: 'read',
        context: 'any',
        description: 'Allows viewing wholesale policy settings',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'manage_wholesale_config',
        name: 'Manage Wholesale Config',
        resource: 'wholesale_config',
        action: 'update',
        context: 'any',
        description: 'Allows updating wholesale policy settings',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_courier_config',
        name: 'View Courier Config',
        resource: 'courier',
        action: 'read',
        context: 'any',
        description: 'Allows viewing active courier list',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'manage_courier_config',
        name: 'Manage Courier Config',
        resource: 'courier',
        action: 'update',
        context: 'any',
        description: 'Allows creating, editing, and deleting courier partners',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'view_courier_collection',
        name: 'View Courier Collection',
        resource: 'courier_collection',
        action: 'read',
        context: 'any',
        description: 'Allows viewing courier COD dues and collection requests',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'create_courier_collection',
        name: 'Create Courier Collection',
        resource: 'courier_collection',
        action: 'create',
        context: 'any',
        description: 'Allows submitting courier COD collection requests',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        uuid: uuidv4(),
        key: 'approve_courier_collection',
        name: 'Approve Courier Collection',
        resource: 'courier_collection',
        action: 'update',
        context: 'any',
        description: 'Allows approving or rejecting courier COD cash remittances',
        feature_id: featureId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // Insert permissions ignoring duplicates
    for (const perm of wholesalePermissions) {
      await queryInterface.sequelize.query(
        `INSERT INTO sys_permissions (uuid, key, name, resource, action, context, description, feature_id, created_at, updated_at)
         VALUES ('${perm.uuid}', '${perm.key}', '${perm.name}', '${perm.resource}', '${perm.action}', '${perm.context}', '${perm.description}', ${perm.feature_id}, NOW(), NOW())
         ON CONFLICT (key) DO NOTHING;`,
      );
    }

    // Attach all to Super Admin role (ID = 1)
    await queryInterface.sequelize.query(
      `INSERT INTO sys_role_permissions (uuid, role_id, permission_id, created_at, updated_at)
       SELECT gen_random_uuid(), 1, p.id, NOW(), NOW()
       FROM sys_permissions p
       WHERE p.key IN (
         'create_wholesale_sale',
         'view_wholesale_sale',
         'update_wholesale_delivery',
         'create_wholesale_payment',
         'view_wholesale_config',
         'manage_wholesale_config',
         'view_courier_config',
         'manage_courier_config',
         'view_courier_collection',
         'create_courier_collection',
         'approve_courier_collection'
       )
       ON CONFLICT DO NOTHING;`,
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM sys_permissions WHERE key LIKE '%wholesale%' OR key LIKE '%courier%';`,
    );
  },
};
