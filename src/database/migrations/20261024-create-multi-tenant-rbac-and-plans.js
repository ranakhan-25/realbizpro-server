module.exports = {
  up: async (queryInterface, Sequelize) => {
    const base = {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    };

    // Helper: Safely add column if it doesn't already exist
    const addColumnIfMissing = async (table, col, def) => {
      try {
        const desc = await queryInterface.describeTable(table);
        if (!desc[col]) {
          await queryInterface.addColumn(table, col, def);
        }
      } catch (e) {
        // Table might not exist yet or dialect issue, ignore
      }
    };

    // 1. sys_plans
    await queryInterface.createTable('sys_plans', {
      ...base,
      name: { type: Sequelize.STRING(100), allowNull: false },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      monthly_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.0 },
      yearly_price: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0.0 },
      billing_cycle: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'half_yearly', 'yearly', 'lifetime'),
        allowNull: false,
        defaultValue: 'monthly',
      },
      duration_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
      trial_days: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 14 },
      max_users: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      max_projects: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      max_storage_mb: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10240 },
      features: { type: Sequelize.JSON, allowNull: true, defaultValue: [] },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'archived'),
        allowNull: false,
        defaultValue: 'active',
      },
      subscribers_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
    });

    // 2. sys_organizations
    await queryInterface.createTable('sys_organizations', {
      ...base,
      name: { type: Sequelize.STRING(150), allowNull: false },
      code: { type: Sequelize.STRING(50), allowNull: false, unique: true },
      email: { type: Sequelize.STRING(120), allowNull: true },
      phone: { type: Sequelize.STRING(40), allowNull: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      plan_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: { model: 'sys_plans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      plan_uuid: { type: Sequelize.UUID, allowNull: true },
      subscription_status: {
        type: Sequelize.ENUM('trial', 'active', 'past_due', 'expired', 'locked', 'canceled'),
        allowNull: false,
        defaultValue: 'trial',
      },
      subscription_start_date: { type: Sequelize.DATE, allowNull: true },
      subscription_end_date: { type: Sequelize.DATE, allowNull: true },
      trial_ends_at: { type: Sequelize.DATE, allowNull: true },
      max_users: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      max_projects: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      max_storage_mb: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 10240 },
      is_locked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      lock_reason: { type: Sequelize.TEXT, allowNull: true },
      metadata: { type: Sequelize.JSON, allowNull: true },
    });

    // 3. Update sys_modules columns
    await addColumnIfMissing('sys_modules', 'code', { type: Sequelize.STRING(50), allowNull: true, unique: true });
    await addColumnIfMissing('sys_modules', 'path_route', { type: Sequelize.STRING(255), allowNull: true });
    await addColumnIfMissing('sys_modules', 'icon', { type: Sequelize.STRING(50), allowNull: true });
    await addColumnIfMissing('sys_modules', 'display_order', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    await addColumnIfMissing('sys_modules', 'is_active', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });

    // 4. Update sys_features columns
    await addColumnIfMissing('sys_features', 'code', { type: Sequelize.STRING(50), allowNull: true, unique: true });
    await addColumnIfMissing('sys_features', 'route_path', { type: Sequelize.STRING(255), allowNull: true });
    await addColumnIfMissing('sys_features', 'action_type', { type: Sequelize.STRING(50), allowNull: true, defaultValue: 'read' });
    await addColumnIfMissing('sys_features', 'display_order', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 });
    await addColumnIfMissing('sys_features', 'is_active', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true });

    // 5. sys_org_entitlements
    await queryInterface.createTable('sys_org_entitlements', {
      ...base,
      org_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_organizations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      org_uuid: { type: Sequelize.UUID, allowNull: true },
      module_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_modules', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      module_uuid: { type: Sequelize.UUID, allowNull: true },
      feature_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_features', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      feature_uuid: { type: Sequelize.UUID, allowNull: true },
      is_enabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    });

    // 6. Update sys_roles columns
    await addColumnIfMissing('sys_roles', 'org_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'sys_organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
    await addColumnIfMissing('sys_roles', 'org_uuid', { type: Sequelize.UUID, allowNull: true });
    await addColumnIfMissing('sys_roles', 'is_system_role', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });

    // 7. sys_role_features
    await queryInterface.createTable('sys_role_features', {
      ...base,
      role_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      feature_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_features', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      can_view: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      can_create: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      can_edit: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      can_delete: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      can_approve: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    });

    // 8. Update sys_users columns
    await addColumnIfMissing('sys_users', 'org_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: { model: 'sys_organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await addColumnIfMissing('sys_users', 'org_uuid', { type: Sequelize.UUID, allowNull: true });
    await addColumnIfMissing('sys_users', 'is_org_admin', { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false });

    // 9. sys_user_feature_overrides
    await queryInterface.createTable('sys_user_feature_overrides', {
      ...base,
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      feature_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sys_features', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_granted: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      can_view: { type: Sequelize.BOOLEAN, allowNull: true },
      can_create: { type: Sequelize.BOOLEAN, allowNull: true },
      can_edit: { type: Sequelize.BOOLEAN, allowNull: true },
      can_delete: { type: Sequelize.BOOLEAN, allowNull: true },
      can_approve: { type: Sequelize.BOOLEAN, allowNull: true },
    });

    // Indexes
    try {
      await queryInterface.addIndex('sys_organizations', ['code']);
      await queryInterface.addIndex('sys_organizations', ['subscription_status']);
      await queryInterface.addIndex('sys_org_entitlements', ['org_id', 'feature_id'], { unique: true });
      await queryInterface.addIndex('sys_role_features', ['role_id', 'feature_id'], { unique: true });
      await queryInterface.addIndex('sys_user_feature_overrides', ['user_id', 'feature_id'], { unique: true });
      await queryInterface.addIndex('sys_users', ['org_id']);
    } catch (e) {
      // index already exists or dialect specific, ignore
    }
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sys_user_feature_overrides');
    await queryInterface.dropTable('sys_role_features');
    await queryInterface.dropTable('sys_org_entitlements');
    await queryInterface.dropTable('sys_organizations');
    await queryInterface.dropTable('sys_plans');
  },
};
