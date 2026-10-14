import {
  Transform,
  TransformFnParams,
} from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  Matches,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { PasswordStrengthPipe } from '../pipes/password-strength.pipe';
import { SanitizeHtmlPipe } from '../pipes/sanitize-html.pipe';
import { ToLowerCasePipe } from '../pipes/tolowercase.pipe';
import { TrimPipe } from '../pipes/trim.pipe';

export function IsPassword(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ) {
          if (!value) return true;
          try {
            const pipe =
              new PasswordStrengthPipe();
            pipe.transform(value);
            return true;
          } catch (error) {
            return false;
          }
        },
        defaultMessage(
          args: ValidationArguments,
        ) {
          return 'Password too weak. Must contain uppercase, lowercase, number, special char, min 8 chars';
        },
      },
    });
  };
}

// Phone Number Validation
export function IsBangladeshPhone(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'isBangladeshPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ) {
          if (!value) return true;
          const phoneRegex =
            /^(\+8801|8801|01)[3-9]\d{8}$/;
          return (
            typeof value === 'string' &&
            phoneRegex.test(value)
          );
        },
        defaultMessage(
          args: ValidationArguments,
        ) {
          return `${args.property} must be a valid Bangladesh phone number`;
        },
      },
    });
  };
}

// Positive Integer Decorator
export function IsPositiveInt(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    IsInt({
      message: 'Must be an integer',
      ...validationOptions,
    })(object, propertyName);
    Min(1, {
      message: 'Must be a positive number',
      ...validationOptions,
    })(object, propertyName);
  };
}

export function SanitizeHtml(options?: {
  allowedTags?: string[];
  allowedAttr?: string[];
}) {
  return Transform(
    ({ value }: TransformFnParams) => {
      if (typeof value === 'string') {
        const pipe = new SanitizeHtmlPipe(
          options,
        );
        return pipe.transform(value);
      }
      return value;
    },
  );
}

// Composite decorators using pipes directly
export function IsEmailNormalized(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    // Apply transformations using pipes directly
    Transform(({ value }: TransformFnParams) => {
      if (typeof value === 'string') {
        const trimPipe = new TrimPipe();
        const lowerPipe = new ToLowerCasePipe();
        return lowerPipe.transform(
          trimPipe.transform(value),
        );
      }
      return value;
    })(object, propertyName);

    // Apply validation
    IsEmail(
      {},
      {
        message: 'Must be a valid email address',
        ...validationOptions,
      },
    )(object, propertyName);
  };
}

export function IsNormalizedUsername(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    // Apply transformations using pipes directly
    Transform(({ value }: TransformFnParams) => {
      if (typeof value === 'string') {
        const trimPipe = new TrimPipe();
        const lowerPipe = new ToLowerCasePipe();
        return lowerPipe.transform(
          trimPipe.transform(value),
        );
      }
      return value;
    })(object, propertyName);

    // Apply validation
    Matches(/^[a-zA-Z0-9]+$/, {
      message:
        'Username must contain only letters and numbers',
      ...validationOptions,
    })(object, propertyName);
  };
}

// Array Validation Decorators
export function IsStringArray(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    IsArray({
      message: 'Must be an array',
      ...validationOptions,
    })(object, propertyName);
    IsString({
      each: true,
      message: 'Each item must be a string',
      ...validationOptions,
    })(object, propertyName);
  };
}

export function IsNumberArray(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    IsArray({
      message: 'Must be an array',
      ...validationOptions,
    })(object, propertyName);
    IsNumber(
      {},
      {
        each: true,
        message: 'Each item must be a number',
        ...validationOptions,
      },
    )(object, propertyName);
  };
}

// Date Validation Decorators
export function IsDateAfterToday(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'isDateAfterToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ) {
          if (!value) return true;
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return inputDate > today;
        },
        defaultMessage(
          args: ValidationArguments,
        ) {
          return `${args.property} must be a future date`;
        },
      },
    });
  };
}

export function IsDateBeforeToday(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: object,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'isDateBeforeToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(
          value: any,
          args: ValidationArguments,
        ) {
          if (!value) return true;
          const inputDate = new Date(value);
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return inputDate < today;
        },
        defaultMessage(
          args: ValidationArguments,
        ) {
          return `${args.property} must be a past date`;
        },
      },
    });
  };
}
