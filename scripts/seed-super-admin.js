'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Sequelize, DataTypes, QueryTypes } = require('sequelize');
const argon2 = require('argon2');
const { v4: uuidv4 } = require('uuid');

async function seedSuperAdmin() {
  console.log('🚀 Starting Super Admin Seeder...');

  // 1. Load environment variables
  const envPath = path.resolve(__dirname, '..', '.env');
  let envConfig = {};
  if (fs.existsSync(envPath)) {
    envConfig = dotenv.parse(fs.readFileSync(envPath));
  } else {
    envConfig = process.env;
  }

  const dbHost = envConfig.DATABASE_HOST || 'localhost';
  const dbPort = parseInt(envConfig.DATABASE_PORT || '5432', 10);
  const dbName = envConfig.DATABASE_NAME || 'realbizpro_db';
  const dbUser = envConfig.DATABASE_USERNAME || 'postgres';
  const dbPass = envConfig.DATABASE_PASSWORD || '';

  console.log(`📡 Connecting to PostgreSQL at ${dbHost}:${dbPort}/${dbName} as ${dbUser}...`);

  const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      connectTimeout: 30000,
    },
  });

  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database successfully.');

    // 2. Hash Password with Argon2
    const plainPassword = '12345678';
    const email = 'admin@admin.com';
    const username = 'admin';
    const name = 'Super Admin';

    console.log('🔐 Generating Argon2 password hash...');
    const passwordHash = await argon2.hash(plainPassword);

    // 3. Ensure "Super Admin" role exists in sys_roles
    console.log('🔍 Checking for Super Admin role in sys_roles...');
    const roles = await sequelize.query(
      `SELECT id, uuid, slug, name FROM "sys_roles" WHERE slug = 'super-admin' OR name = 'Super Admin' LIMIT 1`,
      { type: QueryTypes.SELECT },
    );

    let roleId;
    if (roles && roles.length > 0) {
      roleId = roles[0].id;
      console.log(`ℹ️  Super Admin role already exists (ID: ${roleId}).`);
    } else {
      console.log('➕ Creating Super Admin role in sys_roles...');
      const [newRole] = await sequelize.query(
        `INSERT INTO "sys_roles" (uuid, name, slug, description, is_system_role, created_at, updated_at)
         VALUES (:uuid, 'Super Admin', 'super-admin', 'System Super Administrator with unrestricted access', true, NOW(), NOW())
         RETURNING id, uuid`,
        {
          replacements: { uuid: uuidv4() },
          type: QueryTypes.INSERT,
        },
      );
      roleId = newRole[0].id;
      console.log(`✅ Created Super Admin role (ID: ${roleId}).`);
    }

    // 4. Ensure Super Admin user exists in sys_users
    console.log(`🔍 Checking for user "${email}" in sys_users...`);
    const users = await sequelize.query(
      `SELECT id, uuid, email, username FROM "sys_users" WHERE email = :email LIMIT 1`,
      {
        replacements: { email },
        type: QueryTypes.SELECT,
      },
    );

    let userId;
    if (users && users.length > 0) {
      userId = users[0].id;
      console.log(`ℹ️  User "${email}" exists (ID: ${userId}). Updating password hash and super user flags...`);
      await sequelize.query(
        `UPDATE "sys_users"
         SET password = :password,
             password_hash = :passwordHash,
             name = :name,
             username = :username,
             is_super_user = true,
             is_active = true,
             is_org_admin = false,
             org_id = NULL,
             org_uuid = NULL,
             user_type = 'Office',
             updated_at = NOW()
         WHERE id = :userId`,
        {
          replacements: {
            userId,
            password: plainPassword,
            passwordHash,
            name,
            username,
          },
          type: QueryTypes.UPDATE,
        },
      );
      console.log('✅ User updated successfully.');
    } else {
      console.log(`➕ Creating new user "${email}"...`);
      const [newUser] = await sequelize.query(
        `INSERT INTO "sys_users" (
           uuid, name, email, username, password, password_hash,
           user_type, is_super_user, is_active, is_org_admin,
           org_id, org_uuid, created_at, updated_at
         )
         VALUES (
           :uuid, :name, :email, :username, :password, :passwordHash,
           'Office', true, true, false,
           NULL, NULL, NOW(), NOW()
         )
         RETURNING id, uuid`,
        {
          replacements: {
            uuid: uuidv4(),
            name,
            email,
            username,
            password: plainPassword,
            passwordHash,
          },
          type: QueryTypes.INSERT,
        },
      );
      userId = newUser[0].id;
      console.log(`✅ Created user "${email}" (ID: ${userId}).`);
    }

    // 5. Link user with Super Admin role in sys_user_roles
    console.log('🔗 Checking role assignment in sys_user_roles...');
    const userRoles = await sequelize.query(
      `SELECT id FROM "sys_user_roles" WHERE user_id = :userId AND role_id = :roleId LIMIT 1`,
      {
        replacements: { userId, roleId },
        type: QueryTypes.SELECT,
      },
    );

    if (userRoles && userRoles.length > 0) {
      console.log('ℹ️  User is already assigned to the Super Admin role.');
    } else {
      console.log('➕ Assigning Super Admin role to user...');
      await sequelize.query(
        `INSERT INTO "sys_user_roles" (uuid, user_id, role_id, created_at, updated_at)
         VALUES (:uuid, :userId, :roleId, NOW(), NOW())`,
        {
          replacements: {
            uuid: uuidv4(),
            userId,
            roleId,
          },
          type: QueryTypes.INSERT,
        },
      );
      console.log('✅ Role assigned successfully.');
    }

    // 6. Grant module access in sys_module_to_user for all existing modules
    console.log('📦 Checking system modules...');
    const modules = await sequelize.query(
      `SELECT id FROM "sys_modules"`,
      { type: QueryTypes.SELECT },
    );

    if (modules && modules.length > 0) {
      for (const mod of modules) {
        const existingModUser = await sequelize.query(
          `SELECT id FROM "sys_module_to_user" WHERE user_id = :userId AND module_id = :moduleId LIMIT 1`,
          {
            replacements: { userId, moduleId: mod.id },
            type: QueryTypes.SELECT,
          },
        );
        if (!existingModUser || existingModUser.length === 0) {
          await sequelize.query(
            `INSERT INTO "sys_module_to_user" (uuid, user_id, module_id, created_at, updated_at)
             VALUES (:uuid, :userId, :moduleId, NOW(), NOW())`,
            {
              replacements: {
                uuid: uuidv4(),
                userId,
                moduleId: mod.id,
              },
              type: QueryTypes.INSERT,
            },
          );
        }
      }
      console.log(`✅ Assigned ${modules.length} modules to user in sys_module_to_user.`);
    }

    console.log('\n=============================================');
    console.log('🎉 Super Admin Seed Completed Successfully!');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Username: ${username}`);
    console.log(`   Role:     Super Admin (slug: super-admin)`);
    console.log(`   IsSuper:  true`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding Super Admin:', err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedSuperAdmin();
