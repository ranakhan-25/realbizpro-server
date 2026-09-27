import {
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (
  ...permissions: string[]
) =>
  applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    ApiOperation({
      summary: `Requires permissions: ${permissions.join(', ')}`,
      description: `This endpoint requires the following permissions: ${permissions.join(', ')}`,
    }),
  );

export const ANY_PERMISSIONS_KEY =
  'any_permissions';
export const HasAnyPermissions = (
  ...permissions: string[]
) =>
  applyDecorators(
    SetMetadata(ANY_PERMISSIONS_KEY, permissions),
    ApiOperation({
      summary: `Requires ANY of these permissions: ${permissions.join(', ')}`,
      description: `This endpoint requires at least one of the following permissions: ${permissions.join(', ')}`,
    }),
  );
