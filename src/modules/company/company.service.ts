import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RedisService } from 'src/database/redis.service';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { SysUserCompany } from 'src/database/models/system/sys_user_company.model';

@Injectable()
export class CompanyService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(SysCompany)
    private readonly sysCompanyModel: typeof SysCompany,
    @InjectModel(SysUserCompany)
    private readonly sysUserCompanyModel: typeof SysUserCompany,
    @InjectModel(SysUser)
    private readonly sysUserModel: typeof SysUser,
  ) {}

  /**
   * Select active company session for a user and store in Redis with no TTL
   */
  async selectCompany(
    user: { id: number; isSuperUser?: boolean },
    companyId: number,
  ) {
    if (!companyId || companyId <= 0) {
      throw new BadRequestException(
        'Valid company_id is required',
      );
    }

    const company =
      await this.sysCompanyModel.findByPk(
        companyId,
      );
    if (!company || company.status !== 'Active') {
      throw new NotFoundException(
        'Selected company not found or inactive',
      );
    }

    // Check assignment unless super user
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
          `User is not assigned to company: ${company.name} (ID: ${companyId})`,
        );
      }
    }

    // Store in Redis using user/session ID with NO TTL
    const redisKey = `user:${user.id}:selected_company`;
    await this.redisService.set(
      redisKey,
      companyId.toString(),
    );

    return {
      message: 'Company selected successfully',
      company_id: companyId,
      company: {
        id: company.id,
        name: company.name,
        code: (company as any).code,
        status: company.status,
      },
    };
  }

  /**
   * Retrieve the currently selected active company for a user from Redis
   */
  async getSelectedCompany(userId: number) {
    const redisKey = `user:${userId}:selected_company`;
    const selectedCompanyIdStr =
      await this.redisService.get(redisKey);

    if (!selectedCompanyIdStr) {
      return {
        selected_company_id: null,
        company: null,
      };
    }

    const companyId = parseInt(
      selectedCompanyIdStr,
      10,
    );
    const company =
      await this.sysCompanyModel.findByPk(
        companyId,
      );

    return {
      selected_company_id: companyId,
      company: company
        ? {
            id: company.id,
            name: company.name,
            address: company.address,
            email: company.email,
            mobile: company.mobile,
            status: company.status,
          }
        : null,
    };
  }

  /**
   * Get all companies assigned to a user (or all active companies for super user)
   */
  async getUserCompanies(
    userId: number,
    isSuperUser: boolean = false,
  ) {
    if (isSuperUser) {
      return this.sysCompanyModel.findAll({
        where: { status: 'Active' },
        order: [['name', 'ASC']],
      });
    }

    const userWithCompanies =
      await this.sysUserModel.findByPk(userId, {
        include: [
          {
            association: 'companies',
            through: { attributes: [] },
            where: { status: 'Active' },
            required: false,
          },
        ],
      });

    return userWithCompanies?.companies || [];
  }

  /**
   * Assign a user to one or multiple companies
   */
  async assignUserCompanies(
    targetUserId: number,
    companyIds: number[],
    operatorId: number,
  ) {
    const targetUser =
      await this.sysUserModel.findByPk(
        targetUserId,
      );
    if (!targetUser) {
      throw new NotFoundException(
        `User with ID ${targetUserId} not found`,
      );
    }

    // Verify all company IDs exist
    if (companyIds.length > 0) {
      const validCompanies =
        await this.sysCompanyModel.findAll({
          where: { id: companyIds },
        });

      if (
        validCompanies.length !==
        companyIds.length
      ) {
        throw new BadRequestException(
          'One or more provided company IDs are invalid',
        );
      }
    }

    // Remove existing assignments and re-create
    await this.sysUserCompanyModel.destroy({
      where: { userId: targetUserId },
    });

    if (companyIds.length > 0) {
      const records = companyIds.map((cid) => ({
        userId: targetUserId,
        companyId: cid,
        createdBy: operatorId,
        updatedBy: operatorId,
      }));

      await this.sysUserCompanyModel.bulkCreate(
        records,
      );
    }

    return this.getUserCompanies(
      targetUserId,
      false,
    );
  }
}
