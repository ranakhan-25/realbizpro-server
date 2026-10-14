import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

const getNestedValue = (
  obj: unknown,
  path: string,
): unknown => {
  return path
    .split('.')
    .reduce<unknown>((acc, key) => {
      if (
        acc == null ||
        typeof acc !== 'object'
      ) {
        return undefined;
      }
      return (acc as Record<string, unknown>)[
        key
      ];
    }, obj);
};

// Current User
export const CurrentUser = createParamDecorator(
  (
    field: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest();
    if (!field) {
      return request.user;
    }

    return getNestedValue(request.user, field);
  },
);

// Current User ID
export const CurrentUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest();
    return request.user?.id || request.user?._id;
  },
);

// Get User Roles
export const CurrentUserRoles =
  createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
      const request = ctx
        .switchToHttp()
        .getRequest();
      return request.user?.roles || [];
    },
  );

//get header authorization
export const AuthHeader = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest();
    return request.headers['authorization'];
  },
);
