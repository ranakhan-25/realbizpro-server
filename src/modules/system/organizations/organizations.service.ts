import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as argon2 from 'argon2';

import {
  OrgSubscriptionStatus,
  SysOrganization,
} from '@/database/models/system/sys_organization.model';
import { SysPlan } from '@/database/models/system/sys_plan.model';
import { SysUser } from '@/database/models/system/sys_user.model';
import { SysRole } from '@/database/models/system/sys_role.model';
import { SysUserRole } from '@/database/models/system/sys_user_role.model';
import { SysModules } from '@/database/models/system/sys_module.model';
import { SysFeatures } from '@/database/models/system/sys_features.model';
import { SysOrgEntitlement } from '@/database/models/system/sys_org_entitlement.model';

import {
  CreateOrganizationWizardDto,
  ModuleFeatureSelectionDto,
} from './dto/create-organization-wizard.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  SubscriptionAction,
  UpdateSubscriptionDto,
} from './dto/update-subscription.dto';
import { ToggleLockDto } from './dto/toggle-lock.dto';
import { UpdateEntitlementsDto } from './dto/update-entitlements.dto';
import {
  EntitledModuleSummaryDto,
  OrganizationResponseDto,
} from './dto/organization-response.dto';
import { QueryOrganizationDto } from './dto/query-organization.dto';
import { PaginateHelper } from '@/common/helper/paginate.helper';
import { PaginateResult } from '@/common/decorators/paginate.decorator';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(SysOrganization)
    private readonly orgModel: typeof SysOrganization,
    @InjectModel(SysPlan)
    private readonly planModel: typeof SysPlan,
    @InjectModel(SysUser)
    private readonly userModel: typeof SysUser,
    @InjectModel(SysRole)
    private readonly roleModel: typeof SysRole,
    @InjectModel(SysUserRole)
    private readonly userRoleModel: typeof SysUserRole,
    @InjectModel(SysModules)
    private readonly moduleModel: typeof SysModules,
    @InjectModel(SysFeatures)
    private readonly featureModel: typeof SysFeatures,
    @InjectModel(SysOrgEntitlement)
    private readonly entitlementModel: typeof SysOrgEntitlement,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  private async formatOrgResponse(org: SysOrganization): Promise<OrganizationResponseDto> {
    const raw = org.get({ plain: true });

    // Count tenant users
    const userCount = await this.userModel.count({
      where: { orgId: org.id },
    });

    // Find org admin user
    const adminUser = await this.userModel.findOne({
      where: { orgId: org.id, isOrgAdmin: true },
      attributes: ['id', 'username', 'name', 'email', 'mobile'],
    });

    // Get entitled modules & features
    const entitlements = await this.entitlementModel.findAll({
      where: { orgId: org.id, isEnabled: true },
      include: [
        { model: this.moduleModel, as: 'module', attributes: ['id', 'code', 'name'] },
        { model: this.featureModel, as: 'feature', attributes: ['id', 'code', 'name', 'routePath'] },
      ],
    });

    const moduleMap = new Map<number, EntitledModuleSummaryDto>();
    for (const ent of entitlements) {
      const mod = ent.module;
      const feat = ent.feature;
      if (!mod || !feat) continue;

      if (!moduleMap.has(mod.id)) {
        moduleMap.set(mod.id, {
          moduleId: mod.id,
          moduleCode: mod.code || `MOD_${mod.id}`,
          moduleName: mod.name,
          features: [],
        });
      }
      moduleMap.get(mod.id)!.features.push({
        featureId: feat.id,
        featureCode: feat.code || `FEAT_${feat.id}`,
        featureName: feat.name,
        routePath: feat.routePath,
      });
    }

    return {
      id: raw.id,
      uuid: raw.uuid,
      name: raw.name,
      code: raw.code,
      email: raw.email,
      phone: raw.phone,
      address: raw.address,
      subscriptionStatus: raw.subscriptionStatus,
      subscriptionStartDate: raw.subscriptionStartDate,
      subscriptionEndDate: raw.subscriptionEndDate,
      trialEndsAt: raw.trialEndsAt,
      maxUsers: raw.maxUsers,
      maxProjects: raw.maxProjects,
      maxStorageMb: raw.maxStorageMb,
      isLocked: raw.isLocked,
      lockReason: raw.lockReason,
      userCount,
      plan: raw.plan
        ? {
            id: raw.plan.id,
            uuid: raw.plan.uuid,
            name: raw.plan.name,
            code: raw.plan.code,
            description: raw.plan.description,
            monthlyPrice: Number(raw.plan.monthlyPrice) || 0,
            yearlyPrice: Number(raw.plan.yearlyPrice) || 0,
            currency: raw.plan.currency || '$',
            billingCycle: raw.plan.billingCycle,
            durationDays: raw.plan.durationDays,
            trialDays: raw.plan.trialDays,
            maxUsers: raw.plan.maxUsers,
            maxProjects: raw.plan.maxProjects,
            maxStorageMb: raw.plan.maxStorageMb,
            features: raw.plan.features,
            status: raw.plan.status,
            subscribersCount: raw.plan.subscribersCount,
            createdAt: raw.plan.createdAt,
            updatedAt: raw.plan.updatedAt,
          }
        : undefined,
      adminUser: adminUser
        ? {
            id: adminUser.id,
            username: adminUser.username || adminUser.email,
            name: adminUser.name,
            email: adminUser.email,
            mobile: adminUser.mobile,
          }
        : undefined,
      entitledModules: Array.from(moduleMap.values()),
      createdAt: raw.createdAt,
    };
  }

  private async formatOrgsBatch(
    orgs: SysOrganization[],
    includeEntitlements: boolean = false,
  ): Promise<OrganizationResponseDto[]> {
    if (!orgs.length) return [];

    const orgIds = orgs.map((o) => o.id);

    // 1. Batch user counts (1 query)
    // 2. Batch admin users (1 query)
    // 3. Batch entitlements (only if explicitly requested; 0 queries for fast table lists)
    const [userCounts, adminUsers, entitlements] = await Promise.all([
      this.userModel.findAll({
        attributes: [
          'orgId',
          [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count'],
        ],
        where: { orgId: orgIds },
        group: ['orgId'],
        raw: true,
      }),
      this.userModel.findAll({
        where: { orgId: orgIds, isOrgAdmin: true },
        attributes: ['id', 'orgId', 'username', 'name', 'email', 'mobile'],
        raw: true,
      }),
      includeEntitlements
        ? this.entitlementModel.findAll({
            where: { orgId: orgIds, isEnabled: true },
            include: [
              {
                model: this.moduleModel,
                as: 'module',
                attributes: ['id', 'code', 'name'],
              },
              {
                model: this.featureModel,
                as: 'feature',
                attributes: ['id', 'code', 'name', 'routePath'],
              },
            ],
          })
        : Promise.resolve([]),
    ]);

    // Build lookup maps
    const countMap = new Map<number, number>();
    for (const uc of userCounts as any[]) {
      countMap.set(Number(uc.orgId), Number(uc.count) || 0);
    }

    const adminMap = new Map<number, any>();
    for (const au of adminUsers as any[]) {
      if (!adminMap.has(Number(au.orgId))) {
        adminMap.set(Number(au.orgId), au);
      }
    }

    const entMap = new Map<number, Map<number, EntitledModuleSummaryDto>>();
    for (const ent of entitlements) {
      const oId = Number(ent.orgId);
      const mod = ent.module;
      const feat = ent.feature;
      if (!mod || !feat) continue;

      if (!entMap.has(oId)) {
        entMap.set(oId, new Map());
      }
      const moduleMap = entMap.get(oId)!;
      if (!moduleMap.has(mod.id)) {
        moduleMap.set(mod.id, {
          moduleId: mod.id,
          moduleCode: mod.code || `MOD_${mod.id}`,
          moduleName: mod.name,
          features: [],
        });
      }
      moduleMap.get(mod.id)!.features.push({
        featureId: feat.id,
        featureCode: feat.code || `FEAT_${feat.id}`,
        featureName: feat.name,
        routePath: feat.routePath,
      });
    }

    // Assemble response
    return orgs.map((org) => {
      const raw = org.get({ plain: true });
      const userCount = countMap.get(org.id) || 0;
      const adminUser = adminMap.get(org.id);
      const orgEntMap = entMap.get(org.id);
      const entitledModules = orgEntMap
        ? Array.from(orgEntMap.values())
        : [];

      return {
        id: raw.id,
        uuid: raw.uuid,
        name: raw.name,
        code: raw.code,
        email: raw.email,
        phone: raw.phone,
        address: raw.address,
        subscriptionStatus: raw.subscriptionStatus,
        subscriptionStartDate: raw.subscriptionStartDate,
        subscriptionEndDate: raw.subscriptionEndDate,
        trialEndsAt: raw.trialEndsAt,
        maxUsers: raw.maxUsers,
        maxProjects: raw.maxProjects,
        maxStorageMb: raw.maxStorageMb,
        isLocked: raw.isLocked,
        lockReason: raw.lockReason,
        userCount,
        plan: raw.plan
          ? {
              id: raw.plan.id,
              uuid: raw.plan.uuid,
              name: raw.plan.name,
              code: raw.plan.code,
              description: raw.plan.description,
              monthlyPrice: Number(raw.plan.monthlyPrice) || 0,
              yearlyPrice: Number(raw.plan.yearlyPrice) || 0,
              currency: raw.plan.currency || '$',
              billingCycle: raw.plan.billingCycle,
              durationDays: raw.plan.durationDays,
              trialDays: raw.plan.trialDays,
              maxUsers: raw.plan.maxUsers,
              maxProjects: raw.plan.maxProjects,
              maxStorageMb: raw.plan.maxStorageMb,
              features: raw.plan.features,
              status: raw.plan.status,
              subscribersCount: raw.plan.subscribersCount,
              createdAt: raw.plan.createdAt,
              updatedAt: raw.plan.updatedAt,
            }
          : undefined,
        adminUser: adminUser
          ? {
              id: adminUser.id,
              username: adminUser.username || adminUser.email,
              name: adminUser.name,
              email: adminUser.email,
              mobile: adminUser.mobile,
            }
          : undefined,
        entitledModules,
        createdAt: raw.createdAt,
      };
    });
  }

  async findAll(
    query?: QueryOrganizationDto,
  ): Promise<PaginateResult<OrganizationResponseDto> | OrganizationResponseDto[]> {
    const where: any = {};

    if (query?.status && query.status !== 'all') {
      if (query.status === 'suspended') {
        where[Op.or] = [
          { isLocked: true },
          { subscriptionStatus: 'locked' },
        ];
      } else {
        where.subscriptionStatus = query.status;
      }
    }

    if (typeof query?.isLocked === 'boolean') {
      where.isLocked = query.isLocked;
    }

    if (query?.search && query.search.trim()) {
      const term = `%${query.search.trim()}%`;
      where[Op.or] = [
        { name: { [Op.iLike]: term } },
        { code: { [Op.iLike]: term } },
        { email: { [Op.iLike]: term } },
      ];
    }

    const planInclude: any = {
      model: this.planModel,
      as: 'plan',
    };

    if (query?.plan && query.plan !== 'all') {
      planInclude.where = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query.plan.trim()}%` } },
          { code: { [Op.iLike]: `%${query.plan.trim()}%` } },
        ],
      };
      planInclude.required = true;
    }

    const isPaginated =
      !query?.all &&
      (query?.page !== undefined || query?.limit !== undefined);

    if (!isPaginated) {
      const orgs = await this.orgModel.findAll({
        where,
        include: [planInclude],
        order: [['id', 'DESC']],
      });
      return this.formatOrgsBatch(orgs, query?.includeEntitlements === true);
    }

    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const offset = (page - 1) * limit;

    const { rows, count } = await this.orgModel.findAndCountAll({
      where,
      include: [planInclude],
      order: [['id', 'DESC']],
      offset,
      limit,
      distinct: true,
    });

    const formatted = await this.formatOrgsBatch(
      rows,
      query?.includeEntitlements === true,
    );

    return PaginateHelper.response(formatted, count, { page, limit });
  }

  async findOne(identifier: string | number): Promise<OrganizationResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { id: Number(identifier) }
      : { uuid: String(identifier) };

    const org = await this.orgModel.findOne({
      where,
      include: [{ model: this.planModel, as: 'plan' }],
    });
    if (!org) {
      throw new NotFoundException(`Organization "${identifier}" not found`);
    }
    return this.formatOrgResponse(org);
  }

  /**
   * Super Admin Wizard: Creates Organization + Org Admin User + Feature Entitlements in 1 atomic transaction
   */
  async createWizard(dto: CreateOrganizationWizardDto): Promise<OrganizationResponseDto> {
    const { organization: orgDto, adminUser: userDto, moduleFeatureAccess } = dto;

    // Check duplicate org code (case-insensitive)
    const existingOrg = await this.orgModel.findOne({
      where: { code: { [Op.iLike]: orgDto.code.trim() } },
    });
    if (existingOrg) {
      throw new ConflictException(`Organization code "${orgDto.code}" is already in use. Please choose a different organization code.`);
    }

    // Check duplicate user credentials (case-insensitive)
    const existingUser = await this.userModel.findOne({
      where: {
        [Op.or]: [
          { email: { [Op.iLike]: userDto.email.trim() } },
          { username: { [Op.iLike]: userDto.username.trim() } },
        ],
      },
    });
    if (existingUser) {
      const emailTaken = existingUser.email?.toLowerCase() === userDto.email.trim().toLowerCase();
      const usernameTaken = existingUser.username?.toLowerCase() === userDto.username.trim().toLowerCase();
      if (emailTaken && usernameTaken) {
        throw new ConflictException(`Both email "${userDto.email}" and username "${userDto.username}" are already registered. Please provide different admin credentials.`);
      } else if (emailTaken) {
        throw new ConflictException(`Email address "${userDto.email}" is already registered. Please provide a different admin email.`);
      } else {
        throw new ConflictException(`Username "${userDto.username}" is already taken. Please choose a different admin username.`);
      }
    }

    // Resolve plan if provided
    let plan: SysPlan | null = null;
    if (orgDto.planId) {
      const isNum = !isNaN(Number(orgDto.planId));
      plan = await this.planModel.findOne({
        where: isNum
          ? { id: Number(orgDto.planId) }
          : { uuid: String(orgDto.planId) },
      });
    }

    const now = new Date();
    const durationDays = orgDto.durationDays || plan?.durationDays || 30;
    const trialDays = orgDto.trialDays !== undefined ? orgDto.trialDays : plan?.trialDays ?? 14;

    const subscriptionStartDate = now;
    const subscriptionEndDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const trialEndsAt = trialDays > 0 ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000) : null;
    const subscriptionStatus = trialDays > 0 ? OrgSubscriptionStatus.TRIAL : OrgSubscriptionStatus.ACTIVE;

    const maxUsers = orgDto.maxUsers || plan?.maxUsers || 5;
    const maxProjects = orgDto.maxProjects || plan?.maxProjects || 5;
    const maxStorageMb = orgDto.maxStorageMb || plan?.maxStorageMb || 10240;

    const passwordHash = await argon2.hash(userDto.password);

    // Execute atomic transaction across all 3 tables
    const createdOrg = await this.sequelize.transaction(async (tx) => {
      // 1. Create Organization
      const org = await this.orgModel.create(
        {
          name: orgDto.name,
          code: orgDto.code,
          email: orgDto.email,
          phone: orgDto.phone,
          address: orgDto.address,
          planId: plan ? plan.id : undefined,
          planUuid: plan ? plan.uuid : undefined,
          subscriptionStatus,
          subscriptionStartDate,
          subscriptionEndDate,
          trialEndsAt,
          maxUsers,
          maxProjects,
          maxStorageMb,
          isLocked: false,
        } as any,
        { transaction: tx },
      );

      // 2. Create Org Admin User
      const admin = await this.userModel.create(
        {
          name: userDto.name,
          username: userDto.username,
          email: userDto.email,
          password: passwordHash,
          passwordHash,
          mobile: userDto.mobile,
          designationName: userDto.designationName || 'Organization Administrator',
          orgId: org.id,
          orgUuid: org.uuid,
          isOrgAdmin: true,
          isActive: true,
          isSuperUser: false,
        } as any,
        { transaction: tx },
      );

      // 3. Ensure Org Admin Role exists
      let adminRole = await this.roleModel.findOne({
        where: { slug: 'org-admin' },
        transaction: tx,
      });
      if (!adminRole) {
        adminRole = await this.roleModel.create(
          {
            name: 'Organization Admin',
            slug: 'org-admin',
            description: 'Tenant Administrator with management authority over organization',
            isSystemRole: true,
          } as any,
          { transaction: tx },
        );
      }

      await this.userRoleModel.create(
        {
          userId: admin.id,
          roleId: adminRole.id,
        } as any,
        { transaction: tx },
      );

      // 4. Create Module & Feature Entitlements
      if (moduleFeatureAccess && moduleFeatureAccess.length > 0) {
        for (const item of moduleFeatureAccess) {
          const modId = Number(item.moduleId);
          for (const featId of item.featureIds) {
            await this.entitlementModel.create(
              {
                orgId: org.id,
                orgUuid: org.uuid,
                moduleId: modId,
                featureId: Number(featId),
                isEnabled: true,
              } as any,
              { transaction: tx },
            );
          }
        }
      }

      // 5. Increment Plan Subscribers
      if (plan) {
        await plan.increment('subscribersCount', { by: 1, transaction: tx });
      }

      return org;
    });

    const fullOrg = await this.orgModel.findByPk(createdOrg.id, {
      include: [{ model: this.planModel, as: 'plan' }],
    });
    return this.formatOrgResponse(fullOrg!);
  }

  async update(identifier: string | number, dto: UpdateOrganizationDto): Promise<OrganizationResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { id: Number(identifier) }
      : { uuid: String(identifier) };

    const org = await this.orgModel.findOne({ where });
    if (!org) throw new NotFoundException(`Organization "${identifier}" not found`);

    await org.update(dto as any);
    const reloaded = await this.orgModel.findByPk(org.id, {
      include: [{ model: this.planModel, as: 'plan' }],
    });
    return this.formatOrgResponse(reloaded!);
  }

  async updateSubscription(
    identifier: string | number,
    dto: UpdateSubscriptionDto,
  ): Promise<OrganizationResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { id: Number(identifier) }
      : { uuid: String(identifier) };

    const org = await this.orgModel.findOne({ where });
    if (!org) throw new NotFoundException(`Organization "${identifier}" not found`);

    const updates: any = {};
    const now = new Date();

    if (dto.action === SubscriptionAction.RENEW || dto.action === SubscriptionAction.EXTEND) {
      const days = dto.durationDays || 30;
      const baseDate = org.subscriptionEndDate && org.subscriptionEndDate > now
        ? new Date(org.subscriptionEndDate)
        : now;
      updates.subscriptionEndDate = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
      updates.subscriptionStatus = OrgSubscriptionStatus.ACTIVE;
      updates.isLocked = false;
    } else if (dto.action === SubscriptionAction.CHANGE_PLAN && dto.planId) {
      const isNum = !isNaN(Number(dto.planId));
      const newPlan = await this.planModel.findOne({
        where: isNum
          ? { id: Number(dto.planId) }
          : { uuid: String(dto.planId) },
      });
      if (!newPlan) throw new NotFoundException(`Plan "${dto.planId}" not found`);

      updates.planId = newPlan.id;
      updates.planUuid = newPlan.uuid;
      updates.maxUsers = newPlan.maxUsers;
      updates.maxProjects = newPlan.maxProjects;
      updates.maxStorageMb = newPlan.maxStorageMb;
      const days = dto.durationDays || newPlan.durationDays || 30;
      updates.subscriptionEndDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
      updates.subscriptionStatus = OrgSubscriptionStatus.ACTIVE;
      updates.isLocked = false;
    } else if (dto.action === SubscriptionAction.CANCEL) {
      updates.subscriptionStatus = OrgSubscriptionStatus.CANCELED;
      updates.isLocked = true;
      updates.lockReason = 'Subscription canceled by customer or administrator';
    }

    if (dto.subscriptionEndDate) {
      updates.subscriptionEndDate = new Date(dto.subscriptionEndDate);
    }
    if (dto.status) {
      updates.subscriptionStatus = dto.status;
    }

    await org.update(updates);
    const reloaded = await this.orgModel.findByPk(org.id, {
      include: [{ model: this.planModel, as: 'plan' }],
    });
    return this.formatOrgResponse(reloaded!);
  }

  async toggleLock(identifier: string | number, dto: ToggleLockDto): Promise<OrganizationResponseDto> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { id: Number(identifier) }
      : { uuid: String(identifier) };

    const org = await this.orgModel.findOne({ where });
    if (!org) throw new NotFoundException(`Organization "${identifier}" not found`);

    await org.update({
      isLocked: dto.isLocked,
      lockReason: dto.isLocked ? dto.lockReason || 'Administrative suspension' : null,
      subscriptionStatus: dto.isLocked ? OrgSubscriptionStatus.LOCKED : org.subscriptionStatus,
    });

    const reloaded = await this.orgModel.findByPk(org.id, {
      include: [{ model: this.planModel, as: 'plan' }],
    });
    return this.formatOrgResponse(reloaded!);
  }

  async getEntitlements(identifier: string | number): Promise<EntitledModuleSummaryDto[]> {
    const org = await this.findOne(identifier);
    return org.entitledModules || [];
  }

  async updateEntitlements(
    identifier: string | number,
    dto: UpdateEntitlementsDto,
  ): Promise<EntitledModuleSummaryDto[]> {
    const isNumeric = !isNaN(Number(identifier));
    const where: any = isNumeric
      ? { id: Number(identifier) }
      : { uuid: String(identifier) };

    const org = await this.orgModel.findOne({ where });
    if (!org) throw new NotFoundException(`Organization "${identifier}" not found`);

    await this.sequelize.transaction(async (tx) => {
      // Clear existing entitlements permanently so new entries can be inserted cleanly
      await this.entitlementModel.destroy({
        where: { orgId: org.id },
        force: true,
        transaction: tx,
      });

      // Insert new entitlements with deduplication protection via high-performance bulkCreate
      const seenFeatures = new Set<number>();
      const recordsToInsert: any[] = [];
      for (const item of dto.moduleFeatureAccess) {
        const modId = Number(item.moduleId);
        if (!item.featureIds || !Array.isArray(item.featureIds)) continue;

        for (const featId of item.featureIds) {
          const numFeatId = Number(featId);
          if (isNaN(numFeatId) || seenFeatures.has(numFeatId)) continue;
          seenFeatures.add(numFeatId);

          recordsToInsert.push({
            orgId: org.id,
            orgUuid: org.uuid,
            moduleId: modId,
            featureId: numFeatId,
            isEnabled: true,
          });
        }
      }

      if (recordsToInsert.length > 0) {
        await this.entitlementModel.bulkCreate(recordsToInsert, {
          transaction: tx,
        });
      }
    });

    return this.getEntitlements(org.id);
  }

  async getDropdown(): Promise<{ id: number; name: string }[]> {
    const orgs = await this.orgModel.findAll({
      attributes: ['id', 'name'],
      where: {
        subscriptionStatus: {
          [Op.in]: [OrgSubscriptionStatus.ACTIVE, OrgSubscriptionStatus.TRIAL],
        },
      },
      order: [['name', 'ASC']],
    });
    return orgs.map((org) => ({ id: org.id, name: org.name }));
  }
}
