import {
  plainToClass,
  ClassTransformOptions,
} from 'class-transformer';
import {
  validateSync,
  ValidationError,
} from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

/**
 * Custom error class for configuration validation
 */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: ValidationError[],
  ) {
    super(message);
    this.name = 'ConfigValidationError';
  }
}

/**
 * Recursively formats nested validation errors
 */
function formatNestedValidationErrors(
  errors: ValidationError[],
  depth = 0,
): string {
  const indent = '  '.repeat(depth);

  return errors
    .map((error) => {
      const constraints = error.constraints
        ? Object.values(error.constraints).join(
            ', ',
          )
        : null;

      let result = `${indent}- ${error.property}`;

      if (constraints) {
        result += `: ${constraints}`;
      }

      if (
        error.children &&
        error.children.length > 0
      ) {
        result += `\n${formatNestedValidationErrors(error.children, depth + 1)}`;
      }

      return result;
    })
    .join('\n');
}

/**
 * Validates configuration against a class validator
 *
 * @param config - Configuration object to validate
 * @param envVariablesClass - Class with validation decorators
 * @param options - Transformation and validation options
 * @returns Validated configuration
 * @throws ConfigValidationError if validation fails
 */
function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
  options?: {
    /** Class transformer options */
    transformOptions?: ClassTransformOptions;
    /** Whether to strip unknown properties */
    stripUnknown?: boolean;
    /** Whether to expose validation error details in the error message */
    verbose?: boolean;
  },
): T {
  const {
    transformOptions = {
      enableImplicitConversion: true,
      excludeExtraneousValues:
        options?.stripUnknown ?? false,
    },
    verbose = false,
  } = options || {};

  // Transform plain object to class instance
  const validatedConfig = plainToClass(
    envVariablesClass,
    config,
    transformOptions,
  );

  // Validate the class instance
  const errors = validateSync(
    validatedConfig as object,
    {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted:
        options?.stripUnknown ?? false,
      validationError: {
        target: false, // Don't include target object in error
        value: verbose, // Include value only in verbose mode
      },
    },
  );

  // If validation errors exist, throw detailed error
  if (errors.length > 0) {
    const errorMessage = verbose
      ? `Configuration validation failed:\n${formatNestedValidationErrors(errors)}`
      : `Configuration validation failed for: ${errors.map((e) => e.property).join(', ')}`;

    throw new ConfigValidationError(
      errorMessage,
      errors,
    );
  }

  return validatedConfig;
}

/**
 * Validates configuration with all properties required
 * Use this for essential environment variables
 */
export function validateRequiredConfig<
  T extends object,
>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  return validateConfig(
    config,
    envVariablesClass,
    {
      stripUnknown: true,
      verbose: true,
    },
  );
}

/**
 * Validates configuration with optional properties allowed
 * Use this for configurations with defaults
 */
export function validateOptionalConfig<
  T extends object,
>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
): T {
  return validateConfig(
    config,
    envVariablesClass,
    {
      stripUnknown: false,
      verbose: false,
      transformOptions: {
        enableImplicitConversion: true,
        excludeExtraneousValues: false,
      },
    },
  );
}

/**
 * Helper to get validated configuration with fallback values
 */
export function getValidatedConfig<
  T extends object,
>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
  defaults?: Partial<T>,
): T {
  try {
    const validated = validateConfig(
      config,
      envVariablesClass,
      {
        stripUnknown: true,
        verbose: true,
      },
    );

    // Apply defaults for any missing properties
    if (defaults) {
      return { ...defaults, ...validated };
    }

    return validated;
  } catch (error) {
    if (error instanceof ConfigValidationError) {
      console.error(
        'Configuration error:',
        error.message,
      );

      // If we have defaults, use them and log warning
      if (defaults) {
        console.warn(
          'Using default configuration due to validation errors',
        );
        return defaults as T;
      }
    }

    throw error;
  }
}

export default validateConfig;
