import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { AllConfigType } from '../types/config.type';

// Define proper types for the error structure
interface ValidationErrorDetail {
  field: string;
  value: unknown;
  errors: string[];
  children?: ValidationErrorDetail[];
}

interface ValidationExceptionResponse {
  message: string;
  statusCode: number;
  errors: ValidationErrorDetail[];
}

export function setupGlobalConfig(
  app: INestApplication,
) {
  const configService = app.get(
    ConfigService<AllConfigType>,
  );
  const nodeEnv = configService.get(
    'app.nodeEnv',
    { infer: true },
  );
  const apiPrefix =
    configService.getOrThrow('app.apiPrefix', {
      infer: true,
    }) || 'api';

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages:
        nodeEnv === 'production',
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (
        errors: ValidationError[],
      ) => {
        if (nodeEnv !== 'production') {
          console.warn(
            'Validation errors:',
            errors,
          );
        }

        // Extract detailed error messages with proper typing
        const formatErrors = (
          validationErrors: ValidationError[],
        ): ValidationErrorDetail[] => {
          return validationErrors.map(
            (error): ValidationErrorDetail => {
              const constraints =
                error.constraints || {};
              const children =
                error.children || [];

              const errorDetail: ValidationErrorDetail =
                {
                  field: error.property,
                  value: error.value,
                  errors:
                    Object.values(constraints),
                };

              if (children.length > 0) {
                errorDetail.children =
                  formatErrors(children);
              }

              return errorDetail;
            },
          );
        };

        // Create comprehensive, user-friendly validation error message
        const extractAllConstraintMessages = (
          validationErrors: ValidationError[],
          prefix = '',
        ): string[] => {
          const list: string[] = [];
          for (const err of validationErrors) {
            const field = prefix
              ? `${prefix}.${err.property}`
              : err.property;

            if (err.constraints) {
              const constraintValues = Object.values(err.constraints);
              for (const c of constraintValues) {
                // Ensure field name is clearly stated for end-user visibility
                if (err.property && c.toLowerCase().includes(err.property.toLowerCase())) {
                  list.push(c);
                } else if (field) {
                  list.push(`${field}: ${c}`);
                } else {
                  list.push(c);
                }
              }
            }

            if (err.children && err.children.length > 0) {
              list.push(
                ...extractAllConstraintMessages(err.children, field),
              );
            }
          }
          return list;
        };

        const createMessage = (
          validationErrors: ValidationError[],
        ): string => {
          const msgs = extractAllConstraintMessages(validationErrors);
          if (msgs.length > 0) {
            return msgs.join('; ');
          }
          return 'Validation failed: Please ensure all required fields are correctly formatted.';
        };

        const detailedErrors =
          formatErrors(errors);
        const message =
          createMessage(errors);

        return new BadRequestException({
          message,
          statusCode: 400,
          errors: detailedErrors,
        });
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix(`realbizpro/${apiPrefix}`);
}
