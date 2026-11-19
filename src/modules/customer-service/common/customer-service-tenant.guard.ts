import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysOrganization } from 'src/database/models/system/sys_organization.model';

@Injectable()
export class CustomerServiceTenantGuard implements CanActivate {
  constructor(
    @Optional()
    @InjectModel(SysOrganization)
    private readonly organizationModel?: typeof SysOrganization,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = (request.method || '').toUpperCase();
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    const headerRaw =
      request.headers?.['x-organization-id'] ||
      request.headers?.['x-org-id'] ||
      request.headers?.['organization-id'] ||
      request.body?.organization_id ||
      request.body?.organizationId ||
      request.query?.organization_id ||
      request.query?.organizationId;

    const isSuperAdmin = Boolean(
      user?.isSuperUser === true ||
      (user?.username === 'admin' && user?.isSuperUser !== false) ||
      (user?.isSuperUser !== false &&
        user?.roles?.some?.(
          (r: any) =>
            r === 'super-admin' ||
            r?.slug === 'super-admin' ||
            r?.name === 'Super Admin' ||
            r?.name === 'SUPER_ADMIN',
        )),
    );

    // Rule 1: For non-super-admin, the x-organization-id header is ALWAYS ignored; JWT org wins.
    if (!isSuperAdmin) {
      if (user) {
        user.selectedOrgId = user.orgId ?? user.organization?.id ?? null;
      }
      return true;
    }

    // Rule 2: For Super Admin, resolve target organization ID with multi-source fallback
    const model = this.organizationModel || SysOrganization;
    let targetOrgId: number | null = null;

    if (headerRaw !== undefined && headerRaw !== null && headerRaw !== '') {
      const headerStr = String(headerRaw).trim();
      if (!isNaN(Number(headerStr)) && Number.isInteger(Number(headerStr)) && Number(headerStr) > 0) {
        targetOrgId = Number(headerStr);
      } else if (/^[0-9a-fA-F-]{36}$/.test(headerStr)) {
        try {
          const org = await model.findOne({
            where: { uuid: headerStr },
            attributes: ['id'],
          });
          if (org) targetOrgId = org.id;
        } catch {}
      }
    }

    // Fallback A: user org from JWT or session
    if (!targetOrgId && (user?.orgId || user?.organization?.id)) {
      targetOrgId = Number(user.orgId ?? user.organization?.id);
    }

    // Fallback B: Project's organization if project_id or projectId is provided
    if (!targetOrgId) {
      const rawProj =
        request.body?.project_id ||
        request.body?.projectId ||
        request.query?.project_id ||
        request.query?.projectId;
      if (rawProj && rawProj !== 'all') {
        try {
          const projModel = model.sequelize?.model('Project');
          if (projModel) {
            const whereClause = /^[0-9a-fA-F-]{36}$/.test(rawProj)
              ? { uuid: rawProj }
              : !isNaN(Number(rawProj))
              ? { id: Number(rawProj) }
              : null;
            if (whereClause) {
              const proj = await (projModel as any).findOne({
                where: whereClause,
                attributes: ['organizationId'],
              });
              if (proj?.organizationId) {
                targetOrgId = Number(proj.organizationId);
              }
            }
          }
        } catch {}
      }
    }

    // Fallback C: If write operation, fallback to the first active organization in DB
    if (!targetOrgId && isWrite) {
      try {
        const firstOrg = await model.findOne({
          order: [['id', 'ASC']],
          attributes: ['id'],
        });
        if (firstOrg) {
          targetOrgId = firstOrg.id;
        }
      } catch {}
    }

    // Validate existence if targetOrgId was identified
    if (targetOrgId) {
      let orgExists = null;
      try {
        orgExists = await model.findByPk(targetOrgId, {
          attributes: ['id'],
        });
      } catch {}

      if (orgExists) {
        if (user) {
          user.selectedOrgId = targetOrgId;
          user.orgId = targetOrgId;
        }
        return true;
      }
    }

    // If it's a write operation and no valid organization could be resolved at all:
    if (isWrite) {
      throw new BadRequestException(
        'x-organization-id header or valid organization is required for Super Admin write operations (POST, PUT, PATCH, DELETE)',
      );
    }

    // GET request without header -> all tenants
    if (user) {
      user.selectedOrgId = null;
      user.orgId = null;
    }

    return true;
  }
}
