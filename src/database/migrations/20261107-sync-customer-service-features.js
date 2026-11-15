'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Migration: Sync Customer Service Module Features & Permissions
 * 1. Remove CS_PAY_SCHEDULES (Payments & Collections | Payment Schedules & Demand Letters)
 *    and clean associated role permissions, permissions, role features, and menus without orphans.
 * 2. Add 6 new Building Services and Building Management features with READ, WRITE, ALL operations:
 *    - Building Services | Utility Service (CS_BLD_UTILITY)
 *    - Building Services | Security Service (CS_BLD_SECURITY)
 *    - Building Services | Parking Service (CS_BLD_PARKING)
 *    - Building Services | Other Services (CS_BLD_OTHER)
 *    - Building Management | Service Charge & Costing (CS_MGMT_SERVICE_CHARGE)
 *    - Building Management | Building Committee (CS_MGMT_COMMITTEE)
 * 3. Assign new permissions to Super Admin and Org Admin roles by default.
 * 4. Idempotent and safe to re-run.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      // 1. Locate the CUSTOMER_SERVICE module
      const [modules] = await queryInterface.sequelize.query(
        `SELECT id, name, code, path_route FROM sys_modules WHERE code = 'CUSTOMER_SERVICE' OR name = 'Customer Service' LIMIT 1`,
        { transaction: tx }
      );

      if (!modules || modules.length === 0) {
        console.warn('Customer Service module not found in sys_modules. Skipping feature sync.');
        return;
      }

      const moduleId = modules[0].id;

      // 2. Remove deprecated feature CS_PAY_SCHEDULES and clean up all dependencies
      const [paySchedFeats] = await queryInterface.sequelize.query(
        `SELECT id FROM sys_features WHERE code = 'CS_PAY_SCHEDULES' OR route_path = '/dashboard/customer-service/payments/schedules-demand-letters'`,
        { transaction: tx }
      );

      for (const feat of paySchedFeats) {
        const featureId = feat.id;

        // Clean sys_role_permissions referencing permissions of this feature
        await queryInterface.sequelize.query(
          `DELETE FROM sys_role_permissions 
           WHERE permission_id IN (SELECT id FROM sys_permissions WHERE feature_id = :featureId OR key LIKE 'cs_pay_schedules.%')`,
          { replacements: { featureId }, transaction: tx }
        );

        // Clean sys_permissions
        await queryInterface.sequelize.query(
          `DELETE FROM sys_permissions WHERE feature_id = :featureId OR key LIKE 'cs_pay_schedules.%'`,
          { replacements: { featureId }, transaction: tx }
        );

        // Clean sys_role_features
        await queryInterface.sequelize.query(
          `DELETE FROM sys_role_features WHERE feature_id = :featureId`,
          { replacements: { featureId }, transaction: tx }
        );

        // Clean sys_org_entitlements
        await queryInterface.sequelize.query(
          `DELETE FROM sys_org_entitlements WHERE feature_id = :featureId`,
          { replacements: { featureId }, transaction: tx }
        );

        // Clean sys_user_feature_overrides
        await queryInterface.sequelize.query(
          `DELETE FROM sys_user_feature_overrides WHERE feature_id = :featureId`,
          { replacements: { featureId }, transaction: tx }
        );

        // Clean sys_menus
        await queryInterface.sequelize.query(
          `DELETE FROM sys_menus WHERE module_id = :moduleId AND (url = '/dashboard/customer-service/payments/schedules-demand-letters' OR title ILIKE '%Payment Schedules%')`,
          { replacements: { moduleId }, transaction: tx }
        );

        // Clean sys_features
        await queryInterface.sequelize.query(
          `DELETE FROM sys_features WHERE id = :featureId`,
          { replacements: { featureId }, transaction: tx }
        );

        console.log(`Successfully removed feature CS_PAY_SCHEDULES (ID: ${featureId}) and all dependent rows.`);
      }

      // 3. Define the 6 new features
      const newFeatures = [
        {
          name: 'Building Services | Utility Service',
          code: 'CS_BLD_UTILITY',
          route_path: '/dashboard/customer-service/utility-service',
          actions: ['read', 'write', 'all'],
          display_order: 25,
          icon: 'Zap',
        },
        {
          name: 'Building Services | Security Service',
          code: 'CS_BLD_SECURITY',
          route_path: '/dashboard/customer-service/security-service',
          actions: ['read', 'write', 'all'],
          display_order: 26,
          icon: 'ShieldCheck',
        },
        {
          name: 'Building Services | Parking Service',
          code: 'CS_BLD_PARKING',
          route_path: '/dashboard/customer-service/parking-service',
          actions: ['read', 'write', 'all'],
          display_order: 27,
          icon: 'Car',
        },
        {
          name: 'Building Services | Other Services',
          code: 'CS_BLD_OTHER',
          route_path: '/dashboard/customer-service/other-services',
          actions: ['read', 'write', 'all'],
          display_order: 28,
          icon: 'Layers',
        },
        {
          name: 'Building Management | Service Charge & Costing',
          code: 'CS_MGMT_SERVICE_CHARGE',
          route_path: '/dashboard/customer-service/service-charge',
          actions: ['read', 'write', 'all'],
          display_order: 29,
          icon: 'Receipt',
        },
        {
          name: 'Building Management | Building Committee',
          code: 'CS_MGMT_COMMITTEE',
          route_path: '/dashboard/customer-service/building-committee',
          actions: ['read', 'write', 'all'],
          display_order: 30,
          icon: 'Users',
        },
      ];

      // Fetch admin roles (super-admin and org-admin)
      const [adminRoles] = await queryInterface.sequelize.query(
        `SELECT id, slug FROM sys_roles WHERE slug IN ('super-admin', 'org-admin')`,
        { transaction: tx }
      );

      for (const feat of newFeatures) {
        // Upsert feature in sys_features
        const [existing] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_features WHERE code = :code`,
          { replacements: { code: feat.code }, transaction: tx }
        );

        let featureId;
        const now = new Date();
        const actionsJson = JSON.stringify(feat.actions);

        if (existing && existing.length > 0) {
          featureId = existing[0].id;
          await queryInterface.sequelize.query(
            `UPDATE sys_features 
             SET name = :name, route_path = :routePath, actions = :actions::jsonb, 
                 display_order = :displayOrder, is_active = true, updated_at = :now, module_id = :moduleId
             WHERE id = :featureId`,
            {
              replacements: {
                name: feat.name,
                routePath: feat.route_path,
                actions: actionsJson,
                displayOrder: feat.display_order,
                now,
                moduleId,
                featureId,
              },
              transaction: tx,
            }
          );
        } else {
          const featUuid = uuidv4();
          const [inserted] = await queryInterface.sequelize.query(
            `INSERT INTO sys_features (uuid, module_id, name, code, route_path, actions, display_order, is_active, created_at, updated_at)
             VALUES (:uuid, :moduleId, :name, :code, :routePath, :actions::jsonb, :displayOrder, true, :now, :now)
             RETURNING id`,
            {
              replacements: {
                uuid: featUuid,
                moduleId,
                name: feat.name,
                code: feat.code,
                routePath: feat.route_path,
                actions: actionsJson,
                displayOrder: feat.display_order,
                now,
              },
              transaction: tx,
            }
          );
          featureId = inserted[0].id;
        }

        // Upsert sys_menus entry
        const [existingMenu] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_menus WHERE module_id = :moduleId AND url = :url`,
          { replacements: { moduleId, url: feat.route_path }, transaction: tx }
        );

        const locationJson = JSON.stringify(['sidebar']);

        if (existingMenu && existingMenu.length > 0) {
          await queryInterface.sequelize.query(
            `UPDATE sys_menus 
             SET title = :title, "order" = :displayOrder, location = :location::jsonb, is_visible = true, updated_at = :now
             WHERE id = :menuId`,
            {
              replacements: {
                title: feat.name,
                displayOrder: feat.display_order,
                location: locationJson,
                now,
                menuId: existingMenu[0].id,
              },
              transaction: tx,
            }
          );
        } else {
          const menuUuid = uuidv4();
          await queryInterface.sequelize.query(
            `INSERT INTO sys_menus (uuid, module_id, title, url, target, location, icon, "order", is_visible, element_class, created_at, updated_at)
             VALUES (:uuid, :moduleId, :title, :url, '_self', :location::jsonb, :icon, :displayOrder, true, 'all', :now, :now)`,
            {
              replacements: {
                uuid: menuUuid,
                moduleId,
                title: feat.name,
                url: feat.route_path,
                location: locationJson,
                icon: feat.icon,
                displayOrder: feat.display_order,
                now,
              },
              transaction: tx,
            }
          );
        }

        // Generate standard operations in sys_permissions (READ, WRITE, ALL)
        const subName = feat.name.split('|').pop().trim();
        const codePrefix = feat.code.toLowerCase();

        const operations = [
          {
            key: `${codePrefix}.read`,
            name: `View ${subName}`,
            description: `Permission to read ${subName}`,
            action: 'read',
          },
          {
            key: `${codePrefix}.write`,
            name: `Create/Edit ${subName}`,
            description: `Permission to write ${subName}`,
            action: 'create',
          },
          {
            key: `${codePrefix}.all`,
            name: `Full Access ${subName}`,
            description: `Full administrative control on ${subName}`,
            action: 'update',
          },
        ];

        for (const op of operations) {
          const [existingPerm] = await queryInterface.sequelize.query(
            `SELECT id FROM sys_permissions WHERE key = :key`,
            { replacements: { key: op.key }, transaction: tx }
          );

          let permId;
          if (existingPerm && existingPerm.length > 0) {
            permId = existingPerm[0].id;
            await queryInterface.sequelize.query(
              `UPDATE sys_permissions 
               SET name = :name, description = :description, resource = :resource, action = :action::enum_sys_permissions_action, feature_id = :featureId, updated_at = :now
               WHERE id = :permId`,
              {
                replacements: {
                  name: op.name,
                  description: op.description,
                  resource: codePrefix,
                  action: op.action,
                  featureId,
                  now,
                  permId,
                },
                transaction: tx,
              }
            );
          } else {
            const permUuid = uuidv4();
            const [insertedPerm] = await queryInterface.sequelize.query(
              `INSERT INTO sys_permissions (uuid, key, name, description, resource, action, context, feature_id, created_at, updated_at)
               VALUES (:uuid, :key, :name, :description, :resource, :action::enum_sys_permissions_action, 'any'::enum_sys_permissions_context, :featureId, :now, :now)
               RETURNING id`,
              {
                replacements: {
                  uuid: permUuid,
                  key: op.key,
                  name: op.name,
                  description: op.description,
                  resource: codePrefix,
                  action: op.action,
                  featureId,
                  now,
                },
                transaction: tx,
              }
            );
            permId = insertedPerm[0].id;
          }

          // Assign permission to admin roles (super-admin and org-admin)
          for (const role of adminRoles) {
            const [hasRolePerm] = await queryInterface.sequelize.query(
              `SELECT id FROM sys_role_permissions WHERE role_id = :roleId AND permission_id = :permId`,
              { replacements: { roleId: role.id, permId }, transaction: tx }
            );

            if (!hasRolePerm || hasRolePerm.length === 0) {
              const rpUuid = uuidv4();
              await queryInterface.sequelize.query(
                `INSERT INTO sys_role_permissions (uuid, role_id, permission_id, created_at, updated_at)
                 VALUES (:uuid, :roleId, :permId, :now, :now)`,
                {
                  replacements: {
                    uuid: rpUuid,
                    roleId: role.id,
                    permId,
                    now,
                  },
                  transaction: tx,
                }
              );
            }
          }
        }

        // Grant sys_role_features to admin roles
        for (const role of adminRoles) {
          const [hasRoleFeat] = await queryInterface.sequelize.query(
            `SELECT id FROM sys_role_features WHERE role_id = :roleId AND feature_id = :featureId`,
            { replacements: { roleId: role.id, featureId }, transaction: tx }
          );

          if (hasRoleFeat && hasRoleFeat.length > 0) {
            await queryInterface.sequelize.query(
              `UPDATE sys_role_features 
               SET can_view = true, can_create = true, can_edit = true, can_delete = true, can_approve = true, updated_at = :now
               WHERE id = :rfId`,
              { replacements: { now, rfId: hasRoleFeat[0].id }, transaction: tx }
            );
          } else {
            const rfUuid = uuidv4();
            await queryInterface.sequelize.query(
              `INSERT INTO sys_role_features (uuid, role_id, feature_id, can_view, can_create, can_edit, can_delete, can_approve, created_at, updated_at)
               VALUES (:uuid, :roleId, :featureId, true, true, true, true, true, :now, :now)`,
              {
                replacements: {
                  uuid: rfUuid,
                  roleId: role.id,
                  featureId,
                  now,
                },
                transaction: tx,
              }
            );
          }
        }
      }

      console.log('Customer Service features, permissions, and role associations synchronized successfully!');
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      const featureCodes = [
        'CS_BLD_UTILITY',
        'CS_BLD_SECURITY',
        'CS_BLD_PARKING',
        'CS_BLD_OTHER',
        'CS_MGMT_SERVICE_CHARGE',
        'CS_MGMT_COMMITTEE',
      ];

      for (const code of featureCodes) {
        const [feats] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_features WHERE code = :code`,
          { replacements: { code }, transaction: tx }
        );

        if (feats && feats.length > 0) {
          const featureId = feats[0].id;
          await queryInterface.sequelize.query(
            `DELETE FROM sys_role_permissions WHERE permission_id IN (SELECT id FROM sys_permissions WHERE feature_id = :featureId)`,
            { replacements: { featureId }, transaction: tx }
          );
          await queryInterface.sequelize.query(
            `DELETE FROM sys_permissions WHERE feature_id = :featureId`,
            { replacements: { featureId }, transaction: tx }
          );
          await queryInterface.sequelize.query(
            `DELETE FROM sys_role_features WHERE feature_id = :featureId`,
            { replacements: { featureId }, transaction: tx }
          );
          await queryInterface.sequelize.query(
            `DELETE FROM sys_features WHERE id = :featureId`,
            { replacements: { featureId }, transaction: tx }
          );
        }
      }
    });
  },
};
