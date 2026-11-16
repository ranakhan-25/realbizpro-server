'use strict';

const { v4: uuidv4 } = require('uuid');

/**
 * Migration: Synchronize all 29 Customer Service features, menus, permissions, and role associations.
 * Ensures:
 * 1. sys_modules has CUSTOMER_SERVICE (ID: 33) active with path_route '/dashboard/customer-service'.
 * 2. All 29 features in sys_features are active and accurate.
 * 3. All 29 features have corresponding entries in sys_menus for module_id = 33.
 * 4. All 29 features have standard read, write, and all operations in sys_permissions.
 * 5. super-admin and org-admin roles are linked to all 29 features in sys_role_features and sys_role_permissions.
 * 6. Active tenant organizations with entitlements get access to module 33.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      const now = new Date();

      // 1. Locate CUSTOMER_SERVICE module
      const [modules] = await queryInterface.sequelize.query(
        `SELECT id, name, code, path_route FROM sys_modules WHERE code = 'CUSTOMER_SERVICE' OR name = 'Customer Service' LIMIT 1`,
        { transaction: tx }
      );

      if (!modules || modules.length === 0) {
        throw new Error('Customer Service module not found in sys_modules.');
      }

      const moduleId = modules[0].id;

      // Update module metadata if needed
      await queryInterface.sequelize.query(
        `UPDATE sys_modules 
         SET path_route = '/dashboard/customer-service', is_active = true, updated_at = :now
         WHERE id = :moduleId`,
        { replacements: { moduleId, now }, transaction: tx }
      );

      // 2. The 29 canonical Customer Service features
      const features = [
        {
          name: 'Customers & Properties | Customer 360°',
          code: 'CS_CUST_360',
          route_path: '/dashboard/customer-service/customers',
          display_order: 1,
          icon: 'Users',
        },
        {
          name: 'Customers & Properties | Bookings & Property Portfolio',
          code: 'CS_CUST_BOOKINGS',
          route_path: '/dashboard/customer-service/customers/properties-bookings',
          display_order: 2,
          icon: 'Building2',
        },
        {
          name: 'Customers & Properties | Transfer, Resale & Change Requests',
          code: 'CS_CUST_CHANGE_REQ',
          route_path: '/dashboard/customer-service/customers/change-requests',
          display_order: 3,
          icon: 'GitPullRequest',
        },
        {
          name: 'Payments & Collections | Collections, Receipts & Customer Ledger',
          code: 'CS_PAY_COLLECTIONS',
          route_path: '/dashboard/customer-service/payments/collections-ledger-receipts',
          display_order: 5,
          icon: 'Receipt',
        },
        {
          name: 'Payments & Collections | Dues, Ageing & Recovery',
          code: 'CS_PAY_DUES_AGEING',
          route_path: '/dashboard/customer-service/payments/dues-ageing-recovery',
          display_order: 6,
          icon: 'Clock',
        },
        {
          name: 'Payments & Collections | Refunds & Adjustments',
          code: 'CS_PAY_REFUNDS',
          route_path: '/dashboard/customer-service/payments/refunds-adjustments',
          display_order: 7,
          icon: 'RefreshCw',
        },
        {
          name: 'Documents & Land Records | Document Centre',
          code: 'CS_DOC_CENTER',
          route_path: '/dashboard/customer-service/documents/center',
          display_order: 8,
          icon: 'FolderArchive',
        },
        {
          name: 'Documents & Land Records | Registration Tracking',
          code: 'CS_DOC_REGISTRATION',
          route_path: '/dashboard/customer-service/documents/registration-tracking',
          display_order: 9,
          icon: 'FileCheck2',
        },
        {
          name: 'Documents & Land Records | Mutation & Khatian Tracking',
          code: 'CS_DOC_MUTATION',
          route_path: '/dashboard/customer-service/documents/mutation-khatian-tracking',
          display_order: 10,
          icon: 'ScrollText',
        },
        {
          name: 'Handover & Possession | Handover Schedule',
          code: 'CS_HO_SCHEDULE',
          route_path: '/dashboard/customer-service/handover/schedule',
          display_order: 11,
          icon: 'CalendarDays',
        },
        {
          name: 'Handover & Possession | Inspections & Snagging',
          code: 'CS_HO_INSPECTION',
          route_path: '/dashboard/customer-service/handover/inspection-snags',
          display_order: 12,
          icon: 'ClipboardCheck',
        },
        {
          name: 'Handover & Possession | Possession & Handover Records',
          code: 'CS_HO_POSSESSION',
          route_path: '/dashboard/customer-service/handover/possession-records',
          display_order: 13,
          icon: 'KeyRound',
        },
        {
          name: 'Tickets & Service Requests | All Tickets',
          code: 'CS_TICKETS_ALL',
          route_path: '/dashboard/customer-service/tickets',
          display_order: 14,
          icon: 'LifeBuoy',
        },
        {
          name: 'Warranty & Property Care | Warranty & DLP Claims',
          code: 'CS_CARE_DLP',
          route_path: '/dashboard/customer-service/property-care/warranty-dlp',
          display_order: 15,
          icon: 'ShieldCheck',
        },
        {
          name: 'Warranty & Property Care | Maintenance Requests',
          code: 'CS_CARE_MAINTENANCE',
          route_path: '/dashboard/customer-service/property-care/maintenance-requests',
          display_order: 16,
          icon: 'Wrench',
        },
        {
          name: 'Warranty & Property Care | Work Orders & Owners Association',
          code: 'CS_CARE_ASSOCIATION',
          route_path: '/dashboard/customer-service/property-care/work-orders-association',
          display_order: 17,
          icon: 'FileText',
        },
        {
          name: 'Communication & Appointments | Communication Hub & Reminders',
          code: 'CS_COMM_INBOX',
          route_path: '/dashboard/customer-service/communication/inbox-reminders',
          display_order: 18,
          icon: 'MessageSquare',
        },
        {
          name: 'Communication & Appointments | Site Visits & Appointments',
          code: 'CS_COMM_VISITS',
          route_path: '/dashboard/customer-service/communication/site-visits-appointments',
          display_order: 19,
          icon: 'Calendar',
        },
        {
          name: 'Communication & Appointments | Feedback, Surveys & NPS',
          code: 'CS_COMM_FEEDBACK',
          route_path: '/dashboard/customer-service/communication/feedback-surveys',
          display_order: 20,
          icon: 'ThumbsUp',
        },
        {
          name: 'Reports & Analytics | Collections & Ageing Reports',
          code: 'CS_REP_COLLECTIONS',
          route_path: '/dashboard/customer-service/reports/collections-ageing',
          display_order: 21,
          icon: 'BarChart3',
        },
        {
          name: 'Reports & Analytics | Ticket & SLA Performance',
          code: 'CS_REP_TICKETS',
          route_path: '/dashboard/customer-service/reports/service-ticket-sla',
          display_order: 22,
          icon: 'LineChart',
        },
        {
          name: 'Reports & Analytics | Handover & Property Care Reports',
          code: 'CS_REP_HANDOVER',
          route_path: '/dashboard/customer-service/reports/handover-property-care',
          display_order: 23,
          icon: 'PieChart',
        },
        {
          name: 'Settings & Administration | Service & Workflow Rules',
          code: 'CS_SET_RULES',
          route_path: '/dashboard/customer-service/settings/service-workflow-rules',
          display_order: 24,
          icon: 'Settings',
        },
        {
          name: 'Building Services | Utility Service',
          code: 'CS_BLD_UTILITY',
          route_path: '/dashboard/customer-service/utility-service',
          display_order: 25,
          icon: 'Zap',
        },
        {
          name: 'Building Services | Security Service',
          code: 'CS_BLD_SECURITY',
          route_path: '/dashboard/customer-service/security-service',
          display_order: 26,
          icon: 'ShieldCheck',
        },
        {
          name: 'Building Services | Parking Service',
          code: 'CS_BLD_PARKING',
          route_path: '/dashboard/customer-service/parking-service',
          display_order: 27,
          icon: 'Car',
        },
        {
          name: 'Building Services | Other Services',
          code: 'CS_BLD_OTHER',
          route_path: '/dashboard/customer-service/other-services',
          display_order: 28,
          icon: 'Layers',
        },
        {
          name: 'Building Management | Service Charge & Costing',
          code: 'CS_MGMT_SERVICE_CHARGE',
          route_path: '/dashboard/customer-service/service-charge',
          display_order: 29,
          icon: 'CreditCard',
        },
        {
          name: 'Building Management | Building Committee',
          code: 'CS_MGMT_COMMITTEE',
          route_path: '/dashboard/customer-service/building-committee',
          display_order: 30,
          icon: 'Users2',
        },
      ];

      // 3. Find roles to associate
      const [adminRoles] = await queryInterface.sequelize.query(
        `SELECT id, slug FROM sys_roles WHERE slug IN ('super-admin', 'org-admin')`,
        { transaction: tx }
      );

      const locationJson = JSON.stringify(['sidebar']);
      const actionsJson = JSON.stringify(['read', 'write', 'all']);

      for (const feat of features) {
        // A. Upsert into sys_features
        const [existingFeat] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_features WHERE code = :code OR (module_id = :moduleId AND route_path = :routePath)`,
          { replacements: { code: feat.code, moduleId, routePath: feat.route_path }, transaction: tx }
        );

        let featureId;
        if (existingFeat && existingFeat.length > 0) {
          featureId = existingFeat[0].id;
          await queryInterface.sequelize.query(
            `UPDATE sys_features 
             SET name = :name, code = :code, route_path = :routePath, actions = :actions::jsonb, 
                 display_order = :displayOrder, is_active = true, updated_at = :now
             WHERE id = :featureId`,
            {
              replacements: {
                featureId,
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

        // B. Upsert into sys_menus
        const [existingMenu] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_menus WHERE module_id = :moduleId AND (url = :url OR title = :title)`,
          { replacements: { moduleId, url: feat.route_path, title: feat.name }, transaction: tx }
        );

        if (existingMenu && existingMenu.length > 0) {
          await queryInterface.sequelize.query(
            `UPDATE sys_menus 
             SET title = :title, url = :url, "order" = :displayOrder, location = :location::jsonb, 
                 icon = :icon, is_visible = true, updated_at = :now
             WHERE id = :menuId`,
            {
              replacements: {
                menuId: existingMenu[0].id,
                title: feat.name,
                url: feat.route_path,
                displayOrder: feat.display_order,
                location: locationJson,
                icon: feat.icon,
                now,
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

        // C. Standard permissions (read, write, all) in sys_permissions
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
                  permId,
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

          // D. Assign permission to admin roles
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

        // E. Grant sys_role_features to admin roles
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

      // 4. Entitle all active tenant organizations to module 33
      const [orgs] = await queryInterface.sequelize.query(
        `SELECT DISTINCT org_id FROM sys_org_entitlements WHERE org_id IS NOT NULL`,
        { transaction: tx }
      );

      for (const org of orgs) {
        const [featuresInCs] = await queryInterface.sequelize.query(
          `SELECT id FROM sys_features WHERE module_id = :moduleId`,
          { replacements: { moduleId }, transaction: tx }
        );

        for (const f of featuresInCs) {
          const [hasEnt] = await queryInterface.sequelize.query(
            `SELECT id FROM sys_org_entitlements WHERE org_id = :orgId AND feature_id = :featureId`,
            { replacements: { orgId: org.org_id, featureId: f.id }, transaction: tx }
          );

          if (!hasEnt || hasEnt.length === 0) {
            const entUuid = uuidv4();
            await queryInterface.sequelize.query(
              `INSERT INTO sys_org_entitlements (uuid, org_id, module_id, feature_id, is_enabled, created_at, updated_at)
               VALUES (:uuid, :orgId, :moduleId, :featureId, true, :now, :now)`,
              {
                replacements: {
                  uuid: entUuid,
                  orgId: org.org_id,
                  moduleId,
                  featureId: f.id,
                  now,
                },
                transaction: tx,
              }
            );
          }
        }
      }

      console.log('Successfully synchronized all 29 Customer Service features, menus, permissions, and entitlements!');
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (tx) => {
      // Revert sys_menus added for features 1..23 (leave the 6 building services features from previous migration)
      const urlsToRemove = [
        '/dashboard/customer-service/customers',
        '/dashboard/customer-service/customers/properties-bookings',
        '/dashboard/customer-service/customers/change-requests',
        '/dashboard/customer-service/payments/collections-ledger-receipts',
        '/dashboard/customer-service/payments/dues-ageing-recovery',
        '/dashboard/customer-service/payments/refunds-adjustments',
        '/dashboard/customer-service/documents/center',
        '/dashboard/customer-service/documents/registration-tracking',
        '/dashboard/customer-service/documents/mutation-khatian-tracking',
        '/dashboard/customer-service/handover/schedule',
        '/dashboard/customer-service/handover/inspection-snags',
        '/dashboard/customer-service/handover/possession-records',
        '/dashboard/customer-service/tickets',
        '/dashboard/customer-service/property-care/warranty-dlp',
        '/dashboard/customer-service/property-care/maintenance-requests',
        '/dashboard/customer-service/property-care/work-orders-association',
        '/dashboard/customer-service/communication/inbox-reminders',
        '/dashboard/customer-service/communication/site-visits-appointments',
        '/dashboard/customer-service/communication/feedback-surveys',
        '/dashboard/customer-service/reports/collections-ageing',
        '/dashboard/customer-service/reports/service-ticket-sla',
        '/dashboard/customer-service/reports/handover-property-care',
        '/dashboard/customer-service/settings/service-workflow-rules',
      ];

      await queryInterface.sequelize.query(
        `DELETE FROM sys_menus WHERE module_id = 33 AND url IN (:urls)`,
        { replacements: { urls: urlsToRemove }, transaction: tx }
      );
    });
  },
};

