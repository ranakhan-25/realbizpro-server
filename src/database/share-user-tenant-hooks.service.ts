import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { getShareUserTenant } from '../common/context/share-user-tenant.context';

const SHARE_TENANT_APPLIED = Symbol('shareTenantApplied');

const SKIP_TENANT_SCOPE_MODELS = new Set([
  'ShareUser',
  'ShareProject',
  'ShareProjectCategory',
  'ShareProjectImage',
  'ShareProjectDocument',
  'ShareProjectSubmission',
  'ShareProjectReview',
  'ShareProjectStatusHistory',
  'ShareProjectInvestment',
  'SysUser',
  'SysOrganization',
  'SysPlan',
  'SysOrgEntitlement',
  'SysRole',
  'SysPermission',
  'SysRolePermission',
  'SysUserRole',
  'SysUserPermission',
  'SysCustomPermission',
  'SysUserCustomPermission',
  'SysRoleFeature',
  'SysUserFeatureOverride',
  'SysSubscriptionPayment',
  'SysMenu',
  'SysMenuPermission',
  'SysModules',
  'SysModuleToUser',
  'SysNotification',
  'SysFileModel',
  'SysUserToken',
  'SysUserCompany',
  'SysUserSection',
  'SysCompany',
  'SysCountries',
  'SysDivision',
  'SysDistrict',
  'SysUpazila',
  'SysUnion',
  'SysUom',
  'SysSupplier',
  'SysDelegationStatus',
  'Status',
  'Modules',
  'DemoBook',
]);

const GLOBAL_UNIQUE_CODE_FIELDS = new Set([
  'code',
  'voucherNo',
  'leadCode',
  'shareCode',
  'budgetCode',
  'controlCode',
  'costCode',
  'milestoneCode',
  'partyCode',
  'agreementCode',
  'plotCode',
  'taskCode',
  'requisitionCode',
  'customerCode',
  'supplierCode',
]);

function isStringCreatedBy(attr: any): boolean {
  if (!attr || attr.references) return false;
  const typeKey = attr.type?.key;
  return !['INTEGER', 'BIGINT', 'SMALLINT'].includes(typeKey);
}

function isGlobalCodeProbe(options: any): boolean {
  if (!options || !Array.isArray(options.attributes) || options.attributes.length !== 1) {
    return false;
  }
  const attr = options.attributes[0];
  if (attr === 'id' && options.paranoid === false && !options.where) {
    return true;
  }
  if (attr === 'uuid' && options.where && typeof options.where === 'object') {
    const keys = Object.keys(options.where);
    const symbols = Object.getOwnPropertySymbols(options.where);
    return (
      symbols.length === 0 &&
      keys.length > 0 &&
      keys.every((key) => GLOBAL_UNIQUE_CODE_FIELDS.has(key))
    );
  }
  return false;
}

function applyScopeWhere(options: any, scopeCondition: Record<string, any>) {
  if (!options || options[SHARE_TENANT_APPLIED]) return;
  options[SHARE_TENANT_APPLIED] = true;
  options.where = options.where
    ? { [Op.and]: [options.where, scopeCondition] }
    : { ...scopeCondition };
}

@Injectable()
export class ShareUserTenantHooksService implements OnModuleInit {
  private static registeredSequelizes = new WeakSet<object>();

  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  onModuleInit(): void {
    if (ShareUserTenantHooksService.registeredSequelizes.has(this.sequelize)) {
      return;
    }
    ShareUserTenantHooksService.registeredSequelizes.add(this.sequelize);

    for (const model of Object.values(this.sequelize.models)) {
      const modelName = model.name;
      if (SKIP_TENANT_SCOPE_MODELS.has(modelName)) continue;

      const rawAttrs = (model as any).rawAttributes || {};
      const hasOrgId = Boolean(rawAttrs.orgId);
      const hasCreatedBy = Boolean(rawAttrs.createdBy);
      const stringCreatedBy = hasCreatedBy && isStringCreatedBy(rawAttrs.createdBy);

      if (!hasOrgId && !hasCreatedBy) continue;

      const buildScope = (ctx: { orgId: number; email: string }) =>
        hasOrgId ? { orgId: ctx.orgId } : { createdBy: ctx.email };
      const orgField = rawAttrs.orgId?.field || 'orgId';
      const createdByField = rawAttrs.createdBy?.field || 'createdBy';
      const buildMappedScope = (ctx: { orgId: number; email: string }) =>
        hasOrgId ? { [orgField]: ctx.orgId } : { [createdByField]: ctx.email };

      model.addHook('beforeFind', 'shareUserTenantFind', (options: any) => {
        const ctx = getShareUserTenant();
        if (!ctx || isGlobalCodeProbe(options)) return;
        applyScopeWhere(options, buildScope(ctx));
      });

      model.addHook('beforeCount', 'shareUserTenantCount', (options: any) => {
        const ctx = getShareUserTenant();
        if (!ctx || isGlobalCodeProbe(options)) return;
        applyScopeWhere(options, buildScope(ctx));
      });

      model.addHook('beforeCreate', 'shareUserTenantCreate', (instance: any) => {
        const ctx = getShareUserTenant();
        if (!ctx) return;
        if (hasOrgId) instance.setDataValue('orgId', ctx.orgId);
        if (stringCreatedBy) instance.setDataValue('createdBy', ctx.email);
      });

      model.addHook('beforeBulkCreate', 'shareUserTenantBulkCreate', (instances: any[]) => {
        const ctx = getShareUserTenant();
        if (!ctx || !Array.isArray(instances)) return;
        for (const instance of instances) {
          if (hasOrgId) instance.setDataValue('orgId', ctx.orgId);
          if (stringCreatedBy) instance.setDataValue('createdBy', ctx.email);
        }
      });

      model.addHook('beforeBulkUpdate', 'shareUserTenantBulkUpdate', (options: any) => {
        const ctx = getShareUserTenant();
        if (!ctx) return;
        applyScopeWhere(options, buildScope(ctx));
      });

      model.addHook('beforeBulkDestroy', 'shareUserTenantBulkDestroy', (options: any) => {
        const ctx = getShareUserTenant();
        if (!ctx) return;
        applyScopeWhere(options, buildMappedScope(ctx));
      });
    }
  }
}
