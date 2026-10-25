'use strict';

const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plainPassword = '12345678';
    const email = 'admin@admin.com';
    const username = 'admin';
    const name = 'Super Admin';
    const passwordHash = await argon2.hash(plainPassword);

    // 1. Ensure Super Admin role
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "sys_roles" WHERE slug = 'super-admin' LIMIT 1`,
    );

    let roleId;
    if (roles && roles.length > 0) {
      roleId = roles[0].id;
    } else {
      const [newRole] = await queryInterface.sequelize.query(
        `INSERT INTO "sys_roles" (uuid, name, slug, description, is_system_role, created_at, updated_at)
         VALUES ('${uuidv4()}', 'Super Admin', 'super-admin', 'System Super Administrator with unrestricted access', true, NOW(), NOW())
         RETURNING id`,
      );
      roleId = newRole[0].id;
    }

    // 2. Ensure Super Admin user
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "sys_users" WHERE email = '${email}' LIMIT 1`,
    );

    let userId;
    if (users && users.length > 0) {
      userId = users[0].id;
      await queryInterface.sequelize.query(
        `UPDATE "sys_users"
         SET password = '${plainPassword}',
             password_hash = '${passwordHash}',
             name = '${name}',
             username = '${username}',
             is_super_user = true,
             is_active = true,
             is_org_admin = false,
             org_id = NULL,
             org_uuid = NULL,
             user_type = 'Office',
             updated_at = NOW()
         WHERE id = ${userId}`,
      );
    } else {
      const [newUser] = await queryInterface.sequelize.query(
        `INSERT INTO "sys_users" (
           uuid, name, email, username, password, password_hash,
           user_type, is_super_user, is_active, is_org_admin,
           org_id, org_uuid, created_at, updated_at
         )
         VALUES (
           '${uuidv4()}', '${name}', '${email}', '${username}', '${plainPassword}', '${passwordHash}',
           'Office', true, true, false,
           NULL, NULL, NOW(), NOW()
         )
         RETURNING id`,
      );
      userId = newUser[0].id;
    }

    // 3. Link role
    const [userRoles] = await queryInterface.sequelize.query(
      `SELECT id FROM "sys_user_roles" WHERE user_id = ${userId} AND role_id = ${roleId} LIMIT 1`,
    );

    if (!userRoles || userRoles.length === 0) {
      await queryInterface.sequelize.query(
        `INSERT INTO "sys_user_roles" (uuid, user_id, role_id, created_at, updated_at)
         VALUES ('${uuidv4()}', ${userId}, ${roleId}, NOW(), NOW())`,
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const email = 'admin@admin.com';
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM "sys_users" WHERE email = '${email}' LIMIT 1`,
    );
    if (users && users.length > 0) {
      const userId = users[0].id;
      await queryInterface.sequelize.query(
        `DELETE FROM "sys_user_roles" WHERE user_id = ${userId}`,
      );
      await queryInterface.sequelize.query(
        `DELETE FROM "sys_users" WHERE id = ${userId}`,
      );
    }
  },
};
