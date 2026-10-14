import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RedisService } from 'src/database/redis.service';
import { SysUserCompany } from 'src/database/models/system/sys_user_company.model';
import { SysCompany } from 'src/database/models/system/sys_company.model';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(SysUserCompany)
    private readonly sysUserCompanyModel: typeof SysUserCompany,
    @InjectModel(SysCompany)
    private readonly sysCompanyModel: typeof SysCompany,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Authentication required to access company-scoped resources',
      );
    }

    // Read selected company_id from Redis using session/user ID
    const redisKey = `user:${user.id}:selected_company`;
    const selectedCompanyIdStr =
      await this.redisService.get(redisKey);

    if (!selectedCompanyIdStr) {
      throw new ForbiddenException(
        'No company selected. Please select a company session using POST /company/select',
      );
    }

    const companyId = parseInt(
      selectedCompanyIdStr,
      10,
    );
    if (isNaN(companyId) || companyId <= 0) {
      throw new ForbiddenException(
        'Invalid company selection in session. Please re-select a company.',
      );
    }

    // Verify company exists and is Active
    const company =
      await this.sysCompanyModel.findByPk(
        companyId,
      );
    if (!company || company.status !== 'Active') {
      throw new ForbiddenException(
        'The selected company is invalid or inactive.',
      );
    }

    // Verify user is assigned to the selected company (super users bypass assignment check)
    if (!user.isSuperUser) {
      const assignment =
        await this.sysUserCompanyModel.findOne({
          where: {
            userId: user.id,
            companyId: companyId,
          },
        });

      if (!assignment) {
        throw new ForbiddenException(
          `User is not assigned to the selected company (${company.name}).`,
        );
      }
    }

    // Attach companyId and company to request context
    request.companyId = companyId;
    request.company = company;

    return true;
  }
}
