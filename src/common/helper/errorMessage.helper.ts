import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export class ErrorHandlerHelper {
  private static readonly logger = new Logger(
    ErrorHandlerHelper.name,
  );

  /**
   * Simple error handler - just pass your custom message
   * It will handle database errors automatically and use your message when appropriate
   */
  static handleError(
    error: any,
    customMessage?: string,
  ): never {
    // Convert error to string for comprehensive checking
    const errorString =
      this.getErrorString(error);

    // Log the error
    this.logger.error(
      customMessage || 'Operation failed',
      error.stack,
    );

    // Preserve status code and response of existing NestJS exceptions.
    if (error instanceof HttpException) {
      throw error;
    }

    // Handle foreign key constraint errors - CHECK THIS FIRST
    if (
      error.name ===
        'SequelizeForeignKeyConstraintError' ||
      errorString.includes(
        'foreign key constraint',
      ) ||
      errorString.includes(
        'violates foreign key constraint',
      ) ||
      errorString.includes('fk_') ||
      errorString.includes(
        'violates foreign key',
      ) ||
      errorString.includes(
        'is not present in table',
      ) ||
      errorString.includes(
        'insert or update on table',
      ) ||
      errorString.includes(
        'referenced relation',
      ) ||
      (errorString.includes('Key (') &&
        errorString.includes(') is not present'))
    ) {
      const field =
        this.extractFieldFromError(error);
      throw new BadRequestException(
        customMessage ||
          `Invalid ${field || 'reference'}. The referenced record does not exist.`,
      );
    }

    // Handle "already exists" errors
    if (errorString.includes('already exists')) {
      throw new BadRequestException(
        customMessage ||
          'Resource already exists',
      );
    }

    // Handle Sequelize unique constraint errors
    if (
      error.name ===
        'SequelizeUniqueConstraintError' ||
      errorString.includes(
        'SequelizeUniqueConstraintError',
      ) ||
      errorString.includes(
        'duplicate key value',
      ) ||
      errorString.includes(
        'violates unique constraint',
      ) ||
      errorString.includes('unique_') ||
      errorString.includes('UNIQUE constraint')
    ) {
      const field =
        this.extractFieldFromError(error);
      throw new BadRequestException(
        customMessage ||
          `This ${field || 'value'} already exists`,
      );
    }

    // Handle not-null constraint errors
    if (
      error.name === 'SequelizeValidationError' ||
      errorString.includes(
        'violates not-null constraint',
      ) ||
      errorString.includes('cannot be null') ||
      errorString.includes('notNull Violation') ||
      errorString.includes('null value in column')
    ) {
      const field =
        this.extractFieldFromError(error);
      throw new BadRequestException(
        customMessage ||
          `Required field ${field || ''} is missing`,
      );
    }

    // Handle data type validation errors
    if (
      errorString.includes(
        'invalid input syntax',
      ) ||
      errorString.includes('invalid value') ||
      errorString.includes('cannot cast') ||
      errorString.includes(
        'invalid text representation',
      )
    ) {
      throw new BadRequestException(
        customMessage || 'Invalid data format',
      );
    }

    // Handle date format errors
    if (
      errorString.includes(
        'invalid input syntax for type date',
      ) ||
      errorString.includes(
        'date/time field value out of range',
      ) ||
      errorString.includes('timestamp')
    ) {
      throw new BadRequestException(
        customMessage || 'Invalid date format',
      );
    }

    // Handle enum validation errors
    if (
      errorString.includes(
        'invalid input value for enum',
      ) ||
      errorString.includes('must be one of')
    ) {
      throw new BadRequestException(
        customMessage || 'Invalid value provided',
      );
    }

    // Handle connection errors
    if (
      errorString.includes('connection') ||
      errorString.includes('ECONNREFUSED') ||
      errorString.includes('timeout') ||
      errorString.includes('ETIMEDOUT')
    ) {
      this.logger.error(
        'Database connection error',
        error.stack,
      );
      throw new InternalServerErrorException(
        'Database connection error. Please try again later.',
      );
    }

    // Default error with custom message
    throw new InternalServerErrorException(
      customMessage ||
        'Operation failed. Please try again.',
    );
  }

  /**
   * Convert error object to searchable string
   */
  private static getErrorString(
    error: any,
  ): string {
    const parts = [
      error.name || '',
      error.message || '',
      error.original?.message || '',
      error.parent?.message || '',
      error.sql || '',
      JSON.stringify(error.fields || {}),
    ];
    return parts.join(' ').toLowerCase();
  }

  /**
   * Extract field name from any database error
   */
  private static extractFieldFromError(
    error: any,
  ): string | null {
    try {
      // Try to get from error.fields
      if (error.fields) {
        return Object.keys(error.fields)[0];
      }

      // Extract from error message
      if (error.message) {
        const patterns = [
          /Key \(([^)]+)\)=/,
          /column "([^"]+)"/,
          /constraint "([^"]+)"/,
          /"([^"]+)" cannot be null/,
          /null value in column "([^"]+)"/,
        ];

        for (const pattern of patterns) {
          const match =
            error.message.match(pattern);
          if (match) {
            return match[1];
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Handle async operation with error handling
   * Usage: await ErrorHandlerHelper.handleAsync(() => operation(), 'Failed to create user')
   */
  static async handleAsync<T>(
    operation: () => Promise<T>,
    customMessage?: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      this.handleError(error, customMessage);
    }
  }

  /**
   * Validate DTO and throw error if validation fails
   * Usage: ErrorHandlerHelper.validateDto(createUserDto, ['email', 'name'])
   */
  static validateDto(
    dto: any,
    requiredFields: string[],
  ): void {
    const missingFields = requiredFields.filter(
      (field) => !dto[field],
    );

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }
  }

  /**
   * Extract DTO validation errors
   */
  static handleDtoValidation(
    errors: any[],
  ): never {
    const messages = errors.map((err) => {
      const constraints = err.constraints;
      return Object.values(
        constraints || {},
      ).join(', ');
    });

    throw new BadRequestException(
      messages.join('; '),
    );
  }
}
