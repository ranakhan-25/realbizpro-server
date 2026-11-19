import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CsWarrantyDlpClaim } from 'src/database/models/customer-service/cs_warranty_dlp_claim.model';
import { CsMaintenanceRequest } from 'src/database/models/customer-service/cs_maintenance_request.model';
import { CsOwnersAssociation } from 'src/database/models/customer-service/cs_owners_association.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import {
  DlpClaimStatus,
  DlpDefectCategory,
  DlpSeverity,
  MaintenanceType,
  MaintenanceStatus,
  AssociationGovernanceStatus,
} from 'src/database/models/customer-service/cs_property_care.types';
import {
  CreateDlpClaimDto,
  UpdateDlpClaimDto,
  QueryDlpClaimDto,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  QueryMaintenanceDto,
  CreateOwnersAssociationDto,
  UpdateOwnersAssociationDto,
  QueryOwnersAssociationDto,
} from './dto';
import { extractUserContext } from '../common/customer-service-context.helper';

export function formatDlpClaim(c: CsWarrantyDlpClaim) {
  return {
    id: c.claimNo || `DLP-${c.id}`,
    uuid: c.uuid,
    claim_no: c.claimNo,
    claimNo: c.claimNo,
    customer_name: c.customerName,
    customerName: c.customerName,
    unit: c.unit,
    project: c.projectDetails?.name || c.projectName || 'Assigned Project',
    project_name: c.projectDetails?.name || c.projectName || 'Assigned Project',
    project_id: c.projectId,
    possession_date: c.possessionDate,
    possessionDate: c.possessionDate,
    dlp_expiry_date: c.dlpExpiryDate,
    dlpExpiryDate: c.dlpExpiryDate,
    defect_category: c.defectCategory,
    defectCategory: c.defectCategory,
    severity: c.severity,
    assigned_engineer: c.assignedEngineer || '',
    assignedEngineer: c.assignedEngineer || '',
    status: c.status,
    rectification_notes: c.rectificationNotes || '',
    signed_off_at: c.signedOffAt,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

export function formatMaintenance(m: CsMaintenanceRequest) {
  return {
    id: m.requestNo || `MNT-${m.id}`,
    uuid: m.uuid,
    request_no: m.requestNo,
    requestNo: m.requestNo,
    facility: m.facility,
    project: m.projectDetails?.name || m.projectName || 'Assigned Project',
    project_name: m.projectDetails?.name || m.projectName || 'Assigned Project',
    project_id: m.projectId,
    maintenance_type: m.maintenanceType,
    maintenanceType: m.maintenanceType,
    scheduled_date: m.scheduledDate,
    scheduledDate: m.scheduledDate,
    vendor_name: m.vendorName,
    vendorName: m.vendorName,
    cost_estimate: Number(m.costEstimate) || 0,
    costEstimate: Number(m.costEstimate) || 0,
    actual_cost: m.actualCost !== null && m.actualCost !== undefined ? Number(m.actualCost) : null,
    actualCost: m.actualCost !== null && m.actualCost !== undefined ? Number(m.actualCost) : null,
    status: m.status,
    completion_date: m.completionDate,
    completionDate: m.completionDate,
    remarks: m.remarks || '',
    created_at: m.createdAt,
    updated_at: m.updatedAt,
  };
}

export function formatOwnersAssociation(a: CsOwnersAssociation) {
  return {
    id: a.associationCode || `OA-${a.id}`,
    uuid: a.uuid,
    association_code: a.associationCode,
    associationCode: a.associationCode,
    association_name: a.associationName,
    associationName: a.associationName,
    project: a.projectDetails?.name || a.projectName,
    project_name: a.projectDetails?.name || a.projectName,
    project_id: a.projectId,
    president_name: a.presidentName,
    presidentName: a.presidentName,
    contact_phone: a.contactPhone || '',
    contactPhone: a.contactPhone || '',
    total_flats: Number(a.totalFlats) || 0,
    totalFlats: Number(a.totalFlats) || 0,
    handed_over_count: Number(a.handedOverCount) || 0,
    handedOverCount: Number(a.handedOverCount) || 0,
    monthly_service_charge_per_flat: Number(a.monthlyServiceChargePerFlat) || 0,
    monthlyServiceChargePerFlat: Number(a.monthlyServiceChargePerFlat) || 0,
    association_bank_acc: a.associationBankAcc || '',
    associationBankAcc: a.associationBankAcc || '',
    handover_status: a.handoverStatus,
    handoverStatus: a.handoverStatus,
    transition_date: a.transitionDate,
    remarks: a.remarks || '',
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

@Injectable()
export class CustomerServicePropertyCareService {
  constructor(
    @InjectModel(CsWarrantyDlpClaim)
    private readonly dlpClaimModel: typeof CsWarrantyDlpClaim,
    @InjectModel(CsMaintenanceRequest)
    private readonly maintenanceModel: typeof CsMaintenanceRequest,
    @InjectModel(CsOwnersAssociation)
    private readonly ownersAssociationModel: typeof CsOwnersAssociation,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    private readonly sequelize: Sequelize,
  ) {}

  // -------------------------------------------------------------
  // HELPER: Code Generators with Collision Protection
  // -------------------------------------------------------------
  private async generateClaimNo(orgId: number): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `DLP-${currentYear}-`;
    const sql = `
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(claim_no, '^.*-', '', 'g'),
            ''
          )::integer
        ),
        0
      ) AS max_num
      FROM cs_warranty_dlp_claims
      WHERE organization_id = :orgId AND claim_no LIKE :prefixPattern
    `;

    const result = await this.sequelize.query<{ max_num: number }>(sql, {
      replacements: { orgId, prefixPattern: `${prefix}%` },
      type: QueryTypes.SELECT,
    });

    const nextNum = (Number(result[0]?.max_num) || 0) + 1;
    return `${prefix}${String(nextNum).padStart(4, '0')}`;
  }

  private async generateRequestNo(orgId: number): Promise<string> {
    const sql = `
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(request_no, '[^0-9]', '', 'g'),
            ''
          )::integer
        ),
        500
      ) AS max_num
      FROM cs_maintenance_requests
      WHERE organization_id = :orgId
    `;

    const result = await this.sequelize.query<{ max_num: number }>(sql, {
      replacements: { orgId },
      type: QueryTypes.SELECT,
    });

    const nextNum = (Number(result[0]?.max_num) || 500) + 1;
    return `MNT-${nextNum}`;
  }

  private async generateAssociationCode(orgId: number): Promise<string> {
    const sql = `
      SELECT COALESCE(
        MAX(
          NULLIF(
            regexp_replace(association_code, '[^0-9]', '', 'g'),
            ''
          )::integer
        ),
        0
      ) AS max_num
      FROM cs_owners_associations
      WHERE organization_id = :orgId
    `;

    const result = await this.sequelize.query<{ max_num: number }>(sql, {
      replacements: { orgId },
      type: QueryTypes.SELECT,
    });

    const nextNum = (Number(result[0]?.max_num) || 0) + 1;
    return `OA-${String(nextNum).padStart(2, '0')}`;
  }

  // =============================================================
  // 1. WARRANTY & DLP CLAIMS
  // =============================================================
  async getDlpStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (projectId) {
      where.project_id = projectId;
    }

    const totalClaims = await this.dlpClaimModel.count({ where });

    const inProgressClaims = await this.dlpClaimModel.count({
      where: {
        ...where,
        status: {
          [Op.in]: [
            DlpClaimStatus.CLAIM_LOGGED,
            DlpClaimStatus.SITE_INSPECTED,
            DlpClaimStatus.RECTIFICATION_IN_PROGRESS,
          ],
        },
      },
    });

    const resolvedClaims = await this.dlpClaimModel.count({
      where: {
        ...where,
        status: DlpClaimStatus.RESOLVED_SIGNED_OFF,
      },
    });

    const criticalClaims = await this.dlpClaimModel.count({
      where: {
        ...where,
        severity: DlpSeverity.CRITICAL_STRUCTURAL,
      },
    });

    const deletedCount = await this.dlpClaimModel.count({
      where: { ...where, deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });

    return {
      totalClaims,
      inProgressClaims,
      resolvedClaims,
      criticalClaims,
      deletedClaims: deletedCount,
      deleted_count: deletedCount,
    };
  }

  async findAllDlpClaims(user: any, query: QueryDlpClaimDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.defect_category) {
      where.defect_category = query.defect_category;
    }
    if (query.severity) {
      where.severity = query.severity;
    }
    if (query.status) {
      where.status = query.status;
    }

    // Tabs filter
    if (query.tab === 'active') {
      where.status = { [Op.ne]: DlpClaimStatus.RESOLVED_SIGNED_OFF };
    } else if (query.tab === 'resolved') {
      where.status = DlpClaimStatus.RESOLVED_SIGNED_OFF;
    }

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      where[Op.or] = [
        { claim_no: { [Op.iLike]: term } },
        { customer_name: { [Op.iLike]: term } },
        { unit: { [Op.iLike]: term } },
        { project_name: { [Op.iLike]: term } },
        { assigned_engineer: { [Op.iLike]: term } },
      ];
    }

    const isDeleted = Boolean((query as any).is_deleted ?? (query as any).isDeleted);
    if (isDeleted) {
      where.deletedAt = { [Op.ne]: null };
    }

    const { count, rows } = await this.dlpClaimModel.findAndCountAll({
      where,
      limit,
      offset,
      paranoid: !isDeleted,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map(formatDlpClaim),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  private async getDlpClaimEntity(user: any, uuid: string): Promise<CsWarrantyDlpClaim> {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }

    const claim = await this.dlpClaimModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    if (!claim) {
      throw new NotFoundException(`DLP Claim with UUID ${uuid} not found`);
    }

    return claim;
  }

  async findDlpClaimByUuid(user: any, uuid: string) {
    const claim = await this.getDlpClaimEntity(user, uuid);
    return formatDlpClaim(claim);
  }

  async createDlpClaim(user: any, dto: CreateDlpClaimDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    let projectName = dto.project_name;
    if (dto.project_id && !projectName) {
      const proj = await this.projectModel.findOne({
        where: { uuid: dto.project_id } as any,
      });
      if (proj) {
        projectName = proj.name;
      }
    }

    // Default possessionDate is today, dlpExpiryDate is 2 years from possession
    const possessionDate = dto.possession_date || new Date().toISOString().split('T')[0];
    let dlpExpiryDate = dto.dlp_expiry_date;
    if (!dlpExpiryDate) {
      const pDate = new Date(possessionDate);
      pDate.setFullYear(pDate.getFullYear() + 2);
      pDate.setDate(pDate.getDate() - 1);
      dlpExpiryDate = pDate.toISOString().split('T')[0];
    }

    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      const claimNo = await this.generateClaimNo(orgId);
      try {
        const claim = await this.dlpClaimModel.create({
          organizationId: orgId,
          projectId: dto.project_id,
          projectName: projectName || 'Assigned Project',
          bookingId: dto.booking_id,
          customerProfileId: dto.customer_profile_id,
          claimNo,
          customerName: dto.customer_name,
          unit: dto.unit,
          possessionDate,
          dlpExpiryDate,
          defectCategory: dto.defect_category || DlpDefectCategory.WATER_SEEPAGE,
          severity: dto.severity || DlpSeverity.MAJOR,
          assignedEngineer: dto.assigned_engineer,
          assignedEngineerId: dto.assigned_engineer_id,
          status: DlpClaimStatus.CLAIM_LOGGED,
          rectificationNotes: dto.rectification_notes,
          createdBy: ctx.userId,
        });

        return this.findDlpClaimByUuid(user, claim.uuid);
      } catch (err: any) {
        if (
          err.name === 'SequelizeUniqueConstraintError' &&
          err.errors?.some((e: any) => e.path === 'claim_no')
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Failed to generate unique claim number after 5 attempts');
  }

  async updateDlpClaim(user: any, uuid: string, dto: UpdateDlpClaimDto) {
    const claim = await this.getDlpClaimEntity(user, uuid);
    const ctx = extractUserContext(user);

    await claim.update({
      projectId: dto.project_id !== undefined ? dto.project_id : claim.projectId,
      projectName: dto.project_name !== undefined ? dto.project_name : claim.projectName,
      customerName: dto.customer_name !== undefined ? dto.customer_name : claim.customerName,
      unit: dto.unit !== undefined ? dto.unit : claim.unit,
      possessionDate: dto.possession_date !== undefined ? dto.possession_date : claim.possessionDate,
      dlpExpiryDate: dto.dlp_expiry_date !== undefined ? dto.dlp_expiry_date : claim.dlpExpiryDate,
      defectCategory: dto.defect_category !== undefined ? dto.defect_category : claim.defectCategory,
      severity: dto.severity !== undefined ? dto.severity : claim.severity,
      assignedEngineer: dto.assigned_engineer !== undefined ? dto.assigned_engineer : claim.assignedEngineer,
      assignedEngineerId: dto.assigned_engineer_id !== undefined ? dto.assigned_engineer_id : claim.assignedEngineerId,
      status: dto.status !== undefined ? dto.status : claim.status,
      rectificationNotes: dto.rectification_notes !== undefined ? dto.rectification_notes : claim.rectificationNotes,
      signedOffAt: dto.signed_off_at ? new Date(dto.signed_off_at) : claim.signedOffAt,
      updatedBy: ctx.userId,
    });

    return this.findDlpClaimByUuid(user, uuid);
  }

  async advanceDlpClaimStage(user: any, uuid: string) {
    const claim = await this.getDlpClaimEntity(user, uuid);
    const ctx = extractUserContext(user);

    let nextStatus: DlpClaimStatus = claim.status;
    let signedOffAt = claim.signedOffAt;

    if (claim.status === DlpClaimStatus.CLAIM_LOGGED) {
      nextStatus = DlpClaimStatus.SITE_INSPECTED;
    } else if (claim.status === DlpClaimStatus.SITE_INSPECTED) {
      nextStatus = DlpClaimStatus.RECTIFICATION_IN_PROGRESS;
    } else if (claim.status === DlpClaimStatus.RECTIFICATION_IN_PROGRESS) {
      nextStatus = DlpClaimStatus.RESOLVED_SIGNED_OFF;
      signedOffAt = new Date();
    }

    await claim.update({
      status: nextStatus,
      signedOffAt,
      updatedBy: ctx.userId,
    });

    return this.findDlpClaimByUuid(user, uuid);
  }

  async deleteDlpClaim(user: any, uuid: string) {
    const claim = await this.getDlpClaimEntity(user, uuid);
    const ctx = extractUserContext(user);
    await claim.update({ deletedBy: ctx.userId });
    await claim.destroy();
    return { success: true, message: 'DLP Claim deleted successfully' };
  }

  // =============================================================
  // 2. MAINTENANCE REQUESTS
  // =============================================================
  async getMaintenanceStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (projectId) {
      where.project_id = projectId;
    }

    const totalScheduled = await this.maintenanceModel.count({
      where: {
        ...where,
        status: MaintenanceStatus.SCHEDULED,
      },
    });

    const inProgress = await this.maintenanceModel.count({
      where: {
        ...where,
        status: MaintenanceStatus.IN_PROGRESS,
      },
    });

    const completed = await this.maintenanceModel.count({
      where: {
        ...where,
        status: MaintenanceStatus.COMPLETED,
      },
    });

    const totalCostSum = (await this.maintenanceModel.sum('costEstimate', { where })) || 0;

    const deletedCount = await this.maintenanceModel.count({
      where: { ...where, deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });

    return {
      totalScheduled,
      inProgress,
      completed,
      totalCostEstimate: totalCostSum,
      deletedRequests: deletedCount,
      deleted_count: deletedCount,
    };
  }

  async findAllMaintenance(user: any, query: QueryMaintenanceDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.maintenance_type) {
      where.maintenance_type = query.maintenance_type;
    }
    if (query.status) {
      where.status = query.status;
    }

    // Tabs filter
    if (query.tab === 'active') {
      where.status = { [Op.ne]: MaintenanceStatus.COMPLETED };
    } else if (query.tab === 'completed') {
      where.status = MaintenanceStatus.COMPLETED;
    }

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      where[Op.or] = [
        { request_no: { [Op.iLike]: term } },
        { facility: { [Op.iLike]: term } },
        { project_name: { [Op.iLike]: term } },
        { vendor_name: { [Op.iLike]: term } },
      ];
    }

    const isDeleted = Boolean((query as any).is_deleted ?? (query as any).isDeleted);
    if (isDeleted) {
      where.deletedAt = { [Op.ne]: null };
    }

    const { count, rows } = await this.maintenanceModel.findAndCountAll({
      where,
      limit,
      offset,
      paranoid: !isDeleted,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map(formatMaintenance),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  private async getMaintenanceEntity(user: any, uuid: string): Promise<CsMaintenanceRequest> {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }

    const item = await this.maintenanceModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    if (!item) {
      throw new NotFoundException(`Maintenance Request with UUID ${uuid} not found`);
    }

    return item;
  }

  async findMaintenanceByUuid(user: any, uuid: string) {
    const item = await this.getMaintenanceEntity(user, uuid);
    return formatMaintenance(item);
  }

  async createMaintenance(user: any, dto: CreateMaintenanceDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    let projectName = dto.project_name;
    if (dto.project_id && !projectName) {
      const proj = await this.projectModel.findOne({
        where: { uuid: dto.project_id } as any,
      });
      if (proj) {
        projectName = proj.name;
      }
    }

    const scheduledDate = dto.scheduled_date || new Date().toISOString().split('T')[0];

    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      const requestNo = await this.generateRequestNo(orgId);
      try {
        const item = await this.maintenanceModel.create({
          organizationId: orgId,
          projectId: dto.project_id,
          projectName: projectName || 'Assigned Project',
          requestNo,
          facility: dto.facility,
          maintenanceType: dto.maintenance_type || MaintenanceType.PREVENTIVE,
          scheduledDate,
          vendorName: dto.vendor_name || 'In-house Facility Care',
          vendorId: dto.vendor_id,
          costEstimate: dto.cost_estimate || 0,
          actualCost: dto.actual_cost,
          status: dto.status || MaintenanceStatus.SCHEDULED,
          remarks: dto.remarks,
          createdBy: ctx.userId,
        });

        return this.findMaintenanceByUuid(user, item.uuid);
      } catch (err: any) {
        if (
          err.name === 'SequelizeUniqueConstraintError' &&
          err.errors?.some((e: any) => e.path === 'request_no')
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Failed to generate unique maintenance request number after 5 attempts');
  }

  async updateMaintenance(user: any, uuid: string, dto: UpdateMaintenanceDto) {
    const item = await this.getMaintenanceEntity(user, uuid);
    const ctx = extractUserContext(user);

    await item.update({
      projectId: dto.project_id !== undefined ? dto.project_id : item.projectId,
      projectName: dto.project_name !== undefined ? dto.project_name : item.projectName,
      facility: dto.facility !== undefined ? dto.facility : item.facility,
      maintenanceType: dto.maintenance_type !== undefined ? dto.maintenance_type : item.maintenanceType,
      scheduledDate: dto.scheduled_date !== undefined ? dto.scheduled_date : item.scheduledDate,
      vendorName: dto.vendor_name !== undefined ? dto.vendor_name : item.vendorName,
      vendorId: dto.vendor_id !== undefined ? dto.vendor_id : item.vendorId,
      costEstimate: dto.cost_estimate !== undefined ? dto.cost_estimate : item.costEstimate,
      actualCost: dto.actual_cost !== undefined ? dto.actual_cost : item.actualCost,
      status: dto.status !== undefined ? dto.status : item.status,
      completionDate: dto.completion_date !== undefined ? dto.completion_date : item.completionDate,
      remarks: dto.remarks !== undefined ? dto.remarks : item.remarks,
      updatedBy: ctx.userId,
    });

    return this.findMaintenanceByUuid(user, uuid);
  }

  async completeMaintenance(user: any, uuid: string, actualCost?: number, remarks?: string) {
    const item = await this.getMaintenanceEntity(user, uuid);
    const ctx = extractUserContext(user);

    await item.update({
      status: MaintenanceStatus.COMPLETED,
      completionDate: new Date().toISOString().split('T')[0],
      actualCost: actualCost !== undefined ? actualCost : item.actualCost,
      remarks: remarks !== undefined ? remarks : item.remarks,
      updatedBy: ctx.userId,
    });

    return this.findMaintenanceByUuid(user, uuid);
  }

  async deleteMaintenance(user: any, uuid: string) {
    const item = await this.getMaintenanceEntity(user, uuid);
    const ctx = extractUserContext(user);
    await item.update({ deletedBy: ctx.userId });
    await item.destroy();
    return { success: true, message: 'Maintenance Request deleted successfully' };
  }

  // =============================================================
  // 3. FLAT OWNERS ASSOCIATIONS (OA)
  // =============================================================
  async getOwnersAssociationStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (projectId) {
      where.project_id = projectId;
    }

    const totalAssociations = await this.ownersAssociationModel.count({ where });

    const handedOverCount = await this.ownersAssociationModel.count({
      where: {
        ...where,
        handover_status: AssociationGovernanceStatus.FORMALLY_HANDED_OVER,
      },
    });

    const developerManagingCount = await this.ownersAssociationModel.count({
      where: {
        ...where,
        handover_status: AssociationGovernanceStatus.DEVELOPER_MANAGING,
      },
    });

    const adHocCount = await this.ownersAssociationModel.count({
      where: {
        ...where,
        handover_status: AssociationGovernanceStatus.AD_HOC_COMMITTEE,
      },
    });

    const avgChargeResult = (await this.ownersAssociationModel.findAll({
      where,
      attributes: [
        [
          this.sequelize.fn('AVG', this.sequelize.col('monthly_service_charge_per_flat')),
          'avg_charge',
        ],
      ],
      raw: true,
    })) as any[];

    const avgServiceCharge = Math.round(Number(avgChargeResult[0]?.avg_charge) || 0);

    const deletedCount = await this.ownersAssociationModel.count({
      where: { ...where, deletedAt: { [Op.ne]: null } },
      paranoid: false,
    });

    return {
      totalAssociations,
      handedOverCount,
      developerManagingCount,
      adHocCount,
      avgServiceCharge,
      deletedAssociations: deletedCount,
      deleted_count: deletedCount,
    };
  }

  async findAllOwnersAssociations(user: any, query: QueryOwnersAssociationDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }
    if (query.project_id) {
      where.project_id = query.project_id;
    }
    if (query.handover_status) {
      where.handover_status = query.handover_status;
    }

    // Tabs filter
    if (query.tab === 'handedover') {
      where.handover_status = AssociationGovernanceStatus.FORMALLY_HANDED_OVER;
    } else if (query.tab === 'developer') {
      where.handover_status = AssociationGovernanceStatus.DEVELOPER_MANAGING;
    }

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      where[Op.or] = [
        { association_name: { [Op.iLike]: term } },
        { project_name: { [Op.iLike]: term } },
        { president_name: { [Op.iLike]: term } },
        { association_code: { [Op.iLike]: term } },
      ];
    }

    const isDeleted = Boolean((query as any).is_deleted ?? (query as any).isDeleted);
    if (isDeleted) {
      where.deletedAt = { [Op.ne]: null };
    }

    const { count, rows } = await this.ownersAssociationModel.findAndCountAll({
      where,
      limit,
      offset,
      paranoid: !isDeleted,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map(formatOwnersAssociation),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  private async getOwnersAssociationEntity(user: any, uuid: string): Promise<CsOwnersAssociation> {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin || ctx.orgId) {
      where.organization_id = ctx.orgId;
    }

    const item = await this.ownersAssociationModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'projectDetails',
          attributes: ['uuid', 'name', 'code'],
          required: false,
        },
      ],
    });

    if (!item) {
      throw new NotFoundException(`Owners Association with UUID ${uuid} not found`);
    }

    return item;
  }

  async findOwnersAssociationByUuid(user: any, uuid: string) {
    const item = await this.getOwnersAssociationEntity(user, uuid);
    return formatOwnersAssociation(item);
  }

  async createOwnersAssociation(user: any, dto: CreateOwnersAssociationDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    let attempts = 0;
    while (attempts < 5) {
      attempts++;
      const code = dto.association_code || (await this.generateAssociationCode(orgId));
      try {
        const item = await this.ownersAssociationModel.create({
          organizationId: orgId,
          projectId: dto.project_id,
          projectName: dto.project_name,
          associationCode: code,
          associationName: dto.association_name,
          presidentName: dto.president_name,
          contactPhone: dto.contact_phone,
          totalFlats: dto.total_flats || 0,
          handedOverCount: dto.handed_over_count || 0,
          monthlyServiceChargePerFlat: dto.monthly_service_charge_per_flat || 0,
          associationBankAcc: dto.association_bank_acc,
          handoverStatus: dto.handover_status || AssociationGovernanceStatus.DEVELOPER_MANAGING,
          transitionDate: dto.transition_date,
          remarks: dto.remarks,
          createdBy: ctx.userId,
        });

        return this.findOwnersAssociationByUuid(user, item.uuid);
      } catch (err: any) {
        if (
          err.name === 'SequelizeUniqueConstraintError' &&
          err.errors?.some((e: any) => e.path === 'association_code')
        ) {
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Failed to generate unique association code after 5 attempts');
  }

  async updateOwnersAssociation(user: any, uuid: string, dto: UpdateOwnersAssociationDto) {
    const item = await this.getOwnersAssociationEntity(user, uuid);
    const ctx = extractUserContext(user);

    await item.update({
      projectId: dto.project_id !== undefined ? dto.project_id : item.projectId,
      projectName: dto.project_name !== undefined ? dto.project_name : item.projectName,
      associationName: dto.association_name !== undefined ? dto.association_name : item.associationName,
      presidentName: dto.president_name !== undefined ? dto.president_name : item.presidentName,
      contactPhone: dto.contact_phone !== undefined ? dto.contact_phone : item.contactPhone,
      totalFlats: dto.total_flats !== undefined ? dto.total_flats : item.totalFlats,
      handedOverCount: dto.handed_over_count !== undefined ? dto.handed_over_count : item.handedOverCount,
      monthlyServiceChargePerFlat:
        dto.monthly_service_charge_per_flat !== undefined
          ? dto.monthly_service_charge_per_flat
          : item.monthlyServiceChargePerFlat,
      associationBankAcc:
        dto.association_bank_acc !== undefined ? dto.association_bank_acc : item.associationBankAcc,
      handoverStatus: dto.handover_status !== undefined ? dto.handover_status : item.handoverStatus,
      transitionDate: dto.transition_date !== undefined ? dto.transition_date : item.transitionDate,
      remarks: dto.remarks !== undefined ? dto.remarks : item.remarks,
      updatedBy: ctx.userId,
    });

    return this.findOwnersAssociationByUuid(user, uuid);
  }

  async deleteOwnersAssociation(user: any, uuid: string) {
    const item = await this.getOwnersAssociationEntity(user, uuid);
    const ctx = extractUserContext(user);
    await item.update({ deletedBy: ctx.userId });
    await item.destroy();
    return { success: true, message: 'Owners Association deleted successfully' };
  }
}
