import * as fs from 'fs';
import * as path from 'path';
import {
  Model,
  ModelCtor,
  Sequelize,
} from 'sequelize-typescript'; 
export * from './projects/project/pr_project_model';
export * from './projects/project/pr_site.model';

/**
 * A specific type alias for a class that extends Sequelize's Model.
 * This ensures type compatibility with sequelize.addModels().
 */
type SequelizeModelClass = ModelCtor<
  Model<any, any>
>;

/**
 * Interface for the dynamically required module.
 * Properties are 'unknown' to handle various export styles.
 */
interface ModelModule {
  default?: unknown;
  [key: string]: unknown;
}

/**
 * Type guard to check if a value is a valid Sequelize model class.
 * It verifies that the value is a function and its prototype is an instance of Sequelize's Model.
 * @param value The value to check.
 * @returns True if the value is a valid Sequelize model class, otherwise false.
 */
function isSequelizeModel(
  value: unknown,
): value is SequelizeModelClass {
  return (
    typeof value === 'function' &&
    value.prototype instanceof Model
  );
}

/**
 * Scans directories for model files and adds them to the Sequelize instance.
 * @param sequelize The Sequelize instance to add models to.
 */
export function loadModels(sequelize: Sequelize) {
  const modelsPath = path.join(__dirname);
  console.log('Loading models from:', modelsPath);

  function scanDirectory(dirPath: string) {
    const items = fs.readdirSync(dirPath, {
      withFileTypes: true,
    });

    for (const item of items) {
      const fullPath = path.join(
        dirPath,
        item.name,
      );

      if (item.isDirectory()) {
        // Recursively scan subdirectories, skipping node_modules
        if (item.name === 'node_modules') {
          continue;
        }
        console.log(
          'Scanning subdirectory:',
          item.name,
        );
        scanDirectory(fullPath);
      } else if (
        item.isFile() &&
        (item.name.endsWith('.model.ts') ||
          item.name.endsWith('.model.js'))
      ) {
        try {
          console.log(
            'Loading model file:',
            item.name,
          );
          const modelModule = require(
            fullPath,
          ) as ModelModule;

          let modelClass: SequelizeModelClass | null =
            null;

          // Check for a default export that is a Sequelize model
          if (
            isSequelizeModel(modelModule.default)
          ) {
            modelClass = modelModule.default;
          } else {
            // If no default, check for a named export that is a Sequelize model
            const exports =
              Object.values(modelModule);
            const foundModel = exports.find(
              isSequelizeModel,
            );
            modelClass = foundModel || null;
          }

          if (modelClass) {
            console.log(
              'Adding model:',
              modelClass.name,
            );
            sequelize.addModels([modelClass]);
          } else {
            console.warn(
              `No valid Sequelize model class found in: ${item.name}`,
            );
          }
        } catch (error) {
          console.error(
            `Error loading model file ${item.name}:`,
            error,
          );
        }
      }
    }
  }

  scanDirectory(modelsPath);
  console.log('Model loading completed.');
}
