const TABLES = [
  'leave_application',
  'allowance',
  'bonus_generate',
  'commission',
  'employee_list',
  'designation',
  'attendance',
  'bonus',
  'deduction_rule',
  'allowance_deduction_setup',
  'employee_salary',
  'attendance_reconciliation',
  'department',
  'holiday',
  'employee_type',
  'increment',
  'salary_grade_item',
  'zkteco_device',
  'leave_type',
  'loan',
  'month_year',
  'overtime',
  'saturation_deduction',
  'salary_grade',
  'section',
  'shift_schedule',
  'hrm_unit',
  'shift',
  'under',
];

const PROJECT_TABLES = new Set([
  'hrm_leave_application',
  'hrm_attendance_reconciliation',
  'hrm_allowance',
  'hrm_attendance',
  'hrm_commission',
  'hrm_bonus',
  'hrm_zkteco_device',
  'hrm_bonus_generate',
  'hrm_employee_list',
  'hrm_employee_salary',
  'hrm_increment',
  'hrm_loan',
  'hrm_overtime',
  'hrm_saturation_deduction',
  'hrm_shift_schedule',
]);

const quote = (identifier) => `"${identifier.replace(/"/g, '""')}"`;

function toSnakeCase(value) {
  return value
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

async function relationKind(queryInterface, name, transaction) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT c.relkind
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = current_schema() AND c.relname = :name`,
    { replacements: { name }, transaction },
  );
  return rows[0]?.relkind;
}

async function getColumns(queryInterface, table, transaction) {
  const [rows] = await queryInterface.sequelize.query(
    `SELECT column_name
       FROM information_schema.columns
      WHERE table_schema = current_schema() AND table_name = :table
      ORDER BY ordinal_position`,
    { replacements: { table }, transaction },
  );
  return rows.map((row) => row.column_name);
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      let activeTable = 'initialization';
      try {
        for (const legacyName of TABLES) {
        const tableName = legacyName.startsWith('hrm_')
          ? legacyName
          : `hrm_${legacyName}`;
        activeTable = tableName;
        const originalKind = await relationKind(
          queryInterface,
          legacyName,
          transaction,
        );
        let legacyColumns = originalKind
          ? await getColumns(queryInterface, legacyName, transaction)
          : [];
        let targetKind = await relationKind(
          queryInterface,
          tableName,
          transaction,
        );

        if (legacyName !== tableName && originalKind === 'r') {
          if (targetKind) {
            throw new Error(
              `Cannot rename ${legacyName}: ${tableName} already exists`,
            );
          }
          await queryInterface.sequelize.query(
            `ALTER TABLE ${quote(legacyName)} RENAME TO ${quote(tableName)}`,
            { transaction },
          );
          targetKind = 'r';
        }

        if (targetKind !== 'r' && targetKind !== 'p') {
          throw new Error(`Expected physical HRM table ${tableName}`);
        }

        const currentColumns = await getColumns(
          queryInterface,
          tableName,
          transaction,
        );
        for (const column of [...currentColumns]) {
          const snakeColumn = toSnakeCase(column);
          if (column === snakeColumn) continue;
          if (currentColumns.includes(snakeColumn)) {
            const [rows] = await queryInterface.sequelize.query(
              `SELECT COUNT(*)::int AS conflicts FROM ${quote(tableName)} WHERE ${quote(column)} IS NOT NULL AND ${quote(snakeColumn)} IS NOT NULL AND ${quote(column)}::text IS DISTINCT FROM ${quote(snakeColumn)}::text`,
              { transaction },
            );
            if (rows[0].conflicts > 0) {
              throw new Error(
                `Conflicting values in ${tableName}.${column} and ${snakeColumn}`,
              );
            }
            await queryInterface.sequelize.query(
              `UPDATE ${quote(tableName)} SET ${quote(snakeColumn)} = COALESCE(${quote(snakeColumn)}, ${quote(column)})`,
              { transaction },
            );
            let preservedColumn = `legacy_${snakeColumn}`;
            let suffix = 2;
            while (currentColumns.includes(preservedColumn)) {
              preservedColumn = `legacy_${snakeColumn}_${suffix++}`;
            }
            await queryInterface.sequelize.query(
              `ALTER TABLE ${quote(tableName)} RENAME COLUMN ${quote(column)} TO ${quote(preservedColumn)}`,
              { transaction },
            );
            currentColumns.splice(currentColumns.indexOf(column), 1);
            currentColumns.push(preservedColumn);
            continue;
          }
          await queryInterface.sequelize.query(
            `ALTER TABLE ${quote(tableName)} RENAME COLUMN ${quote(column)} TO ${quote(snakeColumn)}`,
            { transaction },
          );
          currentColumns[currentColumns.indexOf(column)] = snakeColumn;
        }

        // Every HRM model declares orgId. Add the nullable tenant key for
        // legacy tables that predate the organization mapping.
        if (!currentColumns.includes('org_id')) {
          await queryInterface.addColumn(
            tableName,
            'org_id',
            {
              type: Sequelize.BIGINT,
              allowNull: true,
              references: { model: 'sys_organizations', key: 'id' },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction },
          );
          currentColumns.push('org_id');
        }

        if (PROJECT_TABLES.has(tableName) && !currentColumns.includes('project_id')) {
          await queryInterface.addColumn(
            tableName,
            'project_id',
            {
              type: Sequelize.UUID,
              allowNull: true,
              references: { model: 'project', key: 'uuid' },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction },
          );
          currentColumns.push('project_id');
        }

        if (legacyName !== tableName) {
          if (!legacyColumns.length) legacyColumns = [...currentColumns];
          if (!legacyColumns.includes('org_id')) legacyColumns.push('org_id');
          if (
            PROJECT_TABLES.has(tableName) &&
            !legacyColumns.includes('project_id')
          ) {
            legacyColumns.push('project_id');
          }

          const selections = legacyColumns.map((legacyColumn) => {
            const physicalColumn = toSnakeCase(legacyColumn);
            const source = quote(physicalColumn);
            return physicalColumn === legacyColumn
              ? source
              : `${source} AS ${quote(legacyColumn)}`;
          });
          await queryInterface.sequelize.query(
            `CREATE OR REPLACE VIEW ${quote(legacyName)} AS SELECT ${selections.join(', ')} FROM ${quote(tableName)}`,
            { transaction },
          );
        }
        }
      } catch (error) {
        throw new Error(`Failed to normalize ${activeTable}: ${error.message}`);
      }
    });
  },

  down: async () => {
    throw new Error(
      'This schema normalization is forward-only; use a reviewed backup restore to reverse it.',
    );
  },
};
