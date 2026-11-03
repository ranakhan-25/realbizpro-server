import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysRolePermission } from '../../../database/models/system/sys_role_permission.model';
import { CreateRoleDto } from './dto/create.dto';
import { UpdateRoleDto } from './dto/update.dto';
import { ErrorHandlerHelper } from 'src/common/helper/errorMessage.helper';
import { SysUserPermission } from 'src/database/models/system/sys_user_permission.model';
import { SysUserRole } from 'src/database/models/system/sys_user_role.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(SysRole)
    private roleModel: typeof SysRole,
    @InjectModel(SysRolePermission)
    private rolePermissionModel: typeof SysRolePermission,
    @InjectModel(SysPermission)
    private readonly permissionModel: typeof SysPermission,
    @InjectModel(SysUserPermission)
    private readonly userPermissionModel: typeof SysUserPermission,
    @InjectModel(SysUserRole)
    private readonly userRoleModel: typeof SysUserRole,
  ) {}

  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<SysRole> {
    // Check if role name already exists
    const existingRole =
      await this.roleModel.findOne({
        where: { name: createRoleDto.name },
      });

    if (existingRole) {
      throw new ConflictException(
        'Role with this name already exists',
      );
    }

    //slug generated from name
    const nameSlug = createRoleDto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    try {
      return await this.roleModel.create({
        name: createRoleDto.name,
        slug: nameSlug,
        description: createRoleDto.description,
      });
    } catch (error) {
      throw new BadRequestException(
        'Failed to create role',
      );
    }
  }

  private generateUniqueSlug(
    baseName: string,
  ): string {
    const baseSlug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Generate a random 4-digit number (1000-9999)
    const uniqueId = Math.floor(
      1000 + Math.random() * 9000,
    );

    return `${baseSlug}-${uniqueId}`;
  }

  /**
   * Create a new role and assign permissions in a single transaction
   */
  async createRoleWithPermissions(
    createRoleDto: CreateRoleDto,
    permissionIds: number[] = [],
    moduleId?: number,
    currentUser?: any,
    roleLevel?: number,
  ): Promise<{
    role: SysRole;
    message: string;
    assignedCount: number;
  }> {
    // Validate role name uniqueness
    const existingRole =
      await this.roleModel.findOne({
        where: { name: createRoleDto.name },
      });

    if (existingRole) {
      throw new ConflictException(
        'Role with this name already exists',
      );
    }

    const nameSlug = this.generateUniqueSlug(
      createRoleDto.name,
    );

    let validatedPermissionIds: number[] = [];

    // Validate permissions if provided
    if (permissionIds.length > 0) {
      // Remove duplicates and validate
      validatedPermissionIds = [
        ...new Set(
          permissionIds.filter(
            (id) =>
              Number.isInteger(id) && id > 0,
          ),
        ),
      ];

      if (
        validatedPermissionIds.length !==
        permissionIds.length
      ) {
        throw new BadRequestException(
          'Invalid permission IDs provided. All IDs must be positive integers.',
        );
      }

      // Get permissions to verify they exist
      const existingPermissions =
        await this.permissionModel.findAll({
          where: { id: validatedPermissionIds },
          attributes: ['id'],
        });

      // Verify all permissions exist
      if (
        existingPermissions.length !==
        validatedPermissionIds.length
      ) {
        const foundIds = existingPermissions.map(
          (p) => p.id,
        );
        const missingIds =
          validatedPermissionIds.filter(
            (id) => !foundIds.includes(id),
          );
        throw new BadRequestException(
          `Permission IDs not found: ${missingIds.join(', ')}`,
        );
      }
    }

    // Determine tenant tenancy and role level
    const targetOrgId = currentUser && !currentUser.isSuperUser ? currentUser.orgId : undefined;
    const targetOrgUuid = currentUser && !currentUser.isSuperUser ? currentUser.orgUuid : undefined;
    const targetIsSystemRole = currentUser && currentUser.isSuperUser ? true : false;
    const targetRoleLevel = roleLevel || (currentUser && !currentUser.isSuperUser ? 4 : 4);

    // Use transaction for data consistency
    const sequelize = this.roleModel.sequelize;
    if (!sequelize) {
      throw new Error(
        'Database connection not available',
      );
    }

    try {
      const result = await sequelize.transaction(
        async (transaction) => {
          // Step 1: Create the role
          console.log(
            `Creating role: ${createRoleDto.name} with slug: ${nameSlug}`,
          );

          const newRole =
            await this.roleModel.create(
              {
                name: createRoleDto.name,
                slug: nameSlug,
                description:
                  createRoleDto.description,
                orgId: targetOrgId,
                orgUuid: targetOrgUuid,
                isSystemRole: targetIsSystemRole,
                roleLevel: targetRoleLevel,
              },
              { transaction },
            );

          let assignedCount = 0;

          // Step 2: Assign permissions if provided
          if (validatedPermissionIds.length > 0) {
            const newAssignments =
              validatedPermissionIds.map(
                (permissionId) => ({
                  roleId: Number(newRole.id),
                  permissionId:
                    Number(permissionId),
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }),
              );

            console.log(
              `Assigning ${newAssignments.length} permissions to newly created role ${newRole.id}`,
            );

            const createdAssignments =
              await this.rolePermissionModel.bulkCreate(
                newAssignments,
                {
                  transaction,
                  fields: [
                    'roleId',
                    'permissionId',
                    'uuid',
                    'createdAt',
                    'updatedAt',
                  ],
                  validate: true,
                  ignoreDuplicates: true,
                },
              );

            assignedCount =
              createdAssignments.length;
            console.log(
              `Successfully assigned ${assignedCount} permissions to role ${newRole.id}`,
            );
          }

          // Step 3: Reload role with permissions for return
          const roleWithPermissions =
            await this.roleModel.findByPk(
              newRole.id,
              {
                include: [
                  {
                    association: 'permissions',
                    attributes: [
                      'id',
                      'key',
                      'name',
                    ],
                    through: { attributes: [] },
                  },
                ],
                transaction,
              },
            );

          return {
            role: roleWithPermissions,
            assignedCount,
          };
        },
      );

      // Generate success message
      const permissionMessage =
        result.assignedCount > 0
          ? ` with ${result.assignedCount} permissions`
          : '';

      return {
        role: result.role,
        message: `Role '${createRoleDto.name}' created successfully${permissionMessage}`,
        assignedCount: result.assignedCount,
      };
    } catch (error) {
      console.error(
        'Error in createRoleWithPermissions:',
        error,
      );

      // Handle specific Sequelize errors
      if (
        error.name === 'SequelizeValidationError'
      ) {
        throw new BadRequestException(
          `Validation failed: ${error.message}`,
        );
      }

      if (
        error.name ===
        'SequelizeForeignKeyConstraintError'
      ) {
        throw new BadRequestException(
          'Invalid permission ID provided',
        );
      }

      if (
        error.name ===
        'SequelizeUniqueConstraintError'
      ) {
        if (error.message.includes('name')) {
          throw new ConflictException(
            'Role with this name already exists',
          );
        }
        throw new ConflictException(
          'Duplicate constraint violation',
        );
      }

      // Re-throw known NestJS exceptions
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Generic error fallback
      throw new BadRequestException(
        `Failed to create role: ${error.message}`,
      );
    }
  }

  async findAll(currentUser?: any): Promise<SysRole[]> {
    const whereConditions: any[] = [];

    if (currentUser && !currentUser.isSuperUser) {
      whereConditions.push({ slug: { [Op.ne]: 'super-admin' } });
      if (currentUser.orgId) {
        whereConditions.push({
          [Op.or]: [
            { orgId: currentUser.orgId },
            { isSystemRole: true },
            { orgId: null },
          ],
        });
      }
    }

    return this.roleModel.findAll({
      where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : undefined,
      include: [
        {
          association: 'permissions',
          attributes: ['id', 'key', 'name', 'action'],
          through: { attributes: [] },
        },
      ],
      order: [
        ['roleLevel', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  async getDropdown(currentUser?: any): Promise<
    Array<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      roleLevel: number;
      orgId?: number;
    }>
  > {
    const whereConditions: any[] = [];

    if (currentUser && !currentUser.isSuperUser) {
      whereConditions.push({ roleLevel: { [Op.gte]: 2 } });
      whereConditions.push({ slug: { [Op.ne]: 'super-admin' } });
      if (currentUser.orgId) {
        whereConditions.push({
          [Op.or]: [
            { orgId: currentUser.orgId },
            { isSystemRole: true },
            { orgId: null },
          ],
        });
      }
    }

    const roles = await this.roleModel.findAll({
      where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : undefined,
      attributes: ['id', 'name', 'slug', 'description', 'roleLevel', 'orgId'],
      order: [
        ['roleLevel', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      roleLevel: role.roleLevel || 4,
      orgId: role.orgId,
    }));
  }

  async findOne(id: string): Promise<SysRole> {
    const role = await this.roleModel.findByPk(
      id,
      {
        include: [
          {
            association: 'permissions',
            // include: [Permission],
          },
        ],
      },
    );

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${id} not found`,
      );
    }

    return role;
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<SysRole> {
    const role =
      await this.roleModel.findByPk(id);

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${id} not found`,
      );
    }

    // Check name uniqueness if name is being updated
    if (
      updateRoleDto.name &&
      updateRoleDto.name !== role.name
    ) {
      const existingRole =
        await this.roleModel.findOne({
          where: { name: updateRoleDto.name },
        });

      if (existingRole) {
        throw new ConflictException(
          'Role with this name already exists',
        );
      }
    }

    await role.update({
      name: updateRoleDto.name ?? role.name,
      description:
        updateRoleDto.description ??
        role.description,
    });

    return role.reload({
      include: [
        {
          association: 'permissions',
        },
      ],
    });
  }

  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const role =
      await this.roleModel.findByPk(id);

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${id} not found`,
      );
    }

    // Remove all associated permissions from pivot table
    await this.rolePermissionModel.destroy({
      where: { roleId: id },
    });

    // Now delete the role
    await role.destroy();

    return {
      message:
        'Role and associated permissions deleted successfully',
    };
  }

  async assignPermission(
    roleId: number,
    permissionId: number,
  ): Promise<SysRolePermission> {
    // Check if role exists
    const role =
      await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${roleId} not found`,
      );
    }

    // Check if permission is already assigned
    const existingRolePermission =
      await this.rolePermissionModel.findOne({
        where: { roleId, permissionId },
      });

    if (existingRolePermission) {
      throw new ConflictException(
        'Permission already assigned to role',
      );
    }

    return this.rolePermissionModel.create({
      roleId,
      permissionId,
    });
  }

  async removePermission(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    const rolePermission =
      await this.rolePermissionModel.findOne({
        where: { roleId, permissionId },
      });

    if (!rolePermission) {
      throw new NotFoundException(
        'Permission assignment not found',
      );
    }

    await rolePermission.destroy();
  }
  async getRolePermissions(
    roleId: string,
    moduleId?: number,
  ): Promise<any> {
    console.log({
      roleId,
      moduleId,
    });

    const role = await this.roleModel.findByPk(
      roleId,
      {
        attributes: [
          'id',
          'name',
          'slug',
          'description',
        ],
        include: [
          {
            association: 'permissions',
            attributes: [
              'id',
              'key',
              'name',
              'description',
              'resource',
              'action',
              'context',
            ],
            through: { attributes: [] },
            include: [
              {
                association: 'feature',
                attributes: [
                  'id',
                  'name',
                  'description',
                  'moduleId',
                ],
                include: [
                  {
                    association: 'module',
                    attributes: [
                      'id',
                      'name',
                      'description',
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    );

    if (!role) {
      throw new NotFoundException(
        `Role with ID ${roleId} not found`,
      );
    }

    // Group permissions by feature, with optional moduleId filter
    const featuresMap = new Map<string, any>();

    for (const p of role.permissions ?? []) {
      const feature = p.feature;
      if (!feature) continue;

      // Filter by moduleId if provided
      if (
        moduleId !== undefined &&
        feature.moduleId !== moduleId
      )
        continue;

      const featureId = feature.id.toString();

      if (!featuresMap.has(featureId)) {
        featuresMap.set(featureId, {
          id: feature.id,
          name: feature.name,
          description: feature.description,
          module: feature.module
            ? {
                id: feature.module.id,
                name: feature.module.name,
                description:
                  feature.module.description,
              }
            : null,
          permissions: [],
        });
      }

      featuresMap
        .get(featureId)
        .permissions.push({
          id: p.id.toString(),
          key: p.key,
          name: p.name,
          description: p.description,
          resource: p.resource,
          action: p.action,
          context: p.context,
        });
    }

    const features = Array.from(
      featuresMap.values(),
    );

    return {
      id: role.id,
      name: role.name,
      slug: role.slug,
      description: role.description,
      features,
    };
  }

  /**
   * Background task to renew all user permissions for a specific role
   * This runs asynchronously to avoid blocking the API response
   */
  private async renewAllUserPermissionsForRole(
    roleId: number,
  ): Promise<void> {
    console.log(
      `[Background] Starting permission renewal for role ${roleId}`,
    );

    try {
      // Get all users who have this role
      const userRoles =
        await this.userRoleModel.findAll({
          where: { roleId },
          attributes: ['userId'],
        });

      const userIds = userRoles.map(
        (ur) => ur.userId,
      );

      if (userIds.length === 0) {
        console.log(
          `[Background] No users found with role ${roleId}`,
        );
        return;
      }

      console.log(
        `[Background] Found ${userIds.length} users with role ${roleId}`,
      );

      // Get all current permissions for this role
      const rolePermissions =
        await this.rolePermissionModel.findAll({
          where: { roleId },
          attributes: ['permissionId'],
        });

      console.log({
        length: rolePermissions.length,
      });

      const permissionIds = rolePermissions.map(
        (rp) => rp.permissionId,
      );

      console.log(
        `[Background] Role ${roleId} has ${permissionIds.length} permissions`,
      );

      // Process each user
      for (const userId of userIds) {
        try {
          // Delete all permissions for this user that are related to this role
          const deletedCount =
            await this.userPermissionModel.destroy(
              {
                where: {
                  userId,
                  roleId,
                },
                force: true,
              },
            );

          console.log(
            `[Background] Deleted ${deletedCount} permissions for user ${userId} from role ${roleId}`,
          );

          // Re-assign permissions from this role
          if (permissionIds.length > 0) {
            const userPermissions =
              permissionIds.map(
                (permissionId) => ({
                  userId: userId,
                  permissionId: permissionId,
                  roleId: roleId,
                }),
              );

            await this.userPermissionModel.bulkCreate(
              userPermissions,
              {
                fields: [
                  'userId',
                  'permissionId',
                  'roleId',
                ],
                ignoreDuplicates: true,
              },
            );

            console.log(
              `[Background] Re-assigned ${permissionIds.length} permissions to user ${userId} from role ${roleId}`,
            );
          }
        } catch (userError) {
          console.error(
            `[Background] Failed to renew permissions for user ${userId}:`,
            userError,
          );
          // Continue with next user even if one fails
        }
      }

      console.log(
        `[Background] Completed permission renewal for role ${roleId}`,
      );
    } catch (error) {
      console.error(
        `[Background] Failed to renew permissions for role ${roleId}:`,
        error,
      );
    }
  }

  async assignMultiplePermissions(
    roleId: number,
    permissionIds: number[],
    moduleId?: number,
    name?: string,
    description?: string,
    renewAllUserPermissions = false,
  ): Promise<{
    message: string;
    assignedCount: number;
    removedCount: number;
    unchangedCount: number;
  }> {
    // Check if role exists
    const role =
      await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${roleId} not found`,
      );
    }

    if (name || description) {
      // Check name uniqueness if name is being updated
      if (name && name !== role.name) {
        const existingRole =
          await this.roleModel.findOne({
            where: { name },
          });

        if (existingRole) {
          throw new ConflictException(
            'Role with this name already exists',
          );
        }
      }

      await role.update({
        name: name ?? role.name,
        description:
          description ?? role.description,
      });
      console.log(
        `Updated role ${roleId} details`,
      );
    }

    // Validate permissions
    if (permissionIds.length > 0) {
      // Get all permissions with their feature/module information
      const existingPermissions =
        await this.permissionModel.findAll({
          where: { id: permissionIds },
          include: [
            {
              association: 'feature',
              attributes: ['id', 'moduleId'],
              include: [
                {
                  association: 'module',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
          attributes: ['id'],
        });

      // Check if all permission IDs exist
      if (
        existingPermissions.length !==
        permissionIds.length
      ) {
        const foundIds = existingPermissions.map(
          (p) => p.id,
        );
        const missingIds = permissionIds.filter(
          (id) => !foundIds.includes(id),
        );
        throw new BadRequestException(
          `One or more permission IDs are invalid: ${missingIds.join(', ')}`,
        );
      }

      // Get unique module IDs from the permissions
      const moduleIds = new Set(
        existingPermissions
          .map((p) => p.feature?.moduleId)
          .filter(Boolean),
      );

      // If moduleId is provided, validate that ALL permissions belong to that module
      if (moduleId) {
        const invalidPermissions =
          existingPermissions.filter(
            (p) =>
              p.feature?.moduleId !== moduleId,
          );

        if (invalidPermissions.length > 0) {
          throw new BadRequestException(
            `Some permissions do not belong to module ${moduleId}. Invalid permission IDs: ${invalidPermissions.map((p) => p.id).join(', ')}`,
          );
        }
      } else {
        // When moduleId is not specified, permissions can span multiple modules
        // The assignment will operate globally across all modules
      }
    } else if (moduleId) {
      // Delete only permissions for this specific module
      const modulePermissions =
        await this.permissionModel.findAll({
          include: [
            {
              association: 'feature',
              where: { moduleId },
              required: true,
            },
          ],
          attributes: ['id'],
        });

      const modulePermissionIds =
        modulePermissions.map((p) => p.id);

      if (modulePermissionIds.length > 0) {
        await this.rolePermissionModel.destroy({
          where: {
            roleId,
            permissionId: modulePermissionIds,
          },
          force: true,
        });
        console.log(
          `Deleted permissions for module ${moduleId} from role ${roleId}`,
        );
      }
    }

    // Use transaction for data consistency
    const sequelize = this.roleModel.sequelize;
    if (!sequelize) {
      throw new Error(
        'Database connection not available',
      );
    }

    try {
      const result = await sequelize.transaction(
        async (transaction) => {
          let currentPermissionIds: number[] = [];

          if (moduleId) {
            // MODULE-SCOPED: Get current permissions for this specific module
            const modulePermissions =
              await this.permissionModel.findAll({
                include: [
                  {
                    association: 'feature',
                    where: { moduleId },
                    required: true,
                  },
                ],
                attributes: ['id'],
                transaction,
              });

            const allModulePermissionIds =
              modulePermissions.map((p) => p.id);

            // Get existing role-permissions for this module
            const existingRolePermissions =
              await this.rolePermissionModel.findAll(
                {
                  where: {
                    roleId,
                    permissionId:
                      allModulePermissionIds,
                  },
                  attributes: ['permissionId'],
                  transaction,
                },
              );

            currentPermissionIds =
              existingRolePermissions.map((rp) =>
                Number(rp.permissionId),
              );
            console.log(
              `Current permissions for role ${roleId} in module ${moduleId}:`,
              currentPermissionIds,
            );
          } else {
            // GLOBAL: Get all current permissions for this role
            const existingRolePermissions =
              await this.rolePermissionModel.findAll(
                {
                  where: { roleId },
                  attributes: ['permissionId'],
                  transaction,
                },
              );

            currentPermissionIds =
              existingRolePermissions.map((rp) =>
                Number(rp.permissionId),
              );
            console.log(
              `Current permissions for role ${roleId} globally:`,
              currentPermissionIds,
            );
          }

          // Convert incoming permission IDs to numbers and remove duplicates
          const newPermissionIds = [
            ...new Set(
              permissionIds.map((id) =>
                Number(id),
              ),
            ),
          ];

          // Calculate differences
          const permissionsToAdd =
            newPermissionIds.filter(
              (id) =>
                !currentPermissionIds.includes(
                  id,
                ),
            );

          const permissionsToRemove =
            currentPermissionIds.filter(
              (id) =>
                !newPermissionIds.includes(id),
            );

          const unchangedPermissions =
            newPermissionIds.filter((id) =>
              currentPermissionIds.includes(id),
            );

          console.log(
            'Permissions to add:',
            permissionsToAdd,
          );
          console.log(
            'Permissions to remove:',
            permissionsToRemove,
          );
          console.log(
            'Unchanged permissions:',
            unchangedPermissions,
          );

          // Remove permissions that are no longer needed
          if (permissionsToRemove.length > 0) {
            const deleteResult =
              await this.rolePermissionModel.destroy(
                {
                  where: {
                    roleId,
                    permissionId:
                      permissionsToRemove,
                  },
                  transaction,
                },
              );

            console.log(
              `Removed ${deleteResult} permissions from role ${roleId}`,
            );
          }

          // Add new permissions only
          if (permissionsToAdd.length > 0) {
            const newAssignments =
              permissionsToAdd.map(
                (permissionId) => ({
                  roleId: Number(roleId),
                  permissionId:
                    Number(permissionId),
                  created_at: new Date(),
                  updated_at: new Date(),
                }),
              );

            console.log(
              'Creating new role-permission assignments:',
              newAssignments,
            );

            await this.rolePermissionModel.bulkCreate(
              newAssignments,
              {
                transaction,
                fields: [
                  'roleId',
                  'permissionId',
                  'createdAt',
                  'updatedAt',
                  'uuid',
                ],
                ignoreDuplicates: true,
                validate: true,
              },
            );

            console.log(
              `Added ${permissionsToAdd.length} new permissions to role ${roleId}`,
            );
          }

          return {
            assignedCount:
              permissionsToAdd.length,
            removedCount:
              permissionsToRemove.length,
            unchangedCount:
              unchangedPermissions.length,
          };
        },
      );

      if (renewAllUserPermissions) {
        console.log(
          `[API] Triggering background permission renewal for role ${roleId}`,
        );

        // Run asynchronously without awaiting
        this.renewAllUserPermissionsForRole(
          roleId,
        ).catch((error) => {
          console.error(
            `[API] Background permission renewal failed for role ${roleId}:`,
            error,
          );
        });
      }
      const scope = moduleId
        ? `for module ${moduleId}`
        : 'globally';
      const parts: string[] = [];

      if (result.assignedCount > 0) {
        parts.push(
          `added ${result.assignedCount} new permissions`,
        );
      }

      if (result.removedCount > 0) {
        parts.push(
          `removed ${result.removedCount} permissions`,
        );
      }

      if (result.unchangedCount > 0) {
        parts.push(
          `kept ${result.unchangedCount} existing permissions`,
        );
      }

      const message =
        parts.length > 0
          ? `Successfully ${parts.join(', ')} ${scope}`
          : `Success`;

      return {
        message,
        assignedCount: result.assignedCount,
        removedCount: result.removedCount,
        unchangedCount: result.unchangedCount,
      };
    } catch (error) {
      ErrorHandlerHelper.handleError(error);
    }
  }
}
