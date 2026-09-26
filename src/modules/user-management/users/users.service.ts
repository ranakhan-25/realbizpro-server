import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import {
  Op,
  QueryTypes,
  literal,
  where as sequelizeWhere,
  Transaction,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ErrorHandlerHelper } from '../../../common/helper/errorMessage.helper';
import { SysModuleToUser } from '../../../database/models/system/sys_module_to_user.model';
import { SysPermission } from '../../../database/models/system/sys_permission.model';
import { SysRole } from '../../../database/models/system/sys_role.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysUserPermission } from '../../../database/models/system/sys_user_permission.model';
import { SysUserRole } from '../../../database/models/system/sys_user_role.model';
import { SysUserSection } from '../../../database/models/system/sys_user_section.model';
import { RedisService } from '../../../database/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserFilterDropdownDto } from './dto/filter-dropdown.dto';
import { QueryUserDto } from './dto/filterList.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SysUserCompany } from '../../../database/models/system/sys_user_company.model';
import { UserTypeEnum } from '../../../database/models/system/sys_user.model';

const DEFAULT_EMPLOYEE_USER_PASSWORD = '123456';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
    @InjectModel(SysUserRole)
    private userRoleModel: typeof SysUserRole,
    @InjectModel(SysUserPermission)
    private userPermissionModel: typeof SysUserPermission,
    @InjectModel(SysUserSection)
    private userSectionModel: typeof SysUserSection,
    @InjectModel(SysUserCompany)
    private userCompanyModel: typeof SysUserCompany,
    @InjectModel(SysModuleToUser)
    private moduleToUser: typeof SysModuleToUser,
    @InjectModel(SysPermission)
    private permissionModel: typeof SysPermission,
    @InjectModel(SysRole)
    private roleModel: typeof SysRole,
    private sequelize: Sequelize,
    private readonly redisService: RedisService,
  ) {}

  private async generateUniqueUsername(
    baseUsername: string,
  ): Promise<string | undefined> {
    const sanitizedBase = baseUsername
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '');

    if (!sanitizedBase) {
      return undefined;
    }

    let usernameCandidate = sanitizedBase;
    let suffix = 1;

    while (true) {
      const existing =
        await this.userModel.findOne({
          where: { username: usernameCandidate },
          attributes: ['id'],
          raw: true,
        });

      if (!existing) {
        return usernameCandidate;
      }

      usernameCandidate = `${sanitizedBase}${suffix}`;
      suffix += 1;
    }
  }

  private async generateUniqueEmail(
    preferredEmail: string,
    fallbackPrefix: string,
  ): Promise<string> {
    const normalizedPreferredEmail =
      preferredEmail.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      emailRegex.test(normalizedPreferredEmail)
    ) {
      const existingPreferred =
        await this.userModel.findOne({
          where: {
            email: normalizedPreferredEmail,
          },
          attributes: ['id'],
          raw: true,
        });

      if (!existingPreferred) {
        return normalizedPreferredEmail;
      }
    }

    const sanitizedPrefix = fallbackPrefix
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '');

    const safePrefix =
      sanitizedPrefix || `emp${Date.now()}`;
    let suffix = 0;

    while (true) {
      const emailCandidate =
        suffix === 0
          ? `${safePrefix}@employee.local`
          : `${safePrefix}${suffix}@employee.local`;

      const existing =
        await this.userModel.findOne({
          where: { email: emailCandidate },
          attributes: ['id'],
          raw: true,
        });

      if (!existing) {
        return emailCandidate;
      }

      suffix += 1;
    }
  }

  async convertEmployeeToUser(
    employeeId: number,
    createdById?: number,
  ): Promise<any> {
    const employee = (this as any).employeeModel
      ? await (
          this as any
        ).employeeModel.findByPk(employeeId, {
          attributes: [
            'id',
            'employeeCode',
            'firstName',
            'lastName',
            'employeeName',
            'officialEmail',
            'designationId',
            'distributionId',
            'showroomId',
          ],
        })
      : null;

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${employeeId} not found`,
      );
    }

    const existingByEmployee =
      await this.userModel.findOne({
        where: { employeeId },
        attributes: ['id', 'uuid', 'email'],
        raw: true,
      });

    if (existingByEmployee) {
      throw new ConflictException(
        'This employee is already linked to an existing user',
      );
    }

    const firstName =
      employee.firstName?.trim() ||
      employee.employeeName?.trim() ||
      `EMP${employee.id}`;
    const lastName =
      employee.lastName?.trim() || firstName;

    const usernameBase =
      employee.employeeCode?.trim() ||
      `${firstName}.${employee.id}`;

    const username =
      await this.generateUniqueUsername(
        usernameBase,
      );

    const email = await this.generateUniqueEmail(
      employee.officialEmail || '',
      employee.employeeCode ||
        `${firstName}${employee.id}`,
    );

    const passwordHash = await argon2.hash(
      DEFAULT_EMPLOYEE_USER_PASSWORD,
    );

    const newUser = await this.userModel.create({
      name:
        `${firstName} ${lastName}`.trim() ||
        username ||
        email,
      email,
      firstName,
      lastName,
      username,
      password: passwordHash,
      passwordHash,
      isActive: true,
      isSuperUser: false,
      createdById,
      employeeId: employee.id,
      designationId: employee.designationId,
      distributionId: employee.distributionId,
      warehouseId: employee.showroomId,
    } as any);

    return {
      id: newUser.id,
      uuid: newUser.uuid,
      employeeId: employee.id,
      username: newUser.username,
      email: newUser.email,
      defaultPassword:
        DEFAULT_EMPLOYEE_USER_PASSWORD,
      message:
        'Employee converted to user successfully',
    };
  }

  // ✅ Helper: Get role permissions (single optimized query)
  private async getRolePermissions(
    roleIds: number[],
    transaction?: any,
  ): Promise<number[]> {
    if (roleIds.length === 0) {
      return [];
    }

    const permissions =
      await this.permissionModel.findAll({
        attributes: ['id'],
        include: [
          {
            association: 'roles',
            attributes: [],
            where: { id: roleIds },
            through: { attributes: [] },
            required: true,
          },
        ],
        transaction,
        raw: true,
      });

    return [
      ...new Set(permissions.map((p) => p.id)),
    ];
  }

  private normalizeOfficeAccessPayload(
    dto: CreateUserDto | UpdateUserDto,
  ): {
    officeId: number;
    officeTypeId: number;
  }[] {
    const userType = dto.userType;

    if (userType !== UserTypeEnum.OFFICE) {
      return [];
    }

    const toUniqueNumberArray = (
      value: unknown,
    ): number[] => {
      const values = Array.isArray(value)
        ? value
        : [];

      const numbers = values
        .map((id): number => Number(id))
        .filter(
          (id): id is number =>
            Number.isFinite(id) && id > 0,
        );

      return Array.from(new Set<number>(numbers));
    };

    const officeIds = toUniqueNumberArray(
      (dto as any).officeIds,
    );

    const officeTypeIds = toUniqueNumberArray(
      (dto as any).officeTypeIds,
    );

    if (
      !officeIds.length ||
      !officeTypeIds.length
    ) {
      return [];
    }

    const rows: {
      officeId: number;
      officeTypeId: number;
    }[] = [];

    for (const officeId of officeIds) {
      for (const officeTypeId of officeTypeIds) {
        rows.push({
          officeId,
          officeTypeId,
        });
      }
    }

    return rows;
  }

  private async syncUserOffices(
    userId: number,
    dto: CreateUserDto | UpdateUserDto,
    transaction?: any,
  ): Promise<void> {
    const shouldSync =
      dto.userType === UserTypeEnum.OFFICE ||
      (dto as any).officeIds !== undefined ||
      (dto as any).officeTypeIds !== undefined;

    if (!shouldSync) return;

    await (this as any).userOfficeModel.destroy({
      where: { userId },
      force: true,
      transaction,
    });

    const rows =
      this.normalizeOfficeAccessPayload(dto);

    if (!rows.length) return;

    await (
      this as any
    ).userOfficeModel.bulkCreate(
      rows.map((row) => ({
        userId,
        officeId: row.officeId,
        officeTypeId: row.officeTypeId,
      })),
      {
        transaction,
        ignoreDuplicates: true,
      },
    );
  }

  private async processUserAssociations(
    userId: number,
    userUuid: string,
    createUserDto: CreateUserDto,
    transaction: Transaction,
  ): Promise<void> {
    if (createUserDto.categoryIds?.length) {
      const validCategories = await (
        this as any
      ).categoryModel.findAll({
        where: {
          id: createUserDto.categoryIds,
        },
        attributes: ['id'],
        paranoid: true,
        transaction,
      });

      const validCategoryIds =
        validCategories.map((c) => c.id);

      if (validCategoryIds.length) {
        await (
          this as any
        ).userCategoryPermissionModel.bulkCreate(
          validCategoryIds.map((categoryId) => ({
            userId,
            categoryId,
          })),
          { transaction, ignoreDuplicates: true },
        );
      }
    }

    if (createUserDto.roleIds?.length) {
      await this.userRoleModel.bulkCreate(
        createUserDto.roleIds.map((roleId) => ({
          userId,
          roleId,
        })),
        { transaction, ignoreDuplicates: true },
      );

      const allRolePerms =
        await this.getRolePermissions(
          createUserDto.roleIds,
          transaction,
        );

      const userPermissions =
        createUserDto.roleIds.flatMap((roleId) =>
          allRolePerms.map((permissionId) => ({
            userId,
            permissionId,
            roleId,
          })),
        );

      if (userPermissions.length) {
        await this.userPermissionModel.bulkCreate(
          userPermissions,
          {
            transaction,
            fields: [
              'userId',
              'permissionId',
              'roleId',
            ],
            ignoreDuplicates: true,
          },
        );
      }
    }

    if (createUserDto.permissionIds?.length) {
      await this.userPermissionModel.bulkCreate(
        createUserDto.permissionIds.map(
          (permissionId) => ({
            userId,
            permissionId,
          }),
        ),
        {
          transaction,
          fields: ['userId', 'permissionId'],
          ignoreDuplicates: true,
        },
      );
    }

    if (createUserDto.moduleIds?.length) {
      await this.moduleToUser.bulkCreate(
        createUserDto.moduleIds.map(
          (moduleId) => ({
            userId,
            moduleId,
          }),
        ),
        { transaction, ignoreDuplicates: true },
      );
    }

    if (createUserDto.sectionIds?.length) {
      await this.userSectionModel.bulkCreate(
        createUserDto.sectionIds.map(
          (sectionId) => ({
            userId,
            sectionId,
          }),
        ),
        {
          transaction,
          ignoreDuplicates: true,
          fields: [
            'userId',
            'sectionId',
            'createdAt',
            'updatedAt',
          ],
        },
      );
    }

    const officeIds = [
      ...new Set(
        (createUserDto.officeIds ?? [])
          .map(Number)
          .filter(
            (id) => Number.isFinite(id) && id > 0,
          ),
      ),
    ];

    const officeTypeIds = [
      ...new Set(
        (createUserDto.officeTypeIds ?? [])
          .map(Number)
          .filter(
            (id) => Number.isFinite(id) && id > 0,
          ),
      ),
    ];

    if (
      officeIds.length &&
      officeTypeIds.length
    ) {
      const userOfficePayload =
        officeTypeIds.flatMap((officeTypeId) =>
          officeIds.map((officeId) => ({
            userId,
            officeId,
            officeTypeId,
          })),
        );

      await (
        this as any
      ).userOfficeModel.bulkCreate(
        userOfficePayload,
        {
          transaction,
          ignoreDuplicates: true,
          fields: [
            'userId',
            'officeId',
            'officeTypeId',
          ],
        },
      );
    }

    const companyIds = [
      ...new Set(
        (
          createUserDto.companyIds ??
          (createUserDto as any).company_ids ??
          []
        )
          .map(Number)
          .filter(
            (id: number) =>
              Number.isFinite(id) && id > 0,
          ),
      ),
    ];

    if (companyIds.length) {
      await this.userCompanyModel.bulkCreate(
        companyIds.map((companyId: number) => ({
          userId,
          companyId,
        })),
        {
          transaction,
          ignoreDuplicates: true,
        },
      );
    }
  }

  private async processUserAssociationUpdates(
    userId: number,
    userUuid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const transaction =
      await this.sequelize.transaction();

    try {
      // ✅ Update roles
      if (updateUserDto.roleIds !== undefined) {
        await this.userRoleModel.destroy({
          where: { userId },
          force: true,
          transaction,
        });

        if (updateUserDto.roleIds.length > 0) {
          const userRoles =
            updateUserDto.roleIds.map(
              (roleId) => ({
                userId,
                roleId,
              }),
            );
          await this.userRoleModel.bulkCreate(
            userRoles,
            {
              transaction,
              ignoreDuplicates: true,
            },
          );

          // Delete old role-based permissions
          await this.userPermissionModel.destroy({
            where: {
              userId,
              roleId: { [Op.not]: null },
            },
            force: true,
            transaction,
          });

          // ✅ Get all role permissions in one query to avoid N+1
          const allRolePerms =
            await this.getRolePermissions(
              updateUserDto.roleIds,
              transaction,
            );

          // Map permissions to each role
          const userPermissions: any[] = [];
          for (const roleId of updateUserDto.roleIds) {
            allRolePerms.forEach(
              (permissionId) => {
                userPermissions.push({
                  userId: userId,
                  permissionId: permissionId,
                  roleId: roleId,
                });
              },
            );
          }

          if (userPermissions.length > 0) {
            await this.userPermissionModel.bulkCreate(
              userPermissions,
              {
                transaction,
                fields: [
                  'userId',
                  'permissionId',
                  'roleId',
                ],
                ignoreDuplicates: true,
              },
            );
          }
        }
      }

      // ✅ Update direct permissions
      if (
        updateUserDto.permissionIds !== undefined
      ) {
        // Only delete direct permissions (where roleId is null)
        await this.userPermissionModel.destroy({
          where: {
            userId,
            roleId: null,
          },
          force: true,
          transaction,
        });

        if (
          updateUserDto.permissionIds.length > 0
        ) {
          const directPermissions =
            updateUserDto.permissionIds.map(
              (permissionId) => ({
                userId: userId,
                permissionId: permissionId,
                roleId: null,
              }),
            );
          await this.userPermissionModel.bulkCreate(
            directPermissions,
            {
              transaction,
              fields: [
                'userId',
                'permissionId',
                'roleId',
              ],
              ignoreDuplicates: true,
            },
          );
        }
      }

      // ✅ Update modules
      if (updateUserDto.moduleIds !== undefined) {
        await this.moduleToUser.destroy({
          where: { userId },
          force: true,
          transaction,
        });

        if (updateUserDto.moduleIds.length > 0) {
          const moduleToUsers =
            updateUserDto.moduleIds.map(
              (moduleId) => ({
                userId,
                moduleId,
              }),
            );
          await this.moduleToUser.bulkCreate(
            moduleToUsers,
            {
              transaction,
              ignoreDuplicates: true,
            },
          );
        }
      }

      // ✅ Update categories
      if (
        updateUserDto.categoryIds !== undefined
      ) {
        await (
          this as any
        ).userCategoryPermissionModel.destroy({
          where: { userId },
          force: true,
          transaction,
        });

        if (
          updateUserDto.categoryIds.length > 0
        ) {
          const validCategories = await (
            this as any
          ).categoryModel.findAll({
            where: {
              id: updateUserDto.categoryIds,
            },
            attributes: ['id'],
            paranoid: true,
            transaction,
          });

          const validCategoryIds =
            validCategories.map((c) => c.id);
          const invalidCategoryIds =
            updateUserDto.categoryIds.filter(
              (id) =>
                !validCategoryIds.includes(id),
            );

          if (invalidCategoryIds.length > 0) {
            console.warn(
              `[UsersService] Invalid category IDs for user ${userId}: ${invalidCategoryIds.join(', ')}`,
            );
          }

          if (
            validCategoryIds.length > 0 &&
            (this as any)
              .userCategoryPermissionModel
          ) {
            const categoryPermissions =
              validCategoryIds.map(
                (categoryId) => ({
                  userId,
                  categoryId,
                }),
              );
            await (
              this as any
            ).userCategoryPermissionModel.bulkCreate(
              categoryPermissions,
              {
                transaction,
                ignoreDuplicates: true,
              },
            );
          }
        }
      }

      // ✅ Update sections
      if (
        updateUserDto.sectionIds !== undefined
      ) {
        await this.userSectionModel.destroy({
          where: { userId },
          force: true,
          transaction,
        });

        if (updateUserDto.sectionIds.length > 0) {
          const userSections =
            updateUserDto.sectionIds.map(
              (sectionId) => ({
                userId,
                sectionId,
              }),
            );
          await this.userSectionModel.bulkCreate(
            userSections,
            {
              transaction,
              ignoreDuplicates: true,
              fields: [
                'userId',
                'sectionId',
                'createdAt',
                'updatedAt',
              ],
            },
          );
        }
      }

      const rawCompanyIds =
        updateUserDto.companyIds ??
        (updateUserDto as any).company_ids;
      if (rawCompanyIds !== undefined) {
        await this.userCompanyModel.destroy({
          where: { userId },
          force: true,
          transaction,
        });

        const companyIds = [
          ...new Set(
            (rawCompanyIds ?? [])
              .map(Number)
              .filter(
                (id: number) =>
                  Number.isFinite(id) && id > 0,
              ),
          ),
        ];

        if (companyIds.length > 0) {
          const userCompanies = companyIds.map(
            (companyId: number) => ({
              userId,
              companyId,
            }),
          );
          await this.userCompanyModel.bulkCreate(
            userCompanies,
            {
              transaction,
              ignoreDuplicates: true,
            },
          );
        }
      }

      await this.syncUserOffices(
        userId,
        updateUserDto,
        transaction,
      );

      await transaction.commit();

      // Invalidate cache
      await this.redisService.del(
        `user:${userUuid}:permissions`,
      );
      await this.redisService.del(
        `user:${userUuid}:jwt:false`,
      );

      console.log(
        `[UsersService] Successfully processed association updates for user ${userId}`,
      );
    } catch (error) {
      await transaction.rollback();
      console.error(
        `[UsersService] Failed to process association updates for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async create(
    createUserDto: CreateUserDto,
    createdById?: number,
  ): Promise<any> {
    const transaction =
      await this.sequelize.transaction();

    try {
      // Get factoryId from unitId if factoryId is not provided
      let factoryId = createUserDto.factoryId;

      if (
        !factoryId &&
        createUserDto.unitId &&
        (this as any).productionUnit
      ) {
        const factoryUnitData = await (
          this as any
        ).productionUnit.findOne({
          where: { id: createUserDto.unitId },
          attributes: ['id', 'factoryId'],
          raw: true,
          transaction,
        });

        if (factoryUnitData?.factoryId) {
          factoryId = factoryUnitData.factoryId;
        }
      }

      const conflicts =
        await this.userModel.findOne({
          where: {
            [Op.or]: [
              { email: createUserDto.email },
              ...(createUserDto.username
                ? [
                    {
                      username:
                        createUserDto.username,
                    },
                  ]
                : []),
              ...(createUserDto.phone
                ? [{ phone: createUserDto.phone }]
                : []),
            ],
          },
          attributes: [
            'email',
            'username',
            'phone',
          ],
          transaction,
          raw: true,
        });

      if (conflicts) {
        if (
          conflicts.email === createUserDto.email
        ) {
          throw new ConflictException(
            'User with this email already exists',
          );
        }

        if (
          conflicts.username ===
          createUserDto.username
        ) {
          throw new ConflictException(
            'Username already taken',
          );
        }

        if (
          conflicts.phone === createUserDto.phone
        ) {
          throw new ConflictException(
            'Phone number already in use',
          );
        }
      }

      // Hash password
      const passwordHash = await argon2.hash(
        createUserDto.password,
      );

      const newUser = await this.userModel.create(
        {
          name:
            (createUserDto as any).name ||
            `${createUserDto.firstName || ''} ${createUserDto.lastName || ''}`.trim() ||
            createUserDto.username ||
            createUserDto.email,
          email: createUserDto.email,
          password: createUserDto.password,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          phone: createUserDto.phone ?? undefined,
          username: createUserDto.username,
          passwordHash,
          isActive:
            createUserDto.isActive ?? true,
          createdById,
          isSuperUser: false,
          userType: createUserDto.userType,
          designationId:
            createUserDto.designationId,
          employeeId: createUserDto.employeeId,
          distributionId:
            createUserDto.distributionId,
          warehouseId: createUserDto.warehouseId,
          factoryId,
          unitId: createUserDto.unitId,
        } as any,
        { transaction },
      );

      if (!newUser) {
        throw new Error(
          'Failed to create new user',
        );
      }

      // ==========================
      // Process all associations
      // ==========================
      await this.processUserAssociations(
        newUser.id,
        newUser.uuid,
        createUserDto,
        transaction,
      );

      // Commit everything
      await transaction.commit();

      // Clear permission cache
      await this.redisService.del(
        `user:${newUser.id}:permissions`,
      );

      return {
        uuid: newUser.uuid,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        userType: newUser.userType,
        isActive: newUser.isActive,
        message: 'User created successfully',
      };
    } catch (error: any) {
      await transaction.rollback();

      console.error(
        '[UsersService] User creation failed:',
        {
          message: error?.message,
          parent: error?.parent?.message,
          sql: error?.sql,
        },
      );

      throw ErrorHandlerHelper.handleError(error);
    }
  }

  async update(
    uuid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const transaction =
      await this.sequelize.transaction();

    try {
      const user = await this.userModel.findOne({
        where: { uuid },
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${uuid} not found`,
        );
      }

      let passwordHash: string | null = null;

      // Manage password update
      if (updateUserDto.password) {
        passwordHash = await argon2.hash(
          updateUserDto.password,
        );
        delete updateUserDto.password;
      }

      // Get factoryId from unitId if factoryId is not provided but unitId is
      if (
        !updateUserDto.factoryId &&
        updateUserDto.unitId &&
        (this as any).productionUnit
      ) {
        const factoryUnitData = await (
          this as any
        ).productionUnit.findOne({
          where: { id: updateUserDto.unitId },
          attributes: ['id', 'factoryId'],
          raw: true,
        });
        if (factoryUnitData?.factoryId) {
          updateUserDto.factoryId =
            factoryUnitData.factoryId;
        }
      }

      // Check email uniqueness if being updated
      if (
        updateUserDto.email &&
        updateUserDto.email !== user.email
      ) {
        const existingUser =
          await this.userModel.findOne({
            where: { email: updateUserDto.email },
            transaction,
          });

        if (existingUser) {
          throw new ConflictException(
            'User with this email already exists',
          );
        }
      }

      // Check phone uniqueness if being updated
      if (
        updateUserDto.phone &&
        updateUserDto.phone !== user.phone
      ) {
        const existingPhone =
          await this.userModel.findOne({
            where: { phone: updateUserDto.phone },
            transaction,
          });
        if (existingPhone) {
          throw new ConflictException(
            'Phone number already in use',
          );
        }
      }

      // Check username uniqueness if being updated
      if (
        updateUserDto.username &&
        updateUserDto.username !== user.username
      ) {
        const existingUsername =
          await this.userModel.findOne({
            where: {
              username: updateUserDto.username,
            },
            transaction,
          });

        if (existingUsername) {
          throw new ConflictException(
            'Username already taken',
          );
        }
      }

      // Check if association updates are needed
      const hasAssociationUpdates =
        updateUserDto.roleIds !== undefined ||
        updateUserDto.permissionIds !==
          undefined ||
        updateUserDto.moduleIds !== undefined ||
        updateUserDto.categoryIds !== undefined ||
        updateUserDto.sectionIds !== undefined ||
        updateUserDto.officeIds !== undefined ||
        updateUserDto.officeTypeIds !==
          undefined ||
        updateUserDto.companyIds !== undefined ||
        (updateUserDto as any).company_ids !==
          undefined;

      // Create a DTO without association fields for basic update
      const basicUpdateDto = { ...updateUserDto };
      delete basicUpdateDto.roleIds;
      delete basicUpdateDto.permissionIds;
      delete basicUpdateDto.moduleIds;
      delete basicUpdateDto.categoryIds;
      delete basicUpdateDto.sectionIds;
      delete (basicUpdateDto as any).officeIds;
      delete (basicUpdateDto as any)
        .officeTypeIds;
      delete basicUpdateDto.companyIds;
      delete (basicUpdateDto as any).company_ids;

      // Update basic user data
      await user.update(
        {
          ...basicUpdateDto,
          ...(passwordHash
            ? { passwordHash }
            : {}),
        },
        { transaction },
      );

      await transaction.commit();

      // ✅ Process association updates in background if needed
      if (hasAssociationUpdates) {
        this.processUserAssociationUpdates(
          user.id,
          user.uuid,
          updateUserDto,
        ).catch((error) => {
          console.error(
            `[UsersService] Background association update failed for user ${user.id}:`,
            error,
          );
        });
      }

      // ✅ Return updated user immediately
      return {
        uuid: user.uuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        userType: user.userType,
        isActive: user.isActive,
        message: hasAssociationUpdates
          ? 'User updated successfully. Role and permission updates are being processed.'
          : 'User updated successfully.',
      };
    } catch (error: any) {
      await transaction.rollback();

      throw ErrorHandlerHelper.handleError(error);
    }
  }

  async findBasicUserForJwtStrategy(
    id: number,
  ): Promise<any> {
    const cacheKey = `user:basic:${id}`;

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
          'isSuperUser',
          'distributionId',
          'warehouseId',
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
      },
    );

    if (user) {
      const plainUser = user.toJSON();
      await this.redisService.set(
        cacheKey,
        JSON.stringify(plainUser),
        300,
      );
      return plainUser;
    }

    return user;
  }

  async findByUuid(
    uuid: string,
    withPermissions?: boolean,
  ): Promise<any> {
    const user = await this.userModel.findOne({
      where: { uuid },
      attributes: [
        'id',
        'uuid',
        'userType',
        'warehouseId',
        'factoryId',
        'receivingPointId',
        'unitId',
        'firstName',
        'lastName',
        'username',
        'email',
        'phone',
        'isActive',
        'lastLoginAt',
        'lastLogoutAt',
        'isSuperUser',
      ],
      include: [
        {
          association: 'modules',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          association: 'roles',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          association: 'employee',
          attributes: [
            'id',
            'employeeCode',
            'employeeName',
          ],
          required: false,
        },
        {
          association: 'designation',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'distribution',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'warehouse',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'factory',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'unit',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'sections',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          required: false,
        },
        {
          association: 'receivingPoint',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          association: 'companies',
          attributes: ['id', 'name', 'status'],
          through: { attributes: [] },
          required: false,
        },

        // Only this is enough for office permissions
        {
          association: 'userOffices',
          attributes: [
            'officeId',
            'officeTypeId',
          ],
          required: false,
          include: [
            {
              association: 'office',
              attributes: [
                'id',
                'name',
                'slug',
                'officeType',
              ],
              required: false,
            },
            {
              association: 'officeType',
              attributes: ['id', 'name', 'slug'],
              required: false,
            },
          ],
        },

        ...(withPermissions
          ? [
              {
                association: 'permissions',
                attributes: ['id', 'name'],
                through: { attributes: [] },
                required: false,
              },
            ]
          : []),
      ],
    });

    if (!user) {
      return null;
    }

    const userJson = user.toJSON();

    const userOffices =
      userJson.userOffices || [];

    userJson.officeIds = [
      ...new Map(
        userOffices
          .filter((item: any) => item.office)
          .map((item: any) => [
            item.office.id,
            {
              id: item.office.id,
              name: item.office.name,
              slug: item.office.slug,
              officeType: item.office.officeType,
            },
          ]),
      ).values(),
    ];

    userJson.officeTypeIds = [
      ...new Map(
        userOffices
          .filter((item: any) => item.officeType)
          .map((item: any) => [
            item.officeType.id,
            {
              id: item.officeType.id,
              name: item.officeType.name,
              slug: item.officeType.slug,
            },
          ]),
      ).values(),
    ];

    delete userJson.userOffices;

    userJson.companyIds = (
      userJson.companies || []
    ).map((c: any) => c.id);

    return userJson;
  }

  async remove(uuid: string): Promise<void> {
    const user = await this.userModel.findOne({
      where: { uuid },
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${uuid} not found`,
      );
    }

    await user.destroy();
  }

  async assignRole(
    userId: number,
    roleId: number,
  ): Promise<SysUserRole> {
    // Check if user exists
    const user =
      await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    // Check if role is already assigned
    const existingUserRole =
      await this.userRoleModel.findOne({
        where: { userId, roleId },
      });

    if (existingUserRole) {
      throw new ConflictException(
        'Role already assigned to user',
      );
    }

    return this.userRoleModel.create({
      userId,
      roleId,
    });
  }

  async removeRole(
    userId: number,
    roleId: number,
  ): Promise<void> {
    const userRole =
      await this.userRoleModel.findOne({
        where: { userId, roleId },
      });

    if (!userRole) {
      throw new NotFoundException(
        'Role assignment not found',
      );
    }

    await userRole.destroy();
  }

  async updateUserRoles(
    userId: number,
    roleIds: number[],
  ): Promise<{
    assigned: SysUserRole[];
    removed: number[];
    message: string;
  }> {
    // Check if user exists
    const user =
      await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    // Get current user roles
    const currentUserRoles =
      await this.userRoleModel.findAll({
        where: { userId },
        attributes: ['roleId'],
      });

    const currentRoleIds = currentUserRoles.map(
      (ur) => ur.roleId,
    );
    const newRoleIds = [...new Set(roleIds)];

    // Determine which roles to add and remove
    const rolesToAdd = newRoleIds.filter(
      (roleId) =>
        !currentRoleIds.includes(roleId),
    );
    const rolesToRemove = currentRoleIds.filter(
      (roleId) => !newRoleIds.includes(roleId),
    );

    let assignedRoles: SysUserRole[] = [];
    let removedCount = 0;

    // Remove roles that are no longer needed
    if (rolesToRemove.length > 0) {
      removedCount =
        await this.userRoleModel.destroy({
          where: {
            userId,
            roleId: rolesToRemove,
          },
        });
    }

    // Add new roles
    if (rolesToAdd.length > 0) {
      const newAssignments = rolesToAdd.map(
        (roleId) => ({
          userId,
          roleId,
        }),
      );

      assignedRoles =
        await this.userRoleModel.bulkCreate(
          newAssignments,
          {
            returning: true,
            ignoreDuplicates: true,
          },
        );
    }

    return {
      assigned: assignedRoles,
      removed: rolesToRemove,
      message: `Updated user roles: ${assignedRoles.length} assigned, ${removedCount} removed`,
    };
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

  async findAndCount(
    params: QueryUserDto,
  ): Promise<[any[], number]> {
    const {
      search,
      page = 1,
      limit = 20,
      sortField,
      sortOrder,
      isActive,
      userType,
      designationId,
      departmentId,
      distributionId,
      factoryId,
      warehouseId,
      sectionId,
      unitId,
      companyId,
    } = params;

    const whereClause: any = {};
    const employeeWhereClause: any = {};

    if (search) {
      const searchTerm = search.trim();
      const searchWords = searchTerm.split(/\s+/);

      if (searchWords.length === 1) {
        whereClause[Op.or] = [
          {
            firstName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ];
      } else if (searchWords.length === 2) {
        const [firstWord, secondWord] =
          searchWords;

        whereClause[Op.or] = [
          {
            firstName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            [Op.and]: [
              {
                firstName: {
                  [Op.iLike]: `%${firstWord}%`,
                },
              },
              {
                lastName: {
                  [Op.iLike]: `%${secondWord}%`,
                },
              },
            ],
          },
          {
            [Op.and]: [
              {
                firstName: {
                  [Op.iLike]: `%${secondWord}%`,
                },
              },
              {
                lastName: {
                  [Op.iLike]: `%${firstWord}%`,
                },
              },
            ],
          },
        ];
      } else {
        whereClause[Op.or] = [
          {
            firstName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            lastName: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            username: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ];
      }
    }

    if (
      isActive !== undefined &&
      isActive !== null
    ) {
      whereClause.isActive = isActive;
    }

    if (userType && userType.length > 0) {
      whereClause.userType = {
        [Op.in]: userType,
      };
    }

    if (designationId) {
      whereClause.designationId = designationId;
    }

    if (departmentId) {
      employeeWhereClause.departmentId =
        departmentId;
    }

    if (distributionId) {
      employeeWhereClause.distributionId =
        distributionId;
    }

    if (factoryId) {
      employeeWhereClause.factoryId = factoryId;
    }

    if (warehouseId) {
      employeeWhereClause.showroomId =
        warehouseId;
    }

    if (unitId) {
      employeeWhereClause.unitId = unitId;
    }

    const includeEmployee =
      Object.keys(employeeWhereClause).length > 0;

    const order: any[] = [];

    if (sortField && sortOrder) {
      order.push([sortField, sortOrder]);
    }

    if (sortField !== 'id') {
      order.push(['id', 'ASC']);
    }

    const { rows, count } =
      await this.userModel.findAndCountAll({
        where: whereClause,
        attributes: {
          exclude: ['passwordHash'],
        },
        include: [
          {
            association: 'roles',
            attributes: ['id', 'name', 'slug'],
            through: { attributes: [] },
          },

          ...(includeEmployee
            ? [
                {
                  association: 'employee',
                  where: employeeWhereClause,
                  required: true,
                  attributes: [],
                },
              ]
            : []),

          {
            association: 'userOffices',
            attributes: [
              'officeId',
              'officeTypeId',
            ],
            required: false,
            include: [
              {
                association: 'office',
                attributes: [
                  'id',
                  'name',
                  'slug',
                  'officeType',
                ],
                required: false,
              },
              {
                association: 'officeType',
                attributes: [
                  'id',
                  'name',
                  'slug',
                ],
                required: false,
              },
            ],
          },

          ...(sectionId
            ? [
                {
                  association: 'sections',
                  where: { id: sectionId },
                  required: true,
                  attributes: [],
                  through: { attributes: [] },
                },
              ]
            : []),

          ...(companyId
            ? [
                {
                  association: 'companies',
                  where: { id: companyId },
                  required: true,
                  attributes: [
                    'id',
                    'name',
                    'status',
                  ],
                  through: { attributes: [] },
                },
              ]
            : [
                {
                  association: 'companies',
                  attributes: [
                    'id',
                    'name',
                    'status',
                  ],
                  through: { attributes: [] },
                  required: false,
                },
              ]),
        ],
        order,
        offset: (page - 1) * limit,
        limit,
        distinct: true,
      });

    const formattedRows = rows.map((user) => {
      const userJson = user.toJSON();

      const userOffices =
        userJson.userOffices || [];

      userJson.officeIds = [
        ...new Map(
          userOffices
            .filter((item: any) => item.office)
            .map((item: any) => [
              item.office.id,
              {
                id: item.office.id,
                name: item.office.name,
                slug: item.office.slug,
                officeType:
                  item.office.officeType,
              },
            ]),
        ).values(),
      ];

      userJson.officeTypeIds = [
        ...new Map(
          userOffices
            .filter(
              (item: any) => item.officeType,
            )
            .map((item: any) => [
              item.officeType.id,
              {
                id: item.officeType.id,
                name: item.officeType.name,
                slug: item.officeType.slug,
              },
            ]),
        ).values(),
      ];

      delete userJson.userOffices;

      userJson.companyIds = (
        userJson.companies || []
      ).map((c: any) => c.id);

      return userJson;
    });

    return [formattedRows, count];
  }
  getUserModel(): typeof SysUser {
    return this.userModel;
  }

  async getUserDropdown(
    filters?: UserFilterDropdownDto,
  ): Promise<
    {
      id: number;
      firstName: string;
      lastName: string;
      userName: string;
    }[]
  > {
    const whereClause: any = {};
    const employeeWhereClause: any = {};

    // Build employee filter conditions
    if (filters?.distributionId) {
      employeeWhereClause.distributionId =
        filters.distributionId;
    }
    if (filters?.warehouseId) {
      employeeWhereClause.showroomId =
        filters.warehouseId;
    }
    if (filters?.factoryId) {
      employeeWhereClause.factoryId =
        filters.factoryId;
    }
    if (filters?.departmentId) {
      employeeWhereClause.departmentId =
        filters.departmentId;
    }
    if (filters?.designationId) {
      employeeWhereClause.designationId =
        filters.designationId;
    }
    if (filters?.unitId) {
      employeeWhereClause.unitId = filters.unitId;
    }

    if (filters?.userType) {
      whereClause.userType = filters.userType;
    }

    if (filters?.search) {
      whereClause[Op.or] = [
        {
          firstName: {
            [Op.iLike]: `%${filters.search}%`,
          },
        },
        {
          lastName: {
            [Op.iLike]: `%${filters.search}%`,
          },
        },
        {
          username: {
            [Op.iLike]: `%${filters.search}%`,
          },
        },
      ];
    }

    const includeEmployee =
      Object.keys(employeeWhereClause).length > 0;

    const includeArray: any[] = [];

    if (includeEmployee) {
      includeArray.push({
        association: 'employee',
        where: employeeWhereClause,
        required: true,
        attributes: [],
      });
    }

    if (filters?.sectionId) {
      includeArray.push({
        association: 'sections',
        where: { id: filters.sectionId },
        required: true,
        attributes: [],
        through: { attributes: [] },
      });
    }

    const users = await this.userModel.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'username',
      ],
      where: whereClause,
      ...(includeArray.length > 0 && {
        include: includeArray,
      }),
      order: [['firstName', 'ASC']],
      limit: 500,
    });

    // Map and provide default values for undefined fields
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      userName: user.username ?? '',
    }));
  }

  async getMobileAuthEmployeeCodeDropdown(
    search?: string,
    limit?: number,
  ): Promise<
    {
      employeeCode: string;
    }[]
  > {
    const normalizedSearch = search?.trim();
    const normalizedSearchKey = normalizedSearch
      ? normalizedSearch
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '')
      : undefined;
    const safeLimit =
      limit !== undefined
        ? Math.min(
            Math.max(Number(limit) || 20, 1),
            100,
          )
        : normalizedSearch
          ? 20
          : undefined;

    const whereClause: any = {
      mobileAuth: 1,
    };

    if (normalizedSearch || normalizedSearchKey) {
      whereClause[Op.or] = [];

      if (normalizedSearch) {
        whereClause[Op.or].push({
          employeeCode: {
            [Op.iLike]: `%${normalizedSearch}%`,
          },
        });
      }

      if (normalizedSearchKey) {
        whereClause[Op.or].push(
          sequelizeWhere(
            literal(
              `regexp_replace(upper("employee_code"), '[^A-Z0-9]', '', 'g')`,
            ),
            Op.like,
            `%${normalizedSearchKey}%`,
          ),
        );
      }
    }

    const prefixOrder = literal(`
      CASE
        WHEN upper("employee_code") LIKE 'EHO-%' THEN 1
        WHEN upper("employee_code") LIKE 'EFL-%' THEN 2
        WHEN upper("employee_code") LIKE 'ERA-%' THEN 3
        WHEN upper("employee_code") LIKE 'EBR-%' THEN 4
        ELSE 99
      END
    `);

    const numericSuffixOrder = literal(`
      COALESCE(
        NULLIF(regexp_replace("employee_code", '^.*?-', ''), '')::integer,
        0
      )
    `);

    const employees: any[] = (this as any)
      .employeeModel
      ? await (this as any).employeeModel.findAll(
          {
            attributes: ['employeeCode'],
            where: whereClause,
            order: [
              [prefixOrder, 'ASC'],
              [numericSuffixOrder, 'ASC'],
              ['employeeCode', 'ASC'],
            ],
            ...(safeLimit !== undefined && {
              limit: safeLimit,
            }),
            raw: true,
          },
        )
      : [];

    return employees
      .map((employee: any) => ({
        employeeCode: String(
          employee.employeeCode ?? '',
        ).trim(),
      }))
      .filter(
        (employee) => employee.employeeCode,
      );
  }

  //delete user permission from sys_user_permission table
  async deleteUserPermissions(
    userId: number,
    permissionIds: number[],
  ): Promise<number> {
    // Verify user exists
    const user = await this.userModel.findByPk(
      userId,
      {
        attributes: ['id', 'uuid'],
      },
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    // Delete specific user permissions
    const deletedCount =
      await this.userPermissionModel.destroy({
        where: {
          userId,
          permissionId: permissionIds,
        },
        force: true,
      });

    // Invalidate user cache
    if (deletedCount > 0) {
      await this.redisService.del(
        `user:${user.uuid}:permissions`,
      );
      await this.redisService.del(
        `user:${user.uuid}:jwt:false`,
      );
      await this.redisService.del(
        `user:${userId}`,
      );
    }

    return deletedCount;
  }
  //add user permission in sys_user_permission table
  async addUserPermissions(
    userId: number,
    permissionIds: number[],
    moduleId: number,
  ): Promise<SysUserPermission[]> {
    // Verify user exists
    const user = await this.userModel.findByPk(
      userId,
      {
        attributes: ['id', 'uuid'],
      },
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found`,
      );
    }

    // Validate that all permissions belong to the specified module
    const validPermissions =
      await this.permissionModel.findAll({
        where: { id: permissionIds },
        attributes: ['id', 'featureId'],
        include: [
          {
            association: 'feature',
            attributes: ['moduleId'],
            where: { moduleId },
            required: true, // Permission must have a feature in this module
          },
        ],
        raw: true,
      });

    const validPermissionIds =
      validPermissions.map((p) => p.id);

    if (validPermissionIds.length === 0) {
      throw new Error(
        `No permissions found for module ${moduleId}`,
      );
    }

    // Get ALL existing permissions for the user that belong to this module
    const existingPermissions =
      await this.userPermissionModel.findAll({
        where: {
          userId,
        },
        attributes: ['permissionId'],
        include: [
          {
            association: 'permission',
            attributes: [],
            required: true,
            include: [
              {
                association: 'feature',
                attributes: [],
                where: { moduleId },
                required: true,
              },
            ],
          },
        ],
        raw: true,
      });

    const existingPermissionIds =
      existingPermissions.map(
        (p) => p.permissionId,
      );

    // Print full arrays for debugging (avoiding truncation)
    console.log(
      '[addUserPermissions] moduleId:',
      moduleId,
    );
    console.log(
      '[addUserPermissions] validPermissionIds:',
      JSON.stringify(validPermissionIds),
    );
    console.log(
      '[addUserPermissions] existingPermissionIds:',
      JSON.stringify(existingPermissionIds),
    );

    // Find permissions to delete (exist in DB but NOT in new request)
    const permissionsToDelete =
      existingPermissionIds.filter(
        (existingId) =>
          !validPermissionIds.includes(
            existingId,
          ),
      );

    console.log(
      '[addUserPermissions] permissionsToDelete:',
      JSON.stringify(permissionsToDelete),
    );

    // Delete permissions that are no longer needed
    if (permissionsToDelete.length > 0) {
      await this.userPermissionModel.destroy({
        where: {
          userId,
          permissionId: permissionsToDelete,
        },
        force: true,
      });
    }

    // Find permissions to add (exist in request but NOT in DB)
    const permissionsToAdd =
      validPermissionIds.filter(
        (newId) =>
          !existingPermissionIds.includes(newId),
      );

    let createdPermissions: SysUserPermission[] =
      [];

    // Add only new permissions
    if (permissionsToAdd.length > 0) {
      const userPermissions =
        permissionsToAdd.map((permissionId) => ({
          userId,
          permissionId,
        }));

      createdPermissions =
        await this.userPermissionModel.bulkCreate(
          userPermissions,
          {
            fields: ['userId', 'permissionId'],
            ignoreDuplicates: true,
          },
        );
    }

    // Invalidate user cache
    if (
      permissionsToDelete.length > 0 ||
      permissionsToAdd.length > 0
    ) {
      await this.redisService.del(
        `user:${user.uuid}:permissions`,
      );
      await this.redisService.del(
        `user:${user.uuid}:jwt:false`,
      );
      await this.redisService.del(
        `user:${userId}`,
      );
    }

    return createdPermissions;
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
}
