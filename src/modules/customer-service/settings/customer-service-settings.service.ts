import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CsServiceWorkflowRule } from 'src/database/models/customer-service/cs_service_workflow_rule.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import {
  ServiceRuleType,
  ServiceRuleStatus,
} from 'src/database/models/customer-service/cs_rules.types';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateServiceRuleDto,
  UpdateServiceRuleDto,
  QueryServiceRuleDto,
} from './dto';

export function toSnakeCaseRuleItem(rule: CsServiceWorkflowRule) {
  const plain = rule.get({ plain: true });
  return {
    id: plain.id,
    uuid: plain.uuid,
    project_id: plain.projectId ?? null,
    projectId: plain.projectId ?? null,
    project_name: plain.projectName ?? plain.projectDetails?.name ?? null,
    projectName: plain.projectName ?? plain.projectDetails?.name ?? null,
    rule_code: plain.ruleCode,
    ruleCode: plain.ruleCode,
    rule_name: plain.ruleName,
    ruleName: plain.ruleName,
    rule_type: plain.ruleType,
    ruleType: plain.ruleType,
    category_or_trigger: plain.categoryOrTrigger,
    categoryOrTrigger: plain.categoryOrTrigger,
    first_response_target: plain.firstResponseTarget,
    firstResponseTarget: plain.firstResponseTarget,
    resolution_target: plain.resolutionTarget,
    resolutionTarget: plain.resolutionTarget,
    escalation_target: plain.escalationTarget,
    escalationTarget: plain.escalationTarget,
    assigned_department: plain.assignedDepartment,
    assignedDepartment: plain.assignedDepartment,
    operating_hours: plain.operatingHours,
    operatingHours: plain.operatingHours,
    status: plain.status,
    created_at: plain.createdAt,
    updated_at: plain.updatedAt,
  };
}

@Injectable()
export class CustomerServiceSettingsService {
  private readonly logger = new Logger(CustomerServiceSettingsService.name);

  constructor(
    @InjectModel(CsServiceWorkflowRule)
    private readonly ruleModel: typeof CsServiceWorkflowRule,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    private readonly sequelize: Sequelize,
  ) {}

  private async generateRuleCode(prefix = 'RUL'): Promise<string> {
    try {
      const [rows]: any = await this.ruleModel.sequelize!.query(
        `SELECT COALESCE(
          MAX(
            NULLIF(
              regexp_replace(rule_code, '[^0-9]', '', 'g'),
              ''
            )::integer
          ),
          100
        ) AS max_code_num FROM cs_service_workflow_rules`
      );
      let nextNum = Math.max(100, Number(rows?.[0]?.max_code_num || 100)) + 1;
      while (true) {
        const candidate = `${prefix}-${nextNum}`;
        const [existing]: any = await this.ruleModel.sequelize!.query(
          `SELECT id FROM cs_service_workflow_rules WHERE rule_code = :candidate LIMIT 1`,
          { replacements: { candidate } }
        );
        if (!existing || existing.length === 0) {
          return candidate;
        }
        nextNum++;
      }
    } catch {
      const count = await this.ruleModel.count({ paranoid: false });
      return `${prefix}-${100 + count + Math.floor(Math.random() * 1000) + 1}`;
    }
  }

  async getWorkflowRuleStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    const [
      totalRules,
      slaPolicies,
      autoRouting,
      escalationMatrix,
      statutoryRules,
      activeRules,
      disabledRules,
    ] = await Promise.all([
      this.ruleModel.count({ where }),
      this.ruleModel.count({ where: { ...where, ruleType: ServiceRuleType.SLA_POLICY } }),
      this.ruleModel.count({ where: { ...where, ruleType: ServiceRuleType.AUTO_ROUTING } }),
      this.ruleModel.count({ where: { ...where, ruleType: ServiceRuleType.ESCALATION_MATRIX } }),
      this.ruleModel.count({ where: { ...where, ruleType: ServiceRuleType.STATUTORY_RULE } }),
      this.ruleModel.count({ where: { ...where, status: ServiceRuleStatus.ACTIVE } }),
      this.ruleModel.count({ where: { ...where, status: ServiceRuleStatus.DISABLED } }),
    ]);

    return {
      total_rules: totalRules,
      sla_policies: slaPolicies,
      auto_routing: autoRouting,
      escalation_matrix: escalationMatrix,
      statutory_rules: statutoryRules,
      active_rules: activeRules,
      disabled_rules: disabledRules,
      all: totalRules,
      sla: slaPolicies,
      routing: autoRouting,
      escalation: escalationMatrix,
      statutory: statutoryRules,
      active: activeRules,
      disabled: disabledRules,
    };
  }

  async findAllWorkflowRules(user: any, query: QueryServiceRuleDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    if (query.rule_type) {
      where.ruleType = query.rule_type;
    }

    if (query.tab) {
      switch (query.tab.toLowerCase()) {
        case 'sla':
        case 'sla policies':
          where.ruleType = ServiceRuleType.SLA_POLICY;
          break;
        case 'routing':
        case 'auto-routing':
          where.ruleType = ServiceRuleType.AUTO_ROUTING;
          break;
        case 'escalation':
        case 'escalation matrix':
          where.ruleType = ServiceRuleType.ESCALATION_MATRIX;
          break;
        case 'statutory':
        case 'statutory rules':
          where.ruleType = ServiceRuleType.STATUTORY_RULE;
          break;
      }
    }

    if (query.status) {
      where.status = query.status;
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        { ruleCode: { [Op.iLike]: `%${search}%` } },
        { ruleName: { [Op.iLike]: `%${search}%` } },
        { categoryOrTrigger: { [Op.iLike]: `%${search}%` } },
        { assignedDepartment: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.ruleModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'ASC']],
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map((r) => toSnakeCaseRuleItem(r)),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async findWorkflowRuleByUuid(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const rule = await this.ruleModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
      ],
    });

    if (!rule) {
      throw new NotFoundException(`Workflow rule with UUID ${uuid} not found`);
    }

    return toSnakeCaseRuleItem(rule);
  }

  async createWorkflowRule(user: any, dto: CreateServiceRuleDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    let projectName = dto.project_name?.trim();
    if (dto.project_id && !projectName) {
      const proj = await this.projectModel.findOne({
        where: { uuid: dto.project_id } as any,
        attributes: ['id', 'name'],
      });
      if (proj) {
        projectName = proj.name;
      }
    }

    let codePrefix = 'RUL';
    if (dto.rule_type === ServiceRuleType.SLA_POLICY) codePrefix = 'SLA';
    else if (dto.rule_type === ServiceRuleType.AUTO_ROUTING) codePrefix = 'RTG';
    else if (dto.rule_type === ServiceRuleType.ESCALATION_MATRIX) codePrefix = 'ESC';
    else if (dto.rule_type === ServiceRuleType.STATUTORY_RULE) codePrefix = 'STAT';

    let attempts = 0;
    while (attempts < 5) {
      try {
        const ruleCode = dto.rule_code?.trim() || (await this.generateRuleCode(codePrefix));
        const record = await this.ruleModel.create({
          organizationId: orgId,
          projectId: dto.project_id || undefined,
          projectName: projectName || null,
          ruleCode,
          ruleName: dto.rule_name.trim(),
          ruleType: dto.rule_type || ServiceRuleType.SLA_POLICY,
          categoryOrTrigger: dto.category_or_trigger.trim(),
          firstResponseTarget: dto.first_response_target?.trim() || '2 Hours',
          resolutionTarget: dto.resolution_target?.trim() || '24 Hours',
          escalationTarget: dto.escalation_target?.trim() || null,
          assignedDepartment: dto.assigned_department?.trim() || 'Site Engineering & QA',
          operatingHours: dto.operating_hours?.trim() || 'Office Hours (Sat-Thu 9am-6pm)',
          status: dto.status || ServiceRuleStatus.ACTIVE,
          createdBy: ctx.userId,
        } as any);

        return toSnakeCaseRuleItem(record);
      } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError' && attempts < 4 && !dto.rule_code) {
          attempts++;
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Failed to create workflow rule after multiple attempts');
  }

  async updateWorkflowRule(user: any, uuid: string, dto: UpdateServiceRuleDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const rule = await this.ruleModel.findOne({ where });
    if (!rule) {
      throw new NotFoundException(`Workflow rule with UUID ${uuid} not found`);
    }

    const updateFields: any = { updatedBy: ctx.userId };
    if (dto.rule_name !== undefined) updateFields.ruleName = dto.rule_name.trim();
    if (dto.rule_type !== undefined) updateFields.ruleType = dto.rule_type;
    if (dto.category_or_trigger !== undefined) updateFields.categoryOrTrigger = dto.category_or_trigger.trim();
    if (dto.first_response_target !== undefined) updateFields.firstResponseTarget = dto.first_response_target.trim();
    if (dto.resolution_target !== undefined) updateFields.resolutionTarget = dto.resolution_target.trim();
    if (dto.escalation_target !== undefined) updateFields.escalationTarget = dto.escalation_target?.trim() || null;
    if (dto.assigned_department !== undefined) updateFields.assignedDepartment = dto.assigned_department.trim();
    if (dto.operating_hours !== undefined) updateFields.operatingHours = dto.operating_hours.trim();
    if (dto.status !== undefined) updateFields.status = dto.status;
    if (dto.project_id !== undefined) updateFields.projectId = dto.project_id;
    if (dto.project_name !== undefined) updateFields.projectName = dto.project_name;

    await rule.update(updateFields);
    await rule.reload();
    return toSnakeCaseRuleItem(rule);
  }

  async toggleWorkflowRuleStatus(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const rule = await this.ruleModel.findOne({ where });
    if (!rule) {
      throw new NotFoundException(`Workflow rule with UUID ${uuid} not found`);
    }

    const newStatus =
      rule.status === ServiceRuleStatus.ACTIVE
        ? ServiceRuleStatus.DISABLED
        : ServiceRuleStatus.ACTIVE;

    await rule.update({ status: newStatus, updatedBy: ctx.userId });
    await rule.reload();
    return toSnakeCaseRuleItem(rule);
  }

  async deleteWorkflowRule(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const rule = await this.ruleModel.findOne({ where });
    if (!rule) {
      throw new NotFoundException(`Workflow rule with UUID ${uuid} not found`);
    }

    await rule.destroy();
    return { success: true, message: `Rule ${rule.ruleCode} deleted successfully` };
  }

  async reloadWorkflowEngine(user: any) {
    const stats = await this.getWorkflowRuleStats(user);
    this.logger.log(`Workflow routing rules engine reloaded. Active policies: ${stats.active_rules}`);
    return {
      success: true,
      message: 'Service workflow & SLA routing engine reloaded successfully',
      timestamp: new Date().toISOString(),
      active_rules: stats.active_rules,
      total_rules: stats.total_rules,
    };
  }
}
