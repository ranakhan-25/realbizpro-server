import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JwtAuthUser } from '../../../../common/types/jwt-user.type';
import { SysUser } from '../../../../database/models/system/sys_user.model';
import { RedisService } from '../../../../database/redis.service';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    private readonly redisService: RedisService,
    private sequelize: Sequelize,
  ) {}

  async findOne(
    id: number,
  ): Promise<JwtAuthUser> {
    const cacheKey = `user:v2:${id}`;

    const cached =
      await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as JwtAuthUser;
    }

    const user = await this.userModel.findByPk(
      id,
      {
        attributes: [
          'id',
          'uuid',
          'isSuperUser',
          'distributionId',
          'warehouseId',
          'receivingPointId',
          'factoryId',
          'unitId',
          'userType',
          'firstName',
          'lastName',
          'username',
          'email',
          'phone',
          'isActive',
          'refreshToken',
          'lastLoginAt',
          'lastLogoutAt',
          'isSuperUser',
        ],
        include: [
          {
            association: 'roles',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
          {
            association: 'modules',
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
          {
            association: 'permissions',
            attributes: ['id', 'key', 'name'],
            through: { attributes: [] },
          },
          {
            association: 'userPermissions',
            attributes: [],
            include: [
              {
                association: 'permission',
                attributes: ['id', 'key', 'name'],
              },
            ],
          },
          {
            association: 'designation',
            attributes: ['id', 'name'],
          },
          {
            association: 'receivingPoint',
            attributes: ['id', 'name'],
          },
          {
            association: 'employee',
            attributes: [
              'id',
              'employeeCode',
              'employeeName',
              'employeeNameBn',
              'officialEmail',
              'officeId',
              'floorId',
              'sectionId',
            ],
          },
        ],
      },
    );

    if (!user) {
      throw new NotFoundException(
        `User with ID ${id} not found`,
      );
    }

    const plainUser = user.toJSON();

    await this.redisService.set(
      cacheKey,
      JSON.stringify(plainUser),
      300,
    );

    return plainUser;
  }
  async getUserPermissionKeys(
    userId: number,
  ): Promise<string[]> {
    try {
      const user = await this.userModel.findByPk(
        userId,
        {
          attributes: ['id'],
          include: [
            // ✅ Direct permissions
            {
              association: 'permissions',
              attributes: ['key'],
              through: { attributes: [] },
            },
          ],
        },
      );

      if (!user) {
        return [];
      }

      const permissionKeys = new Set<string>();

      // Get direct permissions
      const directPerms = (user as any)
        .permissions as Array<{
        key: string;
      }>;
      if (directPerms) {
        directPerms.forEach((p) =>
          permissionKeys.add(p.key),
        );
      }

      // Get permissions from roles
      const roles = (user as any).roles as Array<{
        permissions?: Array<{ key: string }>;
      }>;
      if (roles) {
        roles.forEach((r) => {
          r.permissions?.forEach((p) =>
            permissionKeys.add(p.key),
          );
        });
      }

      return Array.from(permissionKeys);
    } catch (error) {
      console.error(
        `[UsersService] Critical error fetching permissions for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async findBasicUser(id: number): Promise<any> {
    const cacheKey = `user:basic:v5:${id}`;

    const cached =
      await this.redisService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const user = await this.userModel.findByPk(
      id,
      {
        attributes: [
          'id',
          'uuid',
          'name',
          'isSuperUser',
          'isOrgAdmin',
          'orgId',
          'orgUuid',
          'employeeId',
          'distributionId',
          'warehouseId',
          'receivingPointId',
          'factoryId',
          'unitId',
          'userType',
          'firstName',
          'lastName',
          'username',
          'email',
          'phone',
          'isActive',
          'refreshToken',
          'lastLoginAt',
          'lastLogoutAt',
        ],
        include: [
          {
            association: 'roles',
            attributes: ['id', 'name', 'slug', 'isSystemRole'],
            through: { attributes: [] },
            required: false,
          },
          {
            association: 'organization',
            attributes: ['id', 'uuid', 'name', 'code', 'subscriptionStatus'],
            required: false,
          },
        ],
      },
    );

    if (user) {
      const plainUser = {
        ...user.toJSON(),
        distribution: null,
        warehouse: null,
        receivingPoint: null,
        factory: null,
        unit: null,
        sections: [],
        designation: null,
        employee: null,
      };
      await this.redisService.set(
        cacheKey,
        JSON.stringify(plainUser),
        300,
      );
      return plainUser;
    }

    return user;
  }

  /**
   *
   * @param userId - User ID to check
   * @param requiredPermissionKeys - Array of permission keys that are required
   * @returns true if user has all required permissions, false otherwise
   */
  async checkUserHasPermissions(
    userId: number,
    requiredPermissionKeys: string[],
  ): Promise<boolean> {
    try {
      if (
        !requiredPermissionKeys ||
        requiredPermissionKeys.length === 0
      ) {
        return true;
      }

      // Single query to check if user has all required permissions
      const query = `
        SELECT COUNT(DISTINCT p.key) as matched_count
        FROM sys_permissions p
        INNER JOIN sys_user_permissions up 
          ON p.id = up.permission_id
        WHERE up.user_id = :userId
          AND p.key IN (:permissionKeys)
          AND up.deleted_at IS NULL
          AND p.deleted_at IS NULL
      `;
      const results = await this.sequelize.query<{
        matched_count: string;
      }>(query, {
        replacements: {
          userId,
          permissionKeys: requiredPermissionKeys,
        },
        type: QueryTypes.SELECT,
      });

      const matchedCount = parseInt(
        results[0]?.matched_count || '0',
        10,
      );
      const hasAllPermissions =
        matchedCount ===
        requiredPermissionKeys.length;

      if (!hasAllPermissions) {
        console.log(
          `[UsersService] User ${userId} missing permissions. Required: ${requiredPermissionKeys.length}, Has: ${matchedCount}`,
        );
      }

      return hasAllPermissions;
    } catch (error) {
      console.error(
        `[UsersService] Error checking permissions for user ${userId}:`,
        error,
      );
      return false;
    }
  }

  /**
   *
   * @param userId - User ID to check
   * @param targetPermissionKeys - Array of permission keys, user must have at least one
   * @returns true if user has at least one of the permissions, false otherwise
   */
  async checkUserHasAnyPermission(
    userId: number,
    targetPermissionKeys: string[],
  ): Promise<boolean> {
    try {
      if (
        !targetPermissionKeys ||
        targetPermissionKeys.length === 0
      ) {
        return true;
      }

      // Single query to check if user has ANY of the target permissions
      const query = `
        SELECT COUNT(DISTINCT p.key) as matched_count
        FROM sys_permissions p
        INNER JOIN sys_user_permissions up 
          ON p.id = up.permission_id
        WHERE up.user_id = :userId
          AND p.key IN (:permissionKeys)
          AND up.deleted_at IS NULL
          AND p.deleted_at IS NULL
      `;
      const results = await this.sequelize.query<{
        matched_count: string;
      }>(query, {
        replacements: {
          userId,
          permissionKeys: targetPermissionKeys,
        },
        type: QueryTypes.SELECT,
      });

      const matchedCount = parseInt(
        results[0]?.matched_count || '0',
        10,
      );
      const hasAnyPermission = matchedCount > 0;

      if (!hasAnyPermission) {
        console.log(
          `[UsersService] User ${userId} missing any of required permissions. Target: ${targetPermissionKeys.join(', ')}`,
        );
      }

      return hasAnyPermission;
    } catch (error) {
      console.error(
        `[UsersService] Error checking any permission for user ${userId}:`,
        error,
      );
      return false;
    }
  }

  async isSuperUser(
    userId: number,
  ): Promise<boolean> {
    const user = await this.userModel.findByPk(
      userId,
      {
        attributes: ['isSuperUser'],
      },
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }
    return user.isSuperUser;
  }
}
