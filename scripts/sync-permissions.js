const fs = require('fs/promises');
const path = require('path');
const ts = require('typescript');
const { glob } = require('glob');

// --- CONFIGURATION ---
const CONTROLLERS_PATH =
  'src/modules/**/*.controller.ts';
const PERMISSIONS_SEEDER_FILE = path.join(
  __dirname,
  '../src/database/seeders/initial-permissions.js',
);
const MODULES_SEEDER_FILE = path.join(
  __dirname,
  '../src/database/seeders/initial-modules.js',
);
const FEATURES_SEEDER_FILE = path.join(
  __dirname,
  '../src/database/seeders/initial-features.js',
);
// --- END CONFIGURATION ---

// Enums from your project
const ActionType = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
};

const ContextTypes = {
  ANY: 'any',
  OWN: 'own',
  TEAM: 'team',
  DEPARTMENT: 'department',
};

/**
 * Maps a controller method name to a standard ActionType.
 */
function mapMethodToAction(methodName) {
  const lowerMethod = methodName.toLowerCase();
  if (
    lowerMethod.startsWith('create') ||
    lowerMethod.startsWith('add')
  )
    return ActionType.CREATE;
  if (
    lowerMethod.startsWith('findall') ||
    lowerMethod.startsWith('getall') ||
    lowerMethod.startsWith('list')
  )
    return ActionType.LIST;
  if (
    lowerMethod.startsWith('findone') ||
    lowerMethod.startsWith('getbyid')
  )
    return ActionType.READ;
  if (
    lowerMethod.startsWith('update') ||
    lowerMethod.startsWith('patch') ||
    lowerMethod.startsWith('restore')
  )
    return ActionType.UPDATE;
  if (
    lowerMethod.startsWith('remove') ||
    lowerMethod.startsWith('delete') ||
    lowerMethod.startsWith('forcedelete')
  )
    return ActionType.DELETE;
  return null;
}

/**
 * Extracts the summary from @ApiOperation decorator
 */
function extractApiOperationSummary(
  method,
  sourceFile,
) {
  const apiOperationDecorator = (
    ts.getDecorators(method) ?? []
  ).find((decorator) => {
    if (
      ts.isCallExpression(decorator.expression)
    ) {
      return (
        decorator.expression.expression.getText(
          sourceFile,
        ) === 'ApiOperation'
      );
    }
    return false;
  });

  if (
    apiOperationDecorator &&
    ts.isCallExpression(
      apiOperationDecorator.expression,
    )
  ) {
    const args =
      apiOperationDecorator.expression.arguments;
    if (
      args.length > 0 &&
      ts.isObjectLiteralExpression(args[0])
    ) {
      const summaryProperty =
        args[0].properties.find(
          (prop) =>
            ts.isPropertyAssignment(prop) &&
            ts.isIdentifier(prop.name) &&
            prop.name.text === 'summary',
        );

      if (
        summaryProperty &&
        ts.isPropertyAssignment(
          summaryProperty,
        ) &&
        ts.isStringLiteral(
          summaryProperty.initializer,
        )
      ) {
        return summaryProperty.initializer.text;
      }
    }
  }

  return null;
}

/**
 * Extracts module and feature from @ApiTags decorator
 * Format: "Module | Feature" or "Module|Feature" or "Feature" (fallback)
 */
function extractModuleAndFeature(
  classNode,
  sourceFile,
) {
  const apiTagsDecorator = (
    ts.getDecorators(classNode) ?? []
  ).find((decorator) => {
    if (
      ts.isCallExpression(decorator.expression)
    ) {
      return (
        decorator.expression.expression.getText(
          sourceFile,
        ) === 'ApiTags'
      );
    }
    return false;
  });

  if (
    apiTagsDecorator &&
    ts.isCallExpression(
      apiTagsDecorator.expression,
    )
  ) {
    const args =
      apiTagsDecorator.expression.arguments;
    if (
      args.length > 0 &&
      ts.isStringLiteral(args[0])
    ) {
      const tagValue = args[0].text.trim();

      // Check if it contains pipe separator
      if (tagValue.includes('|')) {
        const parts = tagValue
          .split('|')
          .map((p) => p.trim());
        if (parts.length === 2) {
          return {
            module: parts[0],
            feature: parts[1],
            resource: parts[1]
              .toLowerCase()
              .replace(/\s+/g, ''),
          };
        }
      }

      // Fallback: treat entire tag as feature with "General" module
      return {
        module: 'System',
        feature: tagValue,
        resource: tagValue
          .toLowerCase()
          .replace(/\s+/g, ''),
      };
    }
  }

  return null;
}

/**
 * Attempts to parse a permission key into structured components.
 */
function parsePermissionKey(
  key,
  defaultResource,
) {
  const originalKey = key;
  const lowerKey = key.toLowerCase().trim();

  // Case 1: Already structured key like "users:create:any"
  if (lowerKey.includes(':')) {
    const parts = lowerKey.split(':');
    if (
      parts.length === 3 &&
      parts.every((part) => part.trim())
    ) {
      return {
        key: originalKey,
        resource: parts[0].trim(),
        action: parts[1].trim(),
        context: parts[2].trim(),
        description: `Allows ${parts[1]} action on ${parts[2]} ${parts[0]} resource.`,
      };
    }
  }

  // Case 2: Legacy keys - enhanced pattern matching with PRIORITY ORDER
  let action = null;
  let resource = null;

  const actionPatterns = [
    // RESTORE patterns → UPDATE (HIGHEST PRIORITY)
    {
      patterns: [/^restore[_-]/],
      action: ActionType.UPDATE,
      extractResource: (key) =>
        key.replace(/^restore[_-]/, ''),
    },
    // FORCE/HARD DELETE patterns → DELETE
    {
      patterns: [
        /^force[_-]delete[_-]/,
        /^hard[_-]delete[_-]/,
      ],
      action: ActionType.DELETE,
      extractResource: (key) =>
        key.replace(
          /^(force|hard)[_-]delete[_-]/,
          '',
        ),
    },
    // SOFT DELETE patterns → DELETE
    {
      patterns: [/^soft[_-]delete[_-]/],
      action: ActionType.DELETE,
      extractResource: (key) =>
        key.replace(/^soft[_-]delete[_-]/, ''),
    },
    // CREATE patterns
    {
      patterns: [
        /^create[_-]/,
        /^add[_-]/,
        /^new[_-]/,
        /^insert[_-]/,
      ],
      action: ActionType.CREATE,
      extractResource: (key) =>
        key.replace(
          /^(create|add|new|insert)[_-]/,
          '',
        ),
    },
    // READ/VIEW patterns
    {
      patterns: [
        /^view[_-]/,
        /^get[_-]/,
        /^read[_-]/,
        /^show[_-]/,
        /^fetch[_-]/,
        /^find[_-]/,
      ],
      action: ActionType.READ,
      extractResource: (key) =>
        key.replace(
          /^(view|get|read|show|fetch|find)[_-]/,
          '',
        ),
    },
    // LIST patterns
    {
      patterns: [
        /^list[_-]/,
        /^getall[_-]/,
        /^findall[_-]/,
        /^index[_-]/,
      ],
      action: ActionType.LIST,
      extractResource: (key) =>
        key.replace(
          /^(list|getall|findall|index)[_-]/,
          '',
        ),
    },
    // UPDATE patterns
    {
      patterns: [
        /^update[_-]/,
        /^edit[_-]/,
        /^modify[_-]/,
        /^patch[_-]/,
        /^change[_-]/,
      ],
      action: ActionType.UPDATE,
      extractResource: (key) =>
        key.replace(
          /^(update|edit|modify|patch|change)[_-]/,
          '',
        ),
    },
    // DELETE patterns (LOWEST PRIORITY)
    {
      patterns: [
        /^delete[_-]/,
        /^remove[_-]/,
        /^destroy[_-]/,
        /^drop[_-]/,
      ],
      action: ActionType.DELETE,
      extractResource: (key) =>
        key.replace(
          /^(delete|remove|destroy|drop)[_-]/,
          '',
        ),
    },
  ];

  // Try to match action patterns IN ORDER (priority-based)
  for (const actionPattern of actionPatterns) {
    const matchedPattern =
      actionPattern.patterns.find((pattern) =>
        pattern.test(lowerKey),
      );
    if (matchedPattern) {
      action = actionPattern.action;
      resource =
        actionPattern.extractResource(lowerKey);
      break; // Stop at first match
    }
  }

  if (resource) {
    resource = cleanResourceName(resource);
  }

  if (action && resource) {
    return {
      key: originalKey,
      resource: resource,
      action: action,
      context: ContextTypes.ANY,
      description: `Allows ${action} action on any ${resource} resource.`,
    };
  }

  // Case 3: Couldn't parse - keep as legacy but still try to extract resource
  return {
    key: originalKey,
    resource:
      defaultResource ||
      extractResourceFromKey(lowerKey),
    action: 'unknown',
    context: ContextTypes.ANY,
    description: `Legacy permission: ${originalKey}`,
  };
}

/**
 * Extracts resource name from complex keys
 */
function extractResourceFromKey(key) {
  let resource = key
    .replace(/^(can|may|allow)[_-]?/, '')
    .replace(
      /[_-]?(permission|access|right)s?$/,
      '',
    )
    .replace(/[_-]?(action|operation)s?$/, '')
    .replace(/[_-]+/g, '')
    .trim();

  return cleanResourceName(resource) || 'unknown';
}

/**
 * Cleans and normalizes resource names
 */
function cleanResourceName(resource) {
  if (!resource) return 'unknown';

  resource = resource.replace(/[_-]+/g, '');

  const pluralExceptions = [
    'menus',
    'news',
    'series',
    'species',
  ];

  if (
    !pluralExceptions.includes(
      resource.toLowerCase(),
    )
  ) {
    if (resource.endsWith('ies')) {
      resource = resource.slice(0, -3) + 'y';
    } else if (
      resource.endsWith('es') &&
      resource.length > 3
    ) {
      const singular = resource.slice(0, -2);
      if (
        ['box', 'class', 'pass', 'address'].some(
          (word) => singular.endsWith(word),
        )
      ) {
        resource = singular;
      } else if (
        resource.endsWith('ches') ||
        resource.endsWith('shes')
      ) {
        resource = singular;
      }
    } else if (
      resource.endsWith('s') &&
      resource.length > 2
    ) {
      resource = resource.slice(0, -1);
    }
  }

  resource = resource
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();

  return resource || 'unknown';
}

/**
 * Enhanced key to name conversion
 */
function keyToName(key) {
  if (!key) return 'Unknown Permission';

  key = key.split(':')[0];

  const acronyms = [
    'id',
    'api',
    'url',
    'http',
    'json',
    'xml',
    'csv',
    'pdf',
  ];

  return (
    key
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w+/g, (word) => {
        if (
          acronyms.includes(word.toLowerCase())
        ) {
          return word.toUpperCase();
        }
        return (
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
        );
      })
      .trim() || 'Unknown Permission'
  );
}

/**
 * Extracts structured permissions from a TypeScript controller file.
 */
function extractPermissionsFromCode(fileContent) {
  const foundPermissions = [];
  const sourceFile = ts.createSourceFile(
    'temp.ts',
    fileContent,
    ts.ScriptTarget.Latest,
    true,
  );

  function visit(node) {
    if (
      ts.isClassDeclaration(node) &&
      node.name
    ) {
      const className =
        node.name.getText(sourceFile);
      if (className.endsWith('Controller')) {
        const moduleFeature =
          extractModuleAndFeature(
            node,
            sourceFile,
          );

        if (!moduleFeature) {
          console.log(
            `⚠️  No @ApiTags found in ${className}, skipping...`,
          );
          return;
        }

        const { module, feature, resource } =
          moduleFeature;

        node.members.forEach((member) => {
          if (
            ts.isMethodDeclaration(member) &&
            member.name
          ) {
            const permissionDecorator = (
              ts.getDecorators(member) ?? []
            ).find(
              (decorator) =>
                ts.isCallExpression(
                  decorator.expression,
                ) &&
                decorator.expression.expression.getText(
                  sourceFile,
                ) === 'Permissions',
            );

            if (permissionDecorator) {
              const callExpression =
                permissionDecorator.expression;
              const decoratorArgs =
                callExpression.arguments;
              const apiOperationSummary =
                extractApiOperationSummary(
                  member,
                  sourceFile,
                );

              if (decoratorArgs.length > 0) {
                decoratorArgs.forEach((arg) => {
                  if (ts.isStringLiteral(arg)) {
                    const key = arg.text;
                    const parsedPermission =
                      parsePermissionKey(
                        key,
                        resource,
                      );

                    if (apiOperationSummary) {
                      parsedPermission.description =
                        apiOperationSummary;
                    }

                    parsedPermission.module =
                      module;
                    parsedPermission.feature =
                      feature;
                    foundPermissions.push(
                      parsedPermission,
                    );
                  }
                });
              } else {
                const methodName =
                  member.name.getText(sourceFile);
                const action =
                  mapMethodToAction(methodName);
                if (action) {
                  const description =
                    apiOperationSummary ||
                    `Allows ${action} action on any ${resource} resource.`;

                  foundPermissions.push({
                    key: `${resource}:${action}:any`,
                    resource: resource,
                    action: action,
                    context: ContextTypes.ANY,
                    description: description,
                    module: module,
                    feature: feature,
                  });
                }
              }
            }
          }
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return foundPermissions;
}

/**
 * Generate modules seeder
 */
async function generateModulesSeeder(modules) {
  const modulesArray = Array.from(modules).sort();
  const modulesDataString = modulesArray
    .map(
      (moduleName) => `
  {
    uuid: uuidv4(),
    name: '${moduleName}',
    description: '${moduleName} module with all related features',
    created_at: new Date(),
    updated_at: new Date(),
  },`,
    )
    .join('');

  const seederTemplate = `'use strict';

const { intelligentUpsert } = require('../seeder.helper');
const { v4: uuidv4 } = require('uuid');

const modulesData = [${modulesDataString}
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
`;

  await fs.writeFile(
    MODULES_SEEDER_FILE,
    seederTemplate.trim(),
  );
  console.log(
    `✅ Generated modules seeder: ${MODULES_SEEDER_FILE}`,
  );
}

/**
 * Generate features seeder
 */
async function generateFeaturesSeeder(features) {
  const featuresArray = Array.from(
    features.entries(),
  ).sort((a, b) => a[0].localeCompare(b[0]));

  const featuresDataString = featuresArray
    .map(
      ([featureName, moduleName]) => `
  {
    uuid: uuidv4(),
    name: '${featureName}',
    description: '${featureName} feature under ${moduleName} module',
    module_id: modules.find(m => m.name === '${moduleName}')?.id || null,
    created_at: new Date(),
    updated_at: new Date(),
  },`,
    )
    .join('');

  const seederTemplate = `'use strict';

const { intelligentUpsert } = require('../seeder.helper');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // First get all modules
    const [modules] = await queryInterface.sequelize.query(
      "SELECT id, name FROM sys_modules"
    );

    const featuresData = [${featuresDataString}
    ];

    const tableName = 'sys_features';
    const uniqueKey = 'name';
    await intelligentUpsert(queryInterface, tableName, featuresData, uniqueKey);
  },

  async down(queryInterface) {
    const featureNames = ${JSON.stringify(featuresArray.map(([name]) => name))};
    await queryInterface.bulkDelete('sys_features', { name: featureNames });
  },
};
`;

  await fs.writeFile(
    FEATURES_SEEDER_FILE,
    seederTemplate.trim(),
  );
  console.log(
    `✅ Generated features seeder: ${FEATURES_SEEDER_FILE}`,
  );
}

/**
 * Generate permissions seeder
 */
async function generatePermissionsSeeder(
  permissions,
) {
  const permissionsDataString = permissions
    .map(
      (p) => `
  {
    uuid: uuidv4(),
    key: '${p.key}',
    name: '${keyToName(p.key)}',
    resource: ${p.resource ? `'${p.resource}'` : null},
    action: ${p.action ? `'${p.action}'` : null},
    context: ${p.context ? `'${p.context}'` : null},
    description: '${p.description.replace(/'/g, "\\'")}',
    feature_id: features.find(f => f.name === '${p.feature}')?.id || null,
    created_at: new Date(),
    updated_at: new Date(),
  },`,
    )
    .join('');

  const seederTemplate = `'use strict';

const { intelligentUpsert } = require('../seeder.helper');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // First get all features with their modules
    const [features] = await queryInterface.sequelize.query(
      "SELECT id, name FROM sys_features"
    );

    const permissionsData = [${permissionsDataString}
    ];

    const tableName = 'sys_permissions';
    const uniqueKey = 'key';
    await intelligentUpsert(queryInterface, tableName, permissionsData, uniqueKey);
  },

  async down(queryInterface) {
    const permissionKeys = ${JSON.stringify(permissions.map((p) => p.key))};
    await queryInterface.bulkDelete('sys_permissions', { key: permissionKeys });
  },
};
`;

  await fs.writeFile(
    PERMISSIONS_SEEDER_FILE,
    seederTemplate.trim(),
  );
  console.log(
    `✅ Generated permissions seeder: ${PERMISSIONS_SEEDER_FILE}`,
  );
}

/**
 * Main sync function
 */
async function syncPermissionsSeeder() {
  console.log(
    '🚀 Starting permission sync with module/feature extraction...\n',
  );

  const controllerFiles = await glob(
    CONTROLLERS_PATH,
    {
      cwd: path.join(__dirname, '..'),
      absolute: true,
      windowsPathsNoEscape: true,
    },
  );
  console.log(
    `📁 Found ${controllerFiles.length} controller files to scan.\n`,
  );

  let allCodePermissions = [];
  const modules = new Set();
  const features = new Map();

  for (const file of controllerFiles) {
    const content = await fs.readFile(
      file,
      'utf-8',
    );
    const permissionsInFile =
      extractPermissionsFromCode(content);

    permissionsInFile.forEach((p) => {
      if (p.module && p.feature) {
        modules.add(p.module);
        features.set(p.feature, p.module);
      }
    });

    allCodePermissions =
      allCodePermissions.concat(
        permissionsInFile,
      );
  }

  const uniquePermissions =
    allCodePermissions.filter(
      (p, index, self) =>
        index ===
        self.findIndex((t) => t.key === p.key),
    );

  console.log(`\n📊 Summary:`);
  console.log(
    `   - Modules found: ${modules.size}`,
  );
  console.log(
    `   - Features found: ${features.size}`,
  );
  console.log(
    `   - Permissions found: ${uniquePermissions.length}\n`,
  );

  console.log(`📦 Modules:`);
  Array.from(modules)
    .sort()
    .forEach((m) => console.log(`   - ${m}`));

  console.log(`\n🎯 Features:`);
  Array.from(features.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([feature, module]) =>
      console.log(`   - ${feature} (${module})`),
    );

  console.log(`\n🔑 Sample Permissions:`);
  uniquePermissions.slice(0, 10).forEach((p) => {
    console.log(
      `   - ${p.key} [${p.resource}:${p.action}:${p.context}] - ${p.module} > ${p.feature}`,
    );
  });

  await generateModulesSeeder(modules);
  await generateFeaturesSeeder(features);
  await generatePermissionsSeeder(
    uniquePermissions,
  );

  console.log(
    `\n✅ Successfully generated all seeder files!`,
  );
  console.log(`\n⚠️  Next steps:`);
  console.log(
    `   1. Run: npx sequelize-cli db:seed --seed initial-modules.js`,
  );
  console.log(
    `   2. Run: npx sequelize-cli db:seed --seed initial-features.js`,
  );
  console.log(
    `   3. Run: npx sequelize-cli db:seed --seed initial-permissions.js`,
  );
}

syncPermissionsSeeder().catch(console.error);
