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
    const headerRaw = request.headers?.['x-organization-id'];

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

    // Rule 2: For Super Admin, header is REQUIRED on POST/PUT/PATCH/DELETE
    if (isWrite && (headerRaw === undefined || headerRaw === null || headerRaw === '')) {
      throw new BadRequestException(
        'x-organization-id header is required for Super Admin write operations (POST, PUT, PATCH, DELETE)',
      );
    }

    // Rule 3: If header is provided (on write or GET), validate format and DB existence
    if (headerRaw !== undefined && headerRaw !== null && headerRaw !== '') {
      const parsedOrgId = Number(headerRaw);
      if (isNaN(parsedOrgId) || !Number.isInteger(parsedOrgId) || parsedOrgId <= 0) {
        throw new BadRequestException(
          `Invalid x-organization-id header: "${headerRaw}". Must be a valid positive integer ID.`,
        );
      }

      const model = this.organizationModel || SysOrganization;
      let orgExists = null;
      try {
        orgExists = await model.findByPk(parsedOrgId, {
          attributes: ['id'],
        });
      } catch (err) {
        // If DB is disconnected in headless unit tests
      }
      if (!orgExists) {
        throw new BadRequestException(
          `Organization ${parsedOrgId} specified in x-organization-id does not exist`,
        );
      }

      if (user) {
        user.selectedOrgId = parsedOrgId;
        user.orgId = parsedOrgId;
      }
    } else {
      // GET request without header -> all tenants
      if (user) {
        user.selectedOrgId = null;
        user.orgId = null;
      }
    }

    return true;
  }
}
