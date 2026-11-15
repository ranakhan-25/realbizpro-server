import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CsBookingHandover } from 'src/database/models/customer-service/cs_booking_handover.model';
import { CsHandoverSnag } from 'src/database/models/customer-service/cs_handover_snag.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateHandoverScheduleDto,
  UpdateHandoverScheduleDto,
  QueryHandoverScheduleDto,
  CreateSnagDto,
  UpdateSnagDto,
  QuerySnagDto,
  CreatePossessionRecordDto,
  UpdatePossessionRecordDto,
} from './dto';

// Pure mapper for Handover Schedule
export function toSnakeCaseScheduleItem(h: CsBookingHandover) {
  return {
    id: h.handoverCode || `HO-${h.id}`,
    uuid: h.uuid,
    handover_code: h.handoverCode || `HO-${h.id}`,
    customer_name: h.customerName || 'Verified Purchaser',
    unit_name: h.unitName || 'Unassigned Unit',
    project_name: h.projectName || (h.project as any)?.name || 'Assigned Project',
    project_id: h.projectId ?? null,
    booking_id: h.bookingId ?? null,
    target_handover_date: h.targetHandoverDate || null,
    readiness_percentage: Number(h.readinessPercentage) || 0,
    joint_inspection_done: Boolean(h.jointInspectionDone),
    snags_identified: Number(h.totalSnagsReported) || 0,
    snags_resolved: Number(h.totalSnagsResolved) || 0,
    key_register_no: h.keyRegisterNo ?? null,
    possession_cert_no: h.possessionCertNo ?? null,
    possession_cert_issued: Boolean(h.possessionCertIssued),
    handover_status: h.handoverStatus || 'Scheduled',
    possession_date: h.possessionDate ?? null,
    dlp_expiry_date: h.dlpExpiryDate ?? null,
    remarks: h.remarks ?? null,
    created_at: h.createdAt,
    updated_at: h.updatedAt,
  };
}

// Pure mapper for Inspection Snags
export function toSnakeCaseSnagItem(s: CsHandoverSnag) {
  return {
    id: s.snagCode || `SNG-${s.id}`,
    uuid: s.uuid,
    snag_code: s.snagCode || `SNG-${s.id}`,
    unit_name: s.unitName,
    customer_name: s.customerName,
    defect_location: s.defectLocation,
    description: s.description,
    severity: s.severity || 'Minor',
    assigned_contractor: s.assignedContractor || 'In-house Finishing Crew',
    target_rectification_date: s.targetRectificationDate ?? null,
    status: s.status || 'Reported',
    rectified_date: s.rectifiedDate ?? null,
    project_id: s.projectId ?? null,
    handover_id: s.handoverId ?? null,
    booking_id: s.bookingId ?? null,
    remarks: s.remarks ?? null,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  };
}

// Pure mapper for Possession Records
export function toSnakeCasePossessionItem(p: CsBookingHandover) {
  return {
    id: p.handoverCode || `POS-${p.id}`,
    uuid: p.uuid,
    cert_no: p.possessionCertNo || `POS-CERT-${p.id}`,
    customer_name: p.customerName || 'Verified Purchaser',
    unit_name: p.unitName || 'Unassigned Unit',
    project_name: p.projectName || (p.project as any)?.name || 'Assigned Project',
    project_id: p.projectId ?? null,
    possession_date: p.possessionDate || String(p.createdAt).slice(0, 10),
    dlp_start_date: p.dlpStartDate || p.possessionDate || String(p.createdAt).slice(0, 10),
    dlp_expiry_date: p.dlpExpiryDate || null,
    key_register_no: p.keyRegisterNo || `KEY-${p.id}`,
    keys_delivered_count: Number(p.keysDeliveredCount) || 8,
    electric_meter_reading: p.electricMeterReading || 'Meter Reading Verified',
    gas_meter_reading: p.gasMeterReading || 'Central Gas Line Active',
    water_meter_reading: p.waterMeterReading || 'Water Connection Tested',
    signed_by_customer: Boolean(p.signedByCustomer),
    remarks: p.remarks ?? null,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

@Injectable()
export class CustomerServiceHandoverService {
  private readonly logger = new Logger(CustomerServiceHandoverService.name);

  constructor(
    @InjectModel(CsBookingHandover)
    private readonly handoverModel: typeof CsBookingHandover,
    @InjectModel(CsHandoverSnag)
    private readonly snagModel: typeof CsHandoverSnag,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // ---------------------------------------------------------------------------
  // Collision-Safe Unique Generators
  // ---------------------------------------------------------------------------

  private async generateHandoverCode(): Promise<string> {
    const [result]: any = await this.handoverModel.sequelize!.query(
      'SELECT COALESCE(MAX(id), 0) AS max_id FROM cs_booking_handovers'
    );
    let nextNum = 300 + Number(result?.[0]?.max_id || 0) + 1;
    while (true) {
      const candidate = `HO-${nextNum}`;
      const exists = await this.handoverModel.findOne({
        where: { handoverCode: candidate },
        paranoid: false,
      });
      if (!exists) return candidate;
      nextNum++;
    }
  }

  private async generateSnagCode(): Promise<string> {
    const [result]: any = await this.snagModel.sequelize!.query(
      'SELECT COALESCE(MAX(id), 0) AS max_id FROM cs_handover_snags'
    );
    let nextNum = 100 + Number(result?.[0]?.max_id || 0) + 1;
    while (true) {
      const candidate = `SNG-${nextNum}`;
      const exists = await this.snagModel.findOne({
        where: { snagCode: candidate },
        paranoid: false,
      });
      if (!exists) return candidate;
      nextNum++;
    }
  }

  private async generateCertNo(): Promise<string> {
    const year = new Date().getFullYear();
    const [result]: any = await this.handoverModel.sequelize!.query(
      'SELECT COALESCE(MAX(id), 0) AS max_id FROM cs_booking_handovers'
    );
    let nextNum = 400 + Number(result?.[0]?.max_id || 0) + 1;
    while (true) {
      const candidate = `POS-CERT-${year}-${String(nextNum).padStart(5, '0')}`;
      const exists = await this.handoverModel.findOne({
        where: { possessionCertNo: candidate },
        paranoid: false,
      });
      if (!exists) return candidate;
      nextNum++;
    }
  }

  private async generateKeyRegisterNo(): Promise<string> {
    const year = new Date().getFullYear();
    const [result]: any = await this.handoverModel.sequelize!.query(
      'SELECT COALESCE(MAX(id), 0) AS max_id FROM cs_booking_handovers'
    );
    let nextNum = 400 + Number(result?.[0]?.max_id || 0) + 1;
    while (true) {
      const candidate = `KEY-${year}-${String(nextNum).padStart(5, '0')}`;
      const exists = await this.handoverModel.findOne({
        where: { keyRegisterNo: candidate },
        paranoid: false,
      });
      if (!exists) return candidate;
      nextNum++;
    }
  }

  // =========================================================================
  // 1. HANDOVER SCHEDULE & READINESS
  // =========================================================================

  async getScheduleStats(user: any, projectId?: string) {
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

    const all = await this.handoverModel.findAll({
      where,
      attributes: ['handoverStatus'],
    });

    let scheduled = 0;
    let ready = 0;
    let snags = 0;
    let completed = 0;

    for (const h of all) {
      const st = (h.handoverStatus || '').toLowerCase();
      if (st.includes('ready')) ready++;
      else if (st.includes('snag')) snags++;
      else if (st.includes('possession') || st.includes('handed') || st.includes('dlp')) completed++;
      else scheduled++;
    }

    return {
      scheduled_count: scheduled,
      ready_count: ready,
      snags_count: snags,
      completed_count: completed,
      all_count: all.length,
    };
  }

  async getScheduleList(user: any, query: QueryHandoverScheduleDto) {
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

    if (query.status) {
      where.handoverStatus = query.status;
    }

    if (query.tab === 'ready') {
      where.handoverStatus = 'Ready for Key Delivery';
    } else if (query.tab === 'snags') {
      where.handoverStatus = 'Snag Rectification';
    } else if (query.tab === 'completed') {
      where[Op.or] = [
        { handoverStatus: 'Possession Taken' },
        { handoverStatus: 'Handed Over' },
        { handoverStatus: 'DLP Active' },
      ];
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        { handoverCode: { [Op.iLike]: `%${search}%` } },
        { customerName: { [Op.iLike]: `%${search}%` } },
        { unitName: { [Op.iLike]: `%${search}%` } },
        { projectName: { [Op.iLike]: `%${search}%` } },
        { possessionCertNo: { [Op.iLike]: `%${search}%` } },
        { keyRegisterNo: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.handoverModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map((r) => toSnakeCaseScheduleItem(r)),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createSchedule(user: any, dto: CreateHandoverScheduleDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;
    const handoverCode = await this.generateHandoverCode();

    let resolvedProjectName = dto.project_name?.trim();
    if (!resolvedProjectName && dto.project_id) {
      const p = await this.projectModel.findOne({ where: { uuid: dto.project_id } as any });
      if (p) resolvedProjectName = p.name;
    }

    const record = await this.handoverModel.create({
      organizationId: orgId,
      projectId: dto.project_id || undefined,
      bookingId: dto.booking_id || undefined,
      customerProfileId: dto.customer_profile_id || undefined,
      handoverCode,
      customerName: dto.customer_name.trim(),
      unitName: dto.unit_name.trim(),
      projectName: resolvedProjectName || 'Assigned Project',
      targetHandoverDate: dto.target_handover_date || null,
      readinessPercentage: Number(dto.readiness_percentage) || 0,
      jointInspectionDone: Boolean(dto.joint_inspection_done),
      possessionCertIssued: Boolean(dto.possession_cert_issued),
      handoverStatus: (dto.handover_status as any) || 'Scheduled',
      keyRegisterNo: dto.key_register_no?.trim() || null,
      remarks: dto.remarks || null,
      createdBy: ctx.userId,
    } as any);

    return toSnakeCaseScheduleItem(record);
  }

  async findScheduleByUuid(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.handoverModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
      ],
    });
    if (!record) {
      throw new NotFoundException(`Handover schedule with UUID ${uuid} not found`);
    }
    return toSnakeCaseScheduleItem(record);
  }

  async updateSchedule(user: any, uuid: string, dto: UpdateHandoverScheduleDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.handoverModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Handover schedule with UUID ${uuid} not found`);
    }

    const updateData: any = { updatedBy: ctx.userId };
    if (dto.customer_name !== undefined) updateData.customerName = dto.customer_name.trim();
    if (dto.unit_name !== undefined) updateData.unitName = dto.unit_name.trim();
    if (dto.project_name !== undefined) updateData.projectName = dto.project_name.trim();
    if (dto.project_id !== undefined) updateData.projectId = dto.project_id;
    if (dto.booking_id !== undefined) updateData.bookingId = dto.booking_id;
    if (dto.customer_profile_id !== undefined) updateData.customerProfileId = dto.customer_profile_id;
    if (dto.target_handover_date !== undefined) updateData.targetHandoverDate = dto.target_handover_date;
    if (dto.readiness_percentage !== undefined) updateData.readinessPercentage = Number(dto.readiness_percentage);
    if (dto.joint_inspection_done !== undefined) updateData.jointInspectionDone = Boolean(dto.joint_inspection_done);
    if (dto.possession_cert_issued !== undefined) updateData.possessionCertIssued = Boolean(dto.possession_cert_issued);
    if (dto.handover_status !== undefined) updateData.handoverStatus = dto.handover_status;
    if (dto.key_register_no !== undefined) updateData.keyRegisterNo = dto.key_register_no?.trim() || null;
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks;

    await record.update(updateData);
    return toSnakeCaseScheduleItem(record);
  }

  async deleteSchedule(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.handoverModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Handover schedule with UUID ${uuid} not found`);
    }

    await record.update({ deletedBy: ctx.userId });
    await record.destroy();
    return { success: true, message: `Handover schedule ${record.handoverCode} deleted successfully` };
  }

  // =========================================================================
  // 2. JOINT INSPECTIONS & SNAGS
  // =========================================================================

  async getSnagStats(user: any, projectId?: string) {
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

    const all = await this.snagModel.findAll({
      where,
      attributes: ['status', 'severity'],
    });

    let pending = 0;
    let resolved = 0;
    let critical = 0;

    for (const s of all) {
      if (s.status === 'Client Signed Off') {
        resolved++;
      } else {
        pending++;
      }
      if (s.severity === 'Critical') {
        critical++;
      }
    }

    return {
      active_snags: all.length,
      pending_contractor: pending,
      quality_signed_off: resolved,
      critical_count: critical,
      all_count: all.length,
    };
  }

  async getSnagList(user: any, query: QuerySnagDto) {
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

    if (query.status) {
      where.status = query.status;
    }

    if (query.severity) {
      where.severity = query.severity;
    }

    if (query.tab === 'pending') {
      where.status = { [Op.ne]: 'Client Signed Off' };
    } else if (query.tab === 'resolved') {
      where.status = 'Client Signed Off';
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        { snagCode: { [Op.iLike]: `%${search}%` } },
        { unitName: { [Op.iLike]: `%${search}%` } },
        { customerName: { [Op.iLike]: `%${search}%` } },
        { defectLocation: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { assignedContractor: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.snagModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      items: rows.map((r) => toSnakeCaseSnagItem(r)),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createSnag(user: any, dto: CreateSnagDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;
    const snagCode = await this.generateSnagCode();

    const record = await this.snagModel.create({
      organizationId: orgId,
      projectId: dto.project_id || undefined,
      handoverId: dto.handover_id || undefined,
      bookingId: dto.booking_id || undefined,
      snagCode,
      unitName: dto.unit_name.trim(),
      customerName: dto.customer_name.trim(),
      defectLocation: dto.defect_location.trim(),
      description: dto.description.trim(),
      severity: (dto.severity as any) || 'Minor',
      assignedContractor: dto.assigned_contractor?.trim() || 'Finishing Team',
      targetRectificationDate: dto.target_rectification_date || null,
      status: (dto.status as any) || 'Reported',
      remarks: dto.remarks || null,
      createdBy: ctx.userId,
    } as any);

    // If linked to a handover, update reported count
    if (dto.handover_id) {
      await this.handoverModel.increment('totalSnagsReported', {
        by: 1,
        where: { id: dto.handover_id },
      });
    }

    return toSnakeCaseSnagItem(record);
  }

  async advanceSnag(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.snagModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Snag item with UUID ${uuid} not found`);
    }

    let nextStatus: any = record.status;
    let rectifiedDate = record.rectifiedDate;

    if (record.status === 'Reported') {
      nextStatus = 'In Rectification';
    } else if (record.status === 'In Rectification') {
      nextStatus = 'Verified by Site Engr';
    } else if (record.status === 'Verified by Site Engr') {
      nextStatus = 'Client Signed Off';
      rectifiedDate = new Date().toISOString().slice(0, 10);
    }

    await record.update({
      status: nextStatus,
      rectifiedDate,
      updatedBy: ctx.userId,
    });

    // If client signed off and linked to a handover, increment resolved count
    if (nextStatus === 'Client Signed Off' && record.handoverId) {
      await this.handoverModel.increment('totalSnagsResolved', {
        by: 1,
        where: { id: record.handoverId },
      });
    }

    return toSnakeCaseSnagItem(record);
  }

  async updateSnag(user: any, uuid: string, dto: UpdateSnagDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.snagModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Snag item with UUID ${uuid} not found`);
    }

    const updateData: any = { updatedBy: ctx.userId };
    if (dto.unit_name !== undefined) updateData.unitName = dto.unit_name.trim();
    if (dto.customer_name !== undefined) updateData.customerName = dto.customer_name.trim();
    if (dto.defect_location !== undefined) updateData.defectLocation = dto.defect_location.trim();
    if (dto.description !== undefined) updateData.description = dto.description.trim();
    if (dto.severity !== undefined) updateData.severity = dto.severity;
    if (dto.assigned_contractor !== undefined) updateData.assignedContractor = dto.assigned_contractor?.trim();
    if (dto.target_rectification_date !== undefined) updateData.targetRectificationDate = dto.target_rectification_date;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks;

    await record.update(updateData);
    return toSnakeCaseSnagItem(record);
  }

  async deleteSnag(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.snagModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Snag item with UUID ${uuid} not found`);
    }

    await record.update({ deletedBy: ctx.userId });
    await record.destroy();
    return { success: true, message: `Snag ${record.snagCode} deleted successfully` };
  }

  // =========================================================================
  // 3. POSSESSION CERTIFICATES & KEY HANDOVER
  // =========================================================================

  async getPossessionStats(user: any, projectId?: string) {
    const ctx = extractUserContext(user);
    const where: any = {
      [Op.or]: [
        { possessionCertIssued: true },
        { possessionDate: { [Op.ne]: null } },
        { possessionCertNo: { [Op.ne]: null } },
      ],
    };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    const records = await this.handoverModel.findAll({
      where,
      attributes: ['dlpExpiryDate', 'signedByCustomer'],
    });

    const now = new Date().toISOString().slice(0, 10);
    let activeDlp = 0;
    let keysSigned = 0;

    for (const r of records) {
      if (r.dlpExpiryDate && r.dlpExpiryDate >= now) {
        activeDlp++;
      }
      if (r.signedByCustomer) {
        keysSigned++;
      }
    }

    return {
      certs_issued: records.length,
      active_dlp: activeDlp,
      keys_signed: keysSigned,
      all_count: records.length,
    };
  }

  async getPossessionList(user: any, query: QueryHandoverScheduleDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const offset = (page - 1) * limit;

    const where: any = {
      [Op.or]: [
        { possessionCertIssued: true },
        { possessionDate: { [Op.ne]: null } },
        { possessionCertNo: { [Op.ne]: null } },
      ],
    };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    if (query.project_id && query.project_id !== 'all') {
      where.projectId = query.project_id;
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.and] = [
        {
          [Op.or]: [
            { possessionCertNo: { [Op.iLike]: `%${search}%` } },
            { customerName: { [Op.iLike]: `%${search}%` } },
            { unitName: { [Op.iLike]: `%${search}%` } },
            { projectName: { [Op.iLike]: `%${search}%` } },
            { keyRegisterNo: { [Op.iLike]: `%${search}%` } },
          ],
        },
      ];
    }

    const { rows, count } = await this.handoverModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name'],
          required: false,
        },
      ],
    });

    return {
      items: rows.map((r) => toSnakeCasePossessionItem(r)),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createPossessionRecord(user: any, dto: CreatePossessionRecordDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    const certNo = dto.possession_cert_no?.trim() || (await this.generateCertNo());
    const keyRegNo = dto.key_register_no?.trim() || (await this.generateKeyRegisterNo());
    const handoverCode = await this.generateHandoverCode();

    const possessionDate = dto.possession_date || new Date().toISOString().slice(0, 10);
    // 2-Year DLP calculation default
    let dlpExpiry = dto.dlp_expiry_date;
    if (!dlpExpiry) {
      const pDate = new Date(possessionDate);
      pDate.setFullYear(pDate.getFullYear() + 2);
      dlpExpiry = pDate.toISOString().slice(0, 10);
    }

    let resolvedProjectName = dto.project_name?.trim();
    if (!resolvedProjectName && dto.project_id) {
      const p = await this.projectModel.findOne({ where: { uuid: dto.project_id } as any });
      if (p) resolvedProjectName = p.name;
    }

    const record = await this.handoverModel.create({
      organizationId: orgId,
      projectId: dto.project_id || undefined,
      bookingId: dto.booking_id || undefined,
      handoverCode,
      customerName: dto.customer_name.trim(),
      unitName: dto.unit_name.trim(),
      projectName: resolvedProjectName || 'Assigned Project',
      possessionCertNo: certNo,
      possessionDate,
      dlpStartDate: possessionDate,
      dlpExpiryDate: dlpExpiry,
      keyRegisterNo: keyRegNo,
      keysDeliveredCount: Number(dto.keys_delivered_count) || 8,
      electricMeterReading: dto.electric_meter_reading?.trim() || 'Prepaid Meter Active',
      gasMeterReading: dto.gas_meter_reading?.trim() || 'Central LPG System Active',
      waterMeterReading: dto.water_meter_reading?.trim() || '00,050 m³',
      signedByCustomer: dto.signed_by_customer !== undefined ? Boolean(dto.signed_by_customer) : true,
      possessionCertIssued: true,
      handoverStatus: 'Possession Taken',
      remarks: dto.remarks || null,
      createdBy: ctx.userId,
    } as any);

    return toSnakeCasePossessionItem(record);
  }

  async updatePossessionRecord(user: any, uuid: string, dto: UpdatePossessionRecordDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const record = await this.handoverModel.findOne({ where });
    if (!record) {
      throw new NotFoundException(`Possession record with UUID ${uuid} not found`);
    }

    const updateData: any = { updatedBy: ctx.userId };
    if (dto.customer_name !== undefined) updateData.customerName = dto.customer_name.trim();
    if (dto.unit_name !== undefined) updateData.unitName = dto.unit_name.trim();
    if (dto.project_name !== undefined) updateData.projectName = dto.project_name.trim();
    if (dto.project_id !== undefined) updateData.projectId = dto.project_id;
    if (dto.possession_cert_no !== undefined) updateData.possessionCertNo = dto.possession_cert_no.trim();
    if (dto.possession_date !== undefined) updateData.possessionDate = dto.possession_date;
    if (dto.dlp_expiry_date !== undefined) updateData.dlpExpiryDate = dto.dlp_expiry_date;
    if (dto.key_register_no !== undefined) updateData.keyRegisterNo = dto.key_register_no.trim();
    if (dto.keys_delivered_count !== undefined) updateData.keysDeliveredCount = Number(dto.keys_delivered_count);
    if (dto.electric_meter_reading !== undefined) updateData.electricMeterReading = dto.electric_meter_reading;
    if (dto.gas_meter_reading !== undefined) updateData.gasMeterReading = dto.gas_meter_reading;
    if (dto.water_meter_reading !== undefined) updateData.waterMeterReading = dto.water_meter_reading;
    if (dto.signed_by_customer !== undefined) updateData.signedByCustomer = Boolean(dto.signed_by_customer);
    if (dto.remarks !== undefined) updateData.remarks = dto.remarks;

    await record.update(updateData);
    return toSnakeCasePossessionItem(record);
  }
}
