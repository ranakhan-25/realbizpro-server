import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SysCustomPermission } from '../../../database/models/system/sys_custom_permission.model';
import { SysUserCustomPermission } from '../../../database/models/system/sys_user_custom_permission.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { CreateCustomPermissionDto } from './dto/create-custom-permission.dto';
import { QueryCustomPermissionDto } from './dto/query-custom-permission.dto';
import {
  BulkSetUserCustomPermissionOverridesDto,
  PermissionOverrideEffect,
  SetUserCustomPermissionOverrideDto,
} from './dto/user-permission-override.dto';

@Injectable()
export class CustomPermissionsService implements OnModuleInit {
  constructor(
    @InjectModel(SysCustomPermission)
    private customPermissionModel: typeof SysCustomPermission,
    @InjectModel(SysUserCustomPermission)
    private userCustomPermissionModel: typeof SysUserCustomPermission,
    @InjectModel(SysUser)
    private userModel: typeof SysUser,
  ) {}

  async onModuleInit() {
    try {
      await this.customPermissionModel.sync({ alter: false });
      await this.userCustomPermissionModel.sync({ alter: false });
    } catch (err) {
      // Sync errors handled silently
    }
  }

  private async resolveUserId(userIdentifier: string | number): Promise<number> {
    const raw = String(userIdentifier).trim();
    const numericId = Number(raw);
    if (!isNaN(numericId) && numericId > 0 && /^\d+$/.test(raw)) {
      return numericId;
    }
    const user = await this.userModel.findOne({
      where: { uuid: raw },
      attributes: ['id'],
    });
    if (!user) {
      throw new NotFoundException(`User with identifier ${userIdentifier} not found`);
    }
    return Number(user.id);
  }

  async create(dto: CreateCustomPermissionDto): Promise<SysCustomPermission> {
    const rawKey = (
      dto.key ||
      `${dto.resource || (dto.featureId ? `feature_${dto.featureId}` : 'perm')}.${dto.action}`
    )
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_');

    let finalKey = rawKey;
    const existing = await this.customPermissionModel.findOne({
      where: { key: finalKey },
    });
    if (existing) {
      finalKey = `${rawKey}_${Date.now().toString(36)}`;
    }

    return this.customPermissionModel.create({
      name: dto.name,
      key: finalKey,
      action: dto.action.toLowerCase(),
      featureId: dto.featureId ? Number(dto.featureId) : undefined,
      resource:
        dto.resource || (dto.featureId ? `feature_${dto.featureId}` : 'custom'),
      context: 'any',
      description: dto.description || null,
    });
  }

  async findAndCount(
    query: QueryCustomPermissionDto,
  ): Promise<[SysCustomPermission[], number]> {
    const { page = 1, limit = 50, search, action, featureId } = query;
    const where: any = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { key: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { resource: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (action && action !== 'all') {
      where.action = action.toLowerCase();
    }

    if (featureId) {
      where.featureId = featureId;
    }

    const { rows, count } = await this.customPermissionModel.findAndCountAll({
      where,
      include: [
        {
          association: 'feature',
          attributes: ['id', 'name', 'code'],
          required: false,
        },
      ],
      order: [['created_at', 'DESC']],
      offset: (page - 1) * limit,
      limit,
    });

    return [rows, count];
  }

  async findOne(id: string | number): Promise<SysCustomPermission> {
    const record = await this.customPermissionModel.findByPk(id, {
      include: [
        {
          association: 'feature',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });
    if (!record) {
      throw new NotFoundException(`Custom permission with ID ${id} not found`);
    }
    return record;
  }

  async remove(id: string | number): Promise<void> {
    const record = await this.findOne(id);
    await this.userCustomPermissionModel.destroy({
      where: { customPermissionId: record.id },
    });
    await record.destroy();
  }

  /* =========================================================
     USER OVERRIDES & RESTRICTIONS IMPLEMENTATION
  ========================================================= */

  async getUserOverrides(userIdentifier: string | number) {
    const userId = await this.resolveUserId(userIdentifier);

    // 1. Fetch all configured custom permissions
    const allCustomPermissions = await this.customPermissionModel.findAll({
      include: [
        {
          association: 'feature',
          attributes: ['id', 'name', 'code'],
          required: false,
        },
      ],
      order: [['name', 'ASC']],
    });

    // 2. Fetch overrides for this user
    const userOverrides = await this.userCustomPermissionModel.findAll({
      where: { userId },
    });

    const overrideMap = new Map<number, SysUserCustomPermission>();
    userOverrides.forEach((ov) => {
      overrideMap.set(Number(ov.customPermissionId), ov);
    });

    // 3. Merge catalog with user override state
    const items = allCustomPermissions.map((perm) => {
      const activeOverride = overrideMap.get(Number(perm.id));
      return {
        id: perm.id,
        uuid: perm.uuid,
        name: perm.name,
        key: perm.key,
        action: perm.action,
        resource: perm.resource,
        description: perm.description,
        featureId: perm.featureId,
        feature: perm.feature,
        override: activeOverride
          ? {
              id: activeOverride.id,
              effect: activeOverride.effect, // 'DENY' or 'ALLOW'
              reason: activeOverride.reason || null,
              createdAt: activeOverride.createdAt,
              updatedAt: activeOverride.updatedAt,
            }
          : null,
      };
    });

    const totalDenied = items.filter(
      (item) => item.override?.effect === 'DENY',
    ).length;
    const totalAllowed = items.filter(
      (item) => item.override?.effect === 'ALLOW',
    ).length;

    return {
      userId,
      totalCount: items.length,
      totalOverrides: userOverrides.length,
      totalDenied,
      totalAllowed,
      permissions: items,
    };
  }

  async setUserOverride(
    userIdentifier: string | number,
    dto: SetUserCustomPermissionOverrideDto,
  ) {
    const userId = await this.resolveUserId(userIdentifier);
    const perm = await this.findOne(dto.customPermissionId);

    const existing = await this.userCustomPermissionModel.findOne({
      where: {
        userId,
        customPermissionId: perm.id,
      },
    });

    if (existing) {
      existing.effect = dto.effect;
      existing.reason = dto.reason || null;
      await existing.save();
      return existing;
    }

    return this.userCustomPermissionModel.create({
      userId,
      customPermissionId: Number(perm.id),
      effect: dto.effect,
      reason: dto.reason || null,
    });
  }

  async removeUserOverride(
    userIdentifier: string | number,
    customPermissionId: string | number,
  ) {
    const userId = await this.resolveUserId(userIdentifier);
    const perm = await this.customPermissionModel.findByPk(customPermissionId);
    const targetPermId = perm ? perm.id : Number(customPermissionId);

    await this.userCustomPermissionModel.destroy({
      where: {
        userId,
        customPermissionId: targetPermId,
      },
    });

    return { success: true };
  }

  async bulkSetUserOverrides(
    userIdentifier: string | number,
    dto: BulkSetUserCustomPermissionOverridesDto,
  ) {
    const userId = await this.resolveUserId(userIdentifier);

    for (const item of dto.overrides) {
      const permId = Number(item.customPermissionId);
      if (item.effect === PermissionOverrideEffect.INHERIT) {
        await this.userCustomPermissionModel.destroy({
          where: {
            userId,
            customPermissionId: permId,
          },
        });
      } else {
        const existing = await this.userCustomPermissionModel.findOne({
          where: {
            userId,
            customPermissionId: permId,
          },
        });

        if (existing) {
          existing.effect = item.effect;
          existing.reason = item.reason || null;
          await existing.save();
        } else {
          await this.userCustomPermissionModel.create({
            userId,
            customPermissionId: permId,
            effect: item.effect,
            reason: item.reason || null,
          });
        }
      }
    }

    return this.getUserOverrides(userId);
  }

  async getActiveUserOverrideSummaries() {
    const overrides = await this.userCustomPermissionModel.findAll({
      attributes: ['userId', 'effect'],
    });

    const summaryMap: Record<
      number,
      { totalOverrides: number; deniedCount: number; allowedCount: number }
    > = {};

    overrides.forEach((ov) => {
      const uid = Number(ov.userId);
      if (!summaryMap[uid]) {
        summaryMap[uid] = { totalOverrides: 0, deniedCount: 0, allowedCount: 0 };
      }
      summaryMap[uid].totalOverrides += 1;
      if (ov.effect === 'DENY') {
        summaryMap[uid].deniedCount += 1;
      } else if (ov.effect === 'ALLOW') {
        summaryMap[uid].allowedCount += 1;
      }
    });

    return summaryMap;
  }

  async checkUserPermissionAccess(
    userIdentifier: string | number,
    permissionKey: string,
  ) {
    const userId = await this.resolveUserId(userIdentifier);
    const targetKey = permissionKey.toLowerCase().trim();

    const perm = await this.customPermissionModel.findOne({
      where: { key: targetKey },
    });

    if (!perm) {
      return {
        granted: false,
        source: 'default_deny',
        reason: 'Permission key does not exist in master catalog',
      };
    }

    // Step 1: Check user level override
    const userOverride = await this.userCustomPermissionModel.findOne({
      where: {
        userId,
        customPermissionId: perm.id,
      },
    });

    if (userOverride) {
      if (userOverride.effect === 'DENY') {
        return {
          granted: false,
          source: 'user_override_deny',
          reason: userOverride.reason || 'Explicitly denied by user override',
        };
      }
      if (userOverride.effect === 'ALLOW') {
        return {
          granted: true,
          source: 'user_override_allow',
          reason: userOverride.reason || 'Explicitly granted by user override',
        };
      }
    }

    // Step 2: Role check fallback
    return {
      granted: true,
      source: 'role_inherited',
      reason: 'Inherited from assigned role permissions',
    };
  }
}
