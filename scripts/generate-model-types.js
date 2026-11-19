// Guard against running heavy AST scanning in CI/Production builds
if (
  process.env.CI ||
  process.env.VERCEL ||
  process.env.RENDER ||
  process.env.NODE_ENV === 'production' ||
  process.env.SKIP_MODEL_TYPES
) {
  console.log(
    '⚡ CI/Production build detected. Skipping AST model type generation as types are already committed.',
  );
  process.exit(0);
}

let Project, SyntaxKind;
try {
  const tsMorph = require('ts-morph');
  Project = tsMorph.Project;
  SyntaxKind = tsMorph.SyntaxKind;
} catch (e) {
  console.warn('⚠️ ts-morph is not installed (production/CI mode). Skipping model types generation as types are already committed.');
  process.exit(0);
}
const fs = require('fs');
const path = require('path');
const glob = require('glob');

class SequelizeTypeGenerator {
  constructor(config) {
    this.config = config;
    this.project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    // Cache for model locations with exact file paths
    this.modelLocations = new Map();
    this.modelNameCounts = new Map();
    this.scanModelLocations();

    if (this.config.outputPath) {
      const outputDir = path.resolve(
        this.config.outputPath,
      );
      try {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, {
            recursive: true,
          });
          console.log(
            `✅ Created output directory: ${outputDir}`,
          );
        }
      } catch (err) {
        console.error(
          `❌ Failed to create output directory ${outputDir}:`,
          err.message,
        );
        throw err;
      }
    }
  }

  scanModelLocations() {
    console.log(
      '🔍 Scanning model locations for import paths...',
    );
    const modelFiles = glob.sync(
      this.config.modelPath,
    );

    modelFiles.forEach((filePath) => {
      // Read the file to extract the actual class name
      try {
        const sourceFile = this.project.addSourceFileAtPath(filePath);
        const modelClasses = this.findModelClasses(sourceFile);

        modelClasses.forEach((modelClass) => {
          const className = modelClass.getName();
          this.modelNameCounts.set(
            className,
            (this.modelNameCounts.get(className) || 0) + 1,
          );
          this.modelLocations.set(
            className,
            filePath,
          );
          console.log(
            `📍 Found ${className} at ${filePath}`,
          );
        });
      } catch (error) {
        console.error(
          `❌ Error reading ${filePath}:`,
          error.message,
        );
      }
    });

    console.log(
      `📊 Cached ${this.modelLocations.size} model locations`,
    );
  }

  generateTypes() {
    console.log(
      '🔍 Scanning for Sequelize models...',
    );

    const modelFiles = glob.sync(
      this.config.modelPath,
    );
    console.log(
      `📁 Found ${modelFiles.length} model files`,
    );

    const generatedFiles = new Set();
    modelFiles.forEach((filePath) => {
      const generatedFilesForModelFile = this.processModelFile(filePath);
      (generatedFilesForModelFile || []).forEach((generatedFile) => {
        generatedFiles.add(path.resolve(generatedFile));
      });
    });

    if (this.config.outputPath) {
      const outputDir = path.resolve(this.config.outputPath);
      if (fs.existsSync(outputDir)) {
        const existingTypeFiles = glob.sync(`${outputDir}/**/*.types.ts`);
        existingTypeFiles.forEach((typeFile) => {
          if (!generatedFiles.has(path.resolve(typeFile))) {
            console.log(`🗑️  Removing stale type file: ${typeFile}`);
            fs.unlinkSync(typeFile);
          }
        });
      }
    }

    console.log('✅ Type generation complete!');
  }

  extractImportedEnums(sourceFile) {
    const importedEnums = []; // <-- Fix: declare the array!
    const imports =
      sourceFile.getImportDeclarations();
    imports.forEach((imp) => {
      imp.getNamedImports().forEach((named) => {
        const name = named.getName();
        importedEnums.push({
          name,
          path: imp.getModuleSpecifierValue(),
        });
      });
    });
    return importedEnums;
  }

  processModelFile(filePath) {
    try {
      const sourceFile =
        this.project.addSourceFileAtPath(
          filePath,
        );
      const modelClasses = this.findModelClasses(sourceFile);

      if (modelClasses.length === 0) {
        console.log(
          `⚠️  No model class found in ${filePath}`,
        );
        return [];
      }
      return modelClasses.map((modelClass) => {
        console.log(`🔧 Processing ${modelClass.getName()}...`);
        const modelInfo = this.extractModelInfo(modelClass, sourceFile);
        return this.generateTypeFile(modelInfo, filePath);
      });
    } catch (error) {
      console.error(
        `❌ Error processing ${filePath}:`,
        error.message,
      );
    }
  }

  findModelClasses(sourceFile) {
    return sourceFile.getClasses().filter((modelClass) => {
      if (!modelClass.isExported() || !modelClass.getDecorator('Table')) {
        return false;
      }
      let baseClass = modelClass.getBaseClass();
      while (baseClass) {
        const name = baseClass.getName();
        if (name === 'BaseModel' || name === 'Model') return true;
        baseClass = baseClass.getBaseClass();
      }
      return false;
    });
  }

  extractModelInfo(modelClass, sourceFile) {
    const properties = [];
    const relations = [];
    const className = modelClass.getName();
    let baseClass = modelClass.getBaseClass();
    let baseClassName = baseClass?.getName();
    while (baseClass && baseClassName !== 'BaseModel' && baseClassName !== 'Model') {
      baseClass = baseClass.getBaseClass();
      baseClassName = baseClass?.getName();
    }
    const enums = this.extractEnums(sourceFile);
    const importedEnums =
      this.extractImportedEnums(sourceFile);
    const allEnums = [...enums, ...importedEnums];
    const modelMetadata =
      this.extractModelMetadata(
        modelClass,
        sourceFile,
      );

    // Get all properties
    const classHierarchy = [];
    let currentClass = modelClass;
    while (currentClass) {
      classHierarchy.unshift(currentClass);
      const parent = currentClass.getBaseClass();
      if (!parent || parent.getName() === 'BaseModel' || parent.getName() === 'Model') break;
      currentClass = parent;
    }
    const classProperties = classHierarchy.flatMap((classDeclaration) => classDeclaration.getProperties());

    classProperties.forEach((prop) => {
      const columnDecorator =
        prop.getDecorator('Column');
      if (columnDecorator) {
        const propInfo = this.extractPropertyInfo(
          prop,
          enums,
        );
        if (propInfo) {
          properties.push(propInfo);
        }
      }

      // Extract relationship properties
      const relationInfo =
        this.extractRelationInfo(prop);
      if (relationInfo) {
        relations.push(relationInfo);
      }
    });

    return {
      className,
      baseClassName,
      properties,
      relations,
      enums: allEnums,
      modelMetadata,
      tableName:
        this.extractTableName(modelClass),
    };
  }

  extractModelMetadata(modelClass, sourceFile) {
    const tableDecorator =
      modelClass.getDecorator('Table');
    const metadata = {
      isViewModel:
        modelClass
          .getName()
          .endsWith('View') ||
        sourceFile
          .getBaseName()
          .includes('_view.'),
    };

    if (!tableDecorator) {
      return metadata;
    }

    const args = tableDecorator.getArguments();
    if (args.length === 0) {
      return metadata;
    }

    return metadata;
  }

  extractRelationInfo(property) {
    const decorators = property.getDecorators();
    const relationDecorators = [
      'HasMany',
      'BelongsTo',
      'BelongsToMany',
      'HasOne',
    ];

    for (const decorator of decorators) {
      const decoratorName = decorator.getName();
      if (
        relationDecorators.includes(decoratorName)
      ) {
        const name = property.getName();
        const typeNode = property.getTypeNode();
        let relationType = 'any';

        if (typeNode) {
          relationType = typeNode.getText();
        }

        // Extract related model from decorator arguments
        const args = decorator.getArguments();
        let relatedModel = 'any';
        if (args.length > 0) {
          const firstArg = args[0].getText();
          // Extract model name from () => ModelName pattern
          const modelMatch = firstArg.match(
            /\(\)\s*=>\s*(\w+)/,
          );
          if (modelMatch) {
            relatedModel = modelMatch[1];
          }
        }

        // Better optional detection
        const isOptional =
          property.hasQuestionToken() ||
          (typeNode &&
            (typeNode.getText().includes('?') ||
              typeNode
                .getText()
                .includes('undefined')));

        return {
          name,
          type: relationType,
          decoratorType: decoratorName,
          relatedModel,
          optional: isOptional,
        };
      }
    }
    return null;
  }

  extractEnums(sourceFile) {
    const enums = [];
    const enumDeclarations =
      sourceFile.getEnums();

    enumDeclarations.forEach((enumDecl) => {
      enums.push({
        name: enumDecl.getName(),
        values: enumDecl
          .getMembers()
          .map((member) => ({
            name: member.getName(),
            value: member.getValue(),
          })),
      });
    });

    return enums;
  }

  extractPropertyInfo(property, enums) {
    const name = property.getName();
    const typeNode = property.getTypeNode();

    let tsType = 'any';
    if (typeNode) {
      tsType = typeNode.getText();
    } else {
      const columnDecorator =
        property.getDecorator('Column');
      if (columnDecorator) {
        tsType = this.inferTypeFromDecorator(
          columnDecorator,
          enums,
        );
      }
    }

    const isOptional =
      property.hasQuestionToken() ||
      tsType.includes('undefined');

    let allowNull = false;
    let hasDefaultValue = false;
    let isAutoIncrement = false;

    const columnDecorator =
      property.getDecorator('Column');
    if (columnDecorator) {
      const decoratorText =
        columnDecorator.getFullText();

      // Check for allowNull
      if (
        decoratorText.includes('allowNull: true')
      ) {
        allowNull = true;
      }

      // Check for default values
      if (
        decoratorText.includes('defaultValue:') ||
        decoratorText.includes('DataType.NOW') ||
        decoratorText.includes(
          'DataType.UUIDV4',
        ) ||
        decoratorText.includes('defaultValue')
      ) {
        hasDefaultValue = true;
      }

      // Check for auto increment
      if (
        decoratorText.includes(
          'autoIncrement: true',
        )
      ) {
        isAutoIncrement = true;
      }
    }

    // Check for primary key decorator (usually has auto increment)
    const primaryKeyDecorator =
      property.getDecorator('PrimaryKey');
    if (primaryKeyDecorator) {
      isAutoIncrement = true;
    }

    // Check for auto increment decorator
    const autoIncrementDecorator =
      property.getDecorator('AutoIncrement');
    if (autoIncrementDecorator) {
      isAutoIncrement = true;
    }

    let finalType = tsType.replace(
      ' | undefined',
      '',
    );
    if (
      allowNull &&
      !finalType.includes('null')
    ) {
      finalType += ' | null';
    }

    return {
      name,
      type: finalType,
      optional: isOptional,
      hasDefaultValue,
      isAutoIncrement,
      allowNull,
    };
  }

  inferTypeFromDecorator(decorator, enums) {
    const decoratorText = decorator.getFullText();

    if (decoratorText.includes('DataType.ENUM')) {
      const enumMatch = decoratorText.match(
        /Object\.values\((\w+)\)/,
      );
      if (enumMatch) {
        const enumName = enumMatch[1];
        const foundEnum = enums.find(
          (e) => e.name === enumName,
        );
        if (foundEnum) {
          return enumName;
        }
      }
      return 'string';
    }

    if (
      decoratorText.includes('DataType.ARRAY')
    ) {
      // Check if it's an array of enums
      const enumMatch = decoratorText.match(
        /Object\.values\((\w+)\)/,
      );
      if (enumMatch) {
        const enumName = enumMatch[1];
        const foundEnum = enums.find(
          (e) => e.name === enumName,
        );
        if (foundEnum) {
          return `${enumName}[]`; // Return array of enum type
        }
      }
      return 'any[]';
    }

    const typeMap = {
      'DataType.STRING': 'string',
      'DataType.TEXT': 'string',
      'DataType.INTEGER': 'number',
      'DataType.BIGINT': 'number',
      'DataType.SMALLINT': 'number',
      'DataType.MEDIUMINT': 'number',
      'DataType.FLOAT': 'number',
      'DataType.DOUBLE': 'number',
      'DataType.REAL': 'number',
      'DataType.DECIMAL': 'number',
      'DataType.NUMERIC': 'number',
      'DataType.BOOLEAN': 'boolean',
      'DataType.DATE': 'Date',
      'DataType.DATEONLY': 'Date',
      'DataType.TIME': 'string',
      'DataType.NOW': 'Date',
      'DataType.UUID': 'string',
      'DataType.UUIDV1': 'string',
      'DataType.UUIDV4': 'string',
      'DataType.JSON': 'any',
      'DataType.JSONB': 'any',
      'DataType.BLOB': 'Buffer',
      'DataType.CHAR': 'string',
      'DataType.BINARY': 'Buffer',
      'DataType.VARBINARY': 'Buffer',
    };

    for (const [
      sequelizeType,
      tsType,
    ] of Object.entries(typeMap)) {
      if (decoratorText.includes(sequelizeType)) {
        return tsType;
      }
    }

    return 'any';
  }

  extractTableName(modelClass) {
    const tableDecorator =
      modelClass.getDecorator('Table');
    if (tableDecorator) {
      const args = tableDecorator.getArguments();
      if (args.length > 0) {
        const config = args[0];
        const configText = config.getText();
        const tableNameMatch = configText.match(
          /tableName:\s*['"`]([^'"`]+)['"`]/,
        );
        if (tableNameMatch) {
          return tableNameMatch[1];
        }
      }
    }
    return null;
  }

  generateTypeFile(modelInfo, originalFilePath) {
    const {
      className,
      baseClassName,
      properties,
      relations,
      enums,
      modelMetadata,
    } = modelInfo;

    // Generate enum imports
    const enumImports = this.generateEnumImports(
      properties,
      enums,
      originalFilePath,
    );

    // Generate relation imports with FIXED paths
    const relationImports =
      this.generateRelationImports(
        relations,
        originalFilePath,
      );

    // Generate properties section
    const propertiesSection = properties
      .map((prop) => {
        const optional = prop.optional ? '?' : '';
        return `  ${prop.name}${optional}: ${prop.type};`;
      })
      .join('\n');

    // Generate relations section with proper optional marking
    const relationsSection =
      relations.length > 0
        ? '\n\n  // Relations\n' +
          relations
            .map((rel) => {
              const optional = rel.optional
                ? '?'
                : '';
              return `  ${rel.name}${optional}: ${rel.type};`;
            })
            .join('\n')
        : '';

    const baseAttributeLines = [];

    if (baseClassName === 'BaseModel') {
      baseAttributeLines.push(
        '  id: number;',
        '  uuid: string;',
        '  createdAt: Date;',
        '  updatedAt: Date;',
        '  deletedAt?: Date;',
      );
    }

    const baseAttributesSection =
      baseAttributeLines.join('\n');

    const inheritedFieldNames = new Set();
    if (baseClassName === 'BaseModel') {
      inheritedFieldNames.add('id');
      inheritedFieldNames.add('uuid');
      inheritedFieldNames.add('createdAt');
      inheritedFieldNames.add('updatedAt');
      inheritedFieldNames.add('deletedAt');
    }

    const displayProperties = properties.filter(
      (prop) =>
        !inheritedFieldNames.has(prop.name),
    );

    const creationExcludedFields = [
    ];

    if (baseClassName === 'BaseModel') {
      creationExcludedFields.push(
        'id',
        'uuid',
        'createdAt',
        'updatedAt',
        'deletedAt',
      );
    }

    const regeneratedCreationProperties = properties
      .filter(
        (prop) =>
          !creationExcludedFields.includes(
            prop.name,
          ),
      )
      .map((prop) => {
        const shouldBeOptional =
          prop.optional ||
          prop.hasDefaultValue ||
          prop.isAutoIncrement ||
          prop.name === 'uuid' ||
          prop.allowNull;

        const optional = shouldBeOptional
          ? '?'
          : '';

        let comment = '';
        if (
          prop.hasDefaultValue &&
          !prop.optional
        ) {
          comment = ' // Has default value';
        }
        if (
          prop.isAutoIncrement &&
          !prop.optional
        ) {
          comment = ' // Auto increment';
        }
        if (
          prop.allowNull &&
          !prop.optional &&
          !prop.hasDefaultValue
        ) {
          comment = ' // Nullable';
        }

        return `  ${prop.name}${optional}: ${prop.type};${comment}`;
      })
      .join('\n');

    const attributesBody = [
      baseAttributesSection,
      displayProperties
        .map((prop) => {
          const optional = prop.optional ? '?' : '';
          return `  ${prop.name}${optional}: ${prop.type};`;
        })
        .join('\n'),
    ]
      .filter(Boolean)
      .join('\n');

    const fileContent = `// Auto-generated types for ${className}
// Source: ${path.relative(process.cwd(), originalFilePath).replace(/\\/g, '/')}

${enumImports}${relationImports}export interface ${className}Attributes {
${attributesBody}${relationsSection}
}

export interface ${className}CreationAttributes {${regeneratedCreationProperties ? '\n' + regeneratedCreationProperties : '\n  // No additional properties'}
}

export type ${className}UpdateAttributes = Partial<${className}CreationAttributes>;

// Helper type for including relations
export interface ${className}WithRelations extends ${className}Attributes {${
      relations.length > 0
        ? relations
            .map((rel) => {
              const optional = rel.optional
                ? '?'
                : '';
              return `\n  ${rel.name}${optional}: ${rel.type};`;
            })
            .join('')
        : '\n  // No relations defined'
    }
}
`;

    const outputDir =
      this.config.outputPath ||
      path.dirname(originalFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    const outputFile = path.join(
      outputDir,
      this.modelNameCounts.get(className) > 1
        ? `${path.basename(originalFilePath, '.ts').replace(/_model$/, '')}.types.ts`
        : `${className.toLowerCase()}.types.ts`,
    );
    fs.writeFileSync(outputFile, fileContent);

    console.log(
      `📝 Generated types: ${outputFile}`,
    );
    this.updateModelFile(
      originalFilePath,
      className,
      outputFile,
    );
    return outputFile;
  }

  // COMPLETELY FIXED PATH GENERATION
  generateRelationImports(
    relations,
    originalFilePath,
  ) {
    if (relations.length === 0) return '';

    const relatedModels = new Set();
    relations.forEach((rel) => {
      if (
        rel.relatedModel &&
        rel.relatedModel !== 'any'
      ) {
        relatedModels.add(rel.relatedModel);
      }
    });

    if (relatedModels.size === 0) return '';

    const typesDir = path.resolve(
      this.config.outputPath,
    ); // Absolute path to types dir
    const imports = [];

    Array.from(relatedModels).forEach((model) => {
      let importedModelName = model;
      let modelFilePath = this.modelLocations.get(model);

      // Resolve relation aliases such as `MainBooking as Booking`.
      if (!modelFilePath) {
        const relationSource = this.project.getSourceFile(originalFilePath);
        const aliasedImport = relationSource?.getImportDeclarations()
          .flatMap((imp) => imp.getNamedImports())
          .find((named) => named.getAliasNode()?.getText() === model);

        if (aliasedImport) {
          importedModelName = aliasedImport.getName();
          modelFilePath = this.modelLocations.get(importedModelName);
        }
      }

      if (modelFilePath) {
        console.log(
          `🔗 Linking ${model} from ${modelFilePath}`,
        );

        // Calculate relative path from types directory to the model file
        const absoluteModelPath = path.resolve(
          modelFilePath,
        );
        let relativePath = path
          .relative(typesDir, absoluteModelPath)
          .replace(/\\/g, '/') // Convert Windows paths to Unix style
          .replace('.ts', ''); // Remove .ts extension

        // Ensure the path starts with ../
        if (!relativePath.startsWith('../')) {
          relativePath = '../' + relativePath;
        }

        const importName = importedModelName === model
          ? importedModelName
          : `${importedModelName} as ${model}`;
        imports.push(
          `import type { ${importName} } from '${relativePath}';`,
        );
        console.log(
          `✅ Generated import: import type { ${model} } from '${relativePath}';`,
        );
      } else {
        console.log(
          `⚠️  Model ${model} not found in cache, generating fallback import`,
        );
        imports.push(
          `// import type { ${model} } from '../models/.../${model.toLowerCase()}.model';`,
        );
      }
    });

    return `${imports.join('\n')}\n\n`;
  }
  generateEnumImports(
    properties,
    enums,
    originalFilePath,
  ) {
    const usedEnums = new Set();

    properties.forEach((prop) => {
      enums.forEach((enumInfo) => {
        // ✅ FIX: Extract base type by removing | null, | undefined, [], etc.
        const baseType = prop.type
          .replace(/\s*\|\s*null/g, '')
          .replace(/\s*\|\s*undefined/g, '')
          .replace(/\[\]/g, '')
          .trim();

        // Check for exact match, array type, or nullable enum
        if (
          baseType === enumInfo.name ||
          prop.type === enumInfo.name ||
          prop.type === `${enumInfo.name}[]` ||
          prop.type.includes(
            `${enumInfo.name} |`,
          ) ||
          prop.type.includes(`| ${enumInfo.name}`)
        ) {
          usedEnums.add(enumInfo.name);
        }
      });
    });

    if (usedEnums.size === 0) {
      return '';
    }

    const imports = [];
    const typesDir = path.resolve(
      this.config.outputPath,
    );

    usedEnums.forEach((enumName) => {
      const enumInfo = enums.find(
        (e) => e.name === enumName,
      );
      if (enumInfo && enumInfo.path) {
        // If it's a local file, resolve the path
        if (
          enumInfo.path.startsWith('.') ||
          enumInfo.path.startsWith('/')
        ) {
          // Try to resolve the absolute path of the enum file
          let enumFilePath = enumInfo.path;
          if (!enumFilePath.endsWith('.ts')) {
            enumFilePath += '.ts';
          }
          // Try to find the actual file
          let absoluteEnumPath = path.resolve(
            path.dirname(originalFilePath),
            enumFilePath,
          );
          if (!fs.existsSync(absoluteEnumPath)) {
            // Fallback: try from project root
            absoluteEnumPath = path.resolve(
              process.cwd(),
              enumFilePath,
            );
          }
          let relativePath = path
            .relative(typesDir, absoluteEnumPath)
            .replace(/\\/g, '/')
            .replace(/\.ts$/, '');
          if (!relativePath.startsWith('../')) {
            relativePath = '../' + relativePath;
          }
          imports.push(
            `import { ${enumName} } from '${relativePath}';`,
          );
        } else {
          // For package imports, use as-is
          imports.push(
            `import { ${enumName} } from '${enumInfo.path}';`,
          );
        }
      } else {
        // Fallback: try relative path from model file
        const relativePath = path
          .relative(typesDir, originalFilePath)
          .replace(/\\/g, '/')
          .replace('.ts', '');
        imports.push(
          `import { ${enumName} } from '${relativePath}';`,
        );
      }
    });

    return `${imports.join('\n')}\n\n`;
  }

  updateModelFile(
    filePath,
    className,
    typesFilePath,
  ) {
    try {
      let content = fs.readFileSync(
        filePath,
        'utf8',
      );

      const relativePath = path
        .relative(
          path.dirname(filePath),
          typesFilePath,
        )
        .replace(/\\/g, '/')
        .replace('.ts', '');
      const hasDisambiguatedTypesFile =
        path.basename(typesFilePath) !== `${className.toLowerCase()}.types.ts`;
      const typeModulePath = hasDisambiguatedTypesFile
        ? `src/database/types/${path.basename(typesFilePath, '.ts')}`
        : relativePath;

      const importStatement = `import type { ${className}Attributes, ${className}CreationAttributes } from '${typeModulePath}';`;

      const typeImportRegex = new RegExp(
        `import(?:\\s+type)?\\s+\\{[^}]*\\b${className}Attributes\\b[^}]*\\b${className}CreationAttributes\\b[^}]*\\}\\s+from\\s+['"][^'"]+['"];?`,
      );

      const existingTypeImport = content.match(typeImportRegex);
      if (existingTypeImport) {
        if (!hasDisambiguatedTypesFile) {
          console.log(
            `📄 Types already imported in ${filePath}`,
          );
          return;
        }

        const updatedTypeImport = existingTypeImport[0].replace(
          /from\s+(['"])[^'"]+\1/,
          `from '${typeModulePath}'`,
        );
        if (updatedTypeImport !== existingTypeImport[0]) {
          content = content.replace(
            existingTypeImport[0],
            updatedTypeImport,
          );
          fs.writeFileSync(filePath, content);
        }
        console.log(
          `📄 Types already imported in ${filePath}`,
        );
        return;
      }

      // Insert after the full leading import block, including multiline imports
      const importBlockMatch = content.match(
        /^(?:import[\s\S]*?;\n\s*)+/,
      );
      if (importBlockMatch) {
        const insertIndex =
          importBlockMatch[0].length;
        content =
          content.slice(0, insertIndex) +
          importStatement +
          '\n\n' +
          content.slice(insertIndex);
      } else {
        content =
          importStatement +
          '\n\n' +
          content;
      }

      // Update class declaration to include generic types
      const classRegex = new RegExp(
        `export class ${className} extends (BaseModel|TenantBaseModel)(?:<[^>]*>)?`,
      );
      const classMatch =
        content.match(classRegex);

      if (classMatch) {
        const replacement = `export class ${className} extends ${classMatch[1]}<${className}Attributes, ${className}CreationAttributes>`;
        content = content.replace(
          classRegex,
          replacement,
        );

        fs.writeFileSync(filePath, content);
        console.log(
          `📝 Updated model file: ${filePath}`,
        );
      } else {
        console.log(
          `⚠️  Could not find class declaration in ${filePath}`,
        );
      }
    } catch (error) {
      console.error(
        `❌ Error updating model file ${filePath}:`,
        error.message,
      );
    }
  }
}

// Configuration
const config = {
  modelPath: ['src/database/models/**/*.model.ts', 'src/database/models/**/*.ts'],
  outputPath: 'src/database/types',
};

// Run generator with error handling
try {
  const generator = new SequelizeTypeGenerator(
    config,
  );
  generator.generateTypes();
} catch (error) {
  console.error(
    '❌ Fatal error during type generation:',
    error,
  );
  process.exit(1);
}
