import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CsCustomerDocument } from 'src/database/models/customer-service/cs_customer_document.model';
import { CsRegistrationTracking } from 'src/database/models/customer-service/cs_registration_tracking.model';
import { CsMutationTracking } from 'src/database/models/customer-service/cs_mutation_tracking.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateCustomerDocumentDto,
  UpdateCustomerDocumentDto,
  QueryCustomerDocumentDto,
  CreateRegistrationTrackingDto,
  UpdateRegistrationTrackingDto,
  QueryRegistrationTrackingDto,
  CreateMutationTrackingDto,
  UpdateMutationTrackingDto,
  QueryMutationTrackingDto,
} from './dto';

function isExactConstraintCollision(
  err: any,
  expectedConstraintName: string,
): boolean {
  if (
    err?.name !== 'SequelizeUniqueConstraintError'
  )
    return false;
  const pgCode =
    err?.original?.code || err?.parent?.code;
  if (pgCode !== '23505') return false;
  const actualConstraint =
    err?.original?.constraint ||
    err?.parent?.constraint;
  return (
    actualConstraint === expectedConstraintName
  );
}

// Pure mapper functions for documents
export function toSnakeCaseDocumentItem(
  doc: CsCustomerDocument,
) {
  return {
    id: doc.docCode || `DOC-${doc.id}`,
    uuid: doc.uuid,
    doc_code: doc.docCode || `DOC-${doc.id}`,
    doc_title: doc.docTitle,
    doc_category: doc.docCategory,
    customer_name: doc.customerName,
    unit_name: doc.unitName ?? null,
    project_id: doc.projectId ?? null,
    booking_id: doc.bookingId ?? null,
    customer_profile_id:
      doc.customerProfileId ?? null,
    file_name:
      doc.fileName ||
      `${(doc.docTitle || 'document').toLowerCase().replace(/\s+/g, '_')}.pdf`,
    file_size: doc.fileSize || '2.4 MB',
    file_url: doc.fileUrl ?? null,
    file_key: doc.fileKey ?? null,
    upload_date:
      doc.uploadDate ||
      String(doc.createdAt).slice(0, 10),
    verification_status: doc.verificationStatus,
    verified_by: doc.verifiedBy ?? null,
    verified_at: doc.verifiedAt ?? null,
    notes: doc.notes ?? null,
    created_by: doc.createdBy ?? null,
    updated_by: doc.updatedBy ?? null,
    deleted_by: doc.deletedBy ?? null,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    deleted_at: doc.deletedAt ?? null,
  };
}

// Pure mapper functions for registration tracking
export function toSnakeCaseRegistrationItem(
  reg: CsRegistrationTracking,
) {
  return {
    id: reg.regCode || `REG-${reg.id}`,
    uuid: reg.uuid,
    reg_code: reg.regCode || `REG-${reg.id}`,
    customer_name: reg.customerName,
    unit_name: reg.unitName ?? null,
    project_name: reg.projectName ?? null,
    project_id: reg.projectId ?? null,
    booking_id: reg.bookingId ?? null,
    customer_profile_id:
      reg.customerProfileId ?? null,
    sub_registrar_office: reg.subRegistrarOffice,
    deed_draft_status: reg.deedDraftStatus,
    registration_date_scheduled:
      reg.registrationDateScheduled ?? null,
    total_govt_fees:
      Number(reg.totalGovtFees) || 0,
    fee_receipt_collected: Boolean(
      reg.feeReceiptCollected,
    ),
    registered_deed_no:
      reg.registeredDeedNo || 'Pending Registry',
    status: reg.status,
    delivered_date: reg.deliveredDate ?? null,
    remarks: reg.remarks ?? null,
    created_by: reg.createdBy ?? null,
    updated_by: reg.updatedBy ?? null,
    deleted_by: reg.deletedBy ?? null,
    created_at: reg.createdAt,
    updated_at: reg.updatedAt,
    deleted_at: reg.deletedAt ?? null,
  };
}

// Pure mapper functions for mutation tracking
export function toSnakeCaseMutationItem(
  mut: CsMutationTracking,
) {
  return {
    id: mut.mutCode || `MUT-${mut.id}`,
    uuid: mut.uuid,
    mut_code: mut.mutCode || `MUT-${mut.id}`,
    customer_name: mut.customerName,
    unit_name: mut.unitName ?? null,
    project_name: mut.projectName ?? null,
    project_id: mut.projectId ?? null,
    booking_id: mut.bookingId ?? null,
    customer_profile_id:
      mut.customerProfileId ?? null,
    mutation_app_no: mut.mutationAppNo,
    ac_land_office: mut.acLandOffice,
    current_stage: mut.currentStage,
    hearing_date: mut.hearingDate ?? null,
    dcr_number: mut.dcrNumber ?? null,
    dcr_fee_amount:
      Number(mut.dcrFeeAmount) || 1170.0,
    dcr_paid: Boolean(mut.dcrPaid),
    khatian_number: mut.khatianNumber ?? null,
    remarks: mut.remarks ?? null,
    created_by: mut.createdBy ?? null,
    updated_by: mut.updatedBy ?? null,
    deleted_by: mut.deletedBy ?? null,
    created_at: mut.createdAt,
    updated_at: mut.updatedAt,
    deleted_at: mut.deletedAt ?? null,
  };
}

@Injectable()
export class CustomerServiceDocumentsService {
  private readonly logger = new Logger(
    CustomerServiceDocumentsService.name,
  );

  constructor(
    @InjectModel(CsCustomerDocument)
    private readonly docModel: typeof CsCustomerDocument,
    @InjectModel(CsRegistrationTracking)
    private readonly regModel: typeof CsRegistrationTracking,
    @InjectModel(CsMutationTracking)
    private readonly mutModel: typeof CsMutationTracking,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  private async generateDocCode(): Promise<string> {
    try {
      const [result]: any =
        await this.docModel.sequelize.query(
          `SELECT nextval('public.cs_customer_documents_code_seq') AS num`,
        );
      const num = result?.[0]?.num;
      if (!num) {
        throw new Error(
          'Sequence returned empty or invalid value',
        );
      }
      return `DOC-${num}`;
    } catch (err: any) {
      this.logger.error(
        `Failed to allocate document code from sequence: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        'Failed to allocate document reference code',
      );
    }
  }

  private async generateRegCode(): Promise<string> {
    try {
      const [result]: any =
        await this.regModel.sequelize.query(
          `SELECT nextval('public.cs_registration_trackings_code_seq') AS num`,
        );
      const num = result?.[0]?.num;
      if (!num) {
        throw new Error(
          'Sequence returned empty or invalid value',
        );
      }
      return `REG-${num}`;
    } catch (err: any) {
      this.logger.error(
        `Failed to allocate registration code from sequence: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        'Failed to allocate registration reference code',
      );
    }
  }

  private async generateMutCode(): Promise<string> {
    try {
      const [result]: any =
        await this.mutModel.sequelize.query(
          `SELECT nextval('public.cs_mutation_trackings_code_seq') AS num`,
        );
      const num = result?.[0]?.num;
      if (!num) {
        throw new Error(
          'Sequence returned empty or invalid value',
        );
      }
      return `MUT-${num}`;
    } catch (err: any) {
      this.logger.error(
        `Failed to allocate mutation code from sequence: ${err.message}`,
        err.stack,
      );
      throw new InternalServerErrorException(
        'Failed to allocate mutation reference code',
      );
    }
  }

  // =========================================================================
  // 1. DIGITAL VAULT & DOCUMENT CENTRE
  // =========================================================================

  async getDocumentStats(
    user: any,
    projectId?: string,
  ) {
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
      totalArchived,
      pendingVetting,
      signedExecuted,
      verified,
    ] = await Promise.all([
      this.docModel.count({ where }),
      this.docModel.count({
        where: {
          ...where,
          verificationStatus: 'Pending Vetting',
        },
      }),
      this.docModel.count({
        where: {
          ...where,
          verificationStatus: 'Signed & Executed',
        },
      }),
      this.docModel.count({
        where: {
          ...where,
          verificationStatus: 'Verified',
        },
      }),
    ]);

    return {
      total_archived: totalArchived,
      pending_vetting: pendingVetting,
      signed_executed: signedExecuted,
      verified,
      all_count: totalArchived,
      pending_count: pendingVetting,
      executed_count: signedExecuted,
    };
  }

  async findAllDocuments(
    user: any,
    query: QueryCustomerDocumentDto,
  ) {
    const ctx = extractUserContext(user);
    const page = Math.max(
      1,
      Number(query.page) || 1,
    );
    const limit = Math.max(
      1,
      Math.min(100, Number(query.limit) || 10),
    );
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (
      query.project_id &&
      query.project_id !== 'all'
    ) {
      where.projectId = query.project_id;
    }
    if (query.category) {
      where.docCategory = query.category;
    }
    if (query.status) {
      where.verificationStatus = query.status;
    }
    if (query.tab === 'executed') {
      where.verificationStatus =
        'Signed & Executed';
    } else if (query.tab === 'pending') {
      where.verificationStatus =
        'Pending Vetting';
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        {
          docTitle: { [Op.iLike]: `%${search}%` },
        },
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          unitName: { [Op.iLike]: `%${search}%` },
        },
        {
          docCode: { [Op.iLike]: `%${search}%` },
        },
        {
          fileName: { [Op.iLike]: `%${search}%` },
        },
      ];
    }

    const { rows, count } =
      await this.docModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
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
      items: rows.map((r) =>
        toSnakeCaseDocumentItem(r),
      ),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createDocument(
    user: any,
    dto: CreateCustomerDocumentDto,
  ) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    const MAX_RETRIES = 3;
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const docCode =
          await this.generateDocCode();
        const record = await this.docModel.create(
          {
            organizationId: orgId,
            projectId:
              dto.project_id || undefined,
            bookingId:
              dto.booking_id || undefined,
            customerProfileId:
              dto.customer_profile_id ||
              undefined,
            docCode,
            docTitle: dto.doc_title.trim(),
            docCategory:
              (dto.doc_category as any) ||
              'Sale Agreement (Baina)',
            customerName:
              dto.customer_name.trim(),
            unitName:
              dto.unit_name?.trim() || null,
            fileName:
              dto.file_name?.trim() ||
              `${dto.doc_title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            fileSize:
              dto.file_size?.trim() || '2.4 MB',
            fileUrl: dto.file_url || null,
            fileKey: dto.file_key || null,
            uploadDate:
              dto.upload_date ||
              new Date()
                .toISOString()
                .slice(0, 10),
            verificationStatus:
              (dto.verification_status as any) ||
              'Pending Vetting',
            notes: dto.notes || null,
            createdBy: ctx.userId,
          },
        );

        return toSnakeCaseDocumentItem(record);
      } catch (err: any) {
        if (
          isExactConstraintCollision(
            err,
            'cs_customer_documents_doc_code_key',
          ) &&
          attempts < MAX_RETRIES - 1
        ) {
          attempts++;
          const jitterMs =
            Math.floor(Math.random() * 20 + 10) *
            attempts;
          this.logger.warn(
            `Sequence collision on cs_customer_documents_doc_code_key. Retrying (attempt ${attempts}/${MAX_RETRIES}) after ${jitterMs}ms...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, jitterMs),
          );
          continue;
        }
        if (
          err instanceof BadRequestException ||
          err instanceof
            InternalServerErrorException
        ) {
          throw err;
        }
        this.logger.error(
          `Document creation failed: ${err.message}`,
          err.stack,
        );
        if (
          err.name ===
          'SequelizeUniqueConstraintError'
        ) {
          throw new BadRequestException(
            'A unique constraint violation occurred on customer document attributes',
          );
        }
        throw new InternalServerErrorException(
          'Failed to process document registration',
        );
      }
    }
    throw new InternalServerErrorException(
      'Failed to allocate unique document code after multiple attempts',
    );
  }

  async findDocumentByUuid(
    user: any,
    uuid: string,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const doc = await this.docModel.findOne({
      where,
    });
    if (!doc) {
      throw new NotFoundException(
        `Document with UUID ${uuid} not found`,
      );
    }
    return toSnakeCaseDocumentItem(doc);
  }

  async updateDocument(
    user: any,
    uuid: string,
    dto: UpdateCustomerDocumentDto,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const doc = await this.docModel.findOne({
      where,
    });
    if (!doc) {
      throw new NotFoundException(
        `Document with UUID ${uuid} not found`,
      );
    }

    if (dto.doc_title)
      doc.docTitle = dto.doc_title.trim();
    if (dto.doc_category)
      doc.docCategory = dto.doc_category as any;
    if (dto.customer_name)
      doc.customerName = dto.customer_name.trim();
    if (dto.unit_name !== undefined)
      doc.unitName = dto.unit_name
        ? dto.unit_name.trim()
        : null;
    if (dto.file_name)
      doc.fileName = dto.file_name.trim();
    if (dto.file_size)
      doc.fileSize = dto.file_size.trim();
    if (dto.file_url !== undefined)
      doc.fileUrl = dto.file_url;
    if (dto.file_key !== undefined)
      doc.fileKey = dto.file_key;
    if (dto.verification_status) {
      doc.verificationStatus =
        dto.verification_status as any;
      if (
        dto.verification_status === 'Verified'
      ) {
        doc.verifiedBy = ctx.userId;
        doc.verifiedAt = new Date();
      }
    }
    if (dto.notes !== undefined)
      doc.notes = dto.notes;
    doc.updatedBy = ctx.userId;

    await doc.save();
    return toSnakeCaseDocumentItem(doc);
  }

  async removeDocument(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const doc = await this.docModel.findOne({
      where,
    });
    if (!doc) {
      throw new NotFoundException(
        `Document with UUID ${uuid} not found`,
      );
    }

    doc.deletedBy = ctx.userId;
    await doc.save();
    await doc.destroy();

    return {
      success: true,
      message: `Document ${doc.docCode} (${doc.docTitle}) deleted successfully`,
    };
  }

  // =========================================================================
  // 2. REGISTRATION TRACKING
  // =========================================================================

  async getRegistrationStats(
    user: any,
    projectId?: string,
  ) {
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
      totalPipeline,
      appointmentsScheduled,
      deedsDelivered,
    ] = await Promise.all([
      this.regModel.count({ where }),
      this.regModel.count({
        where: {
          ...where,
          status: 'Appointment Booked',
        },
      }),
      this.regModel.count({
        where: {
          ...where,
          status: 'Original Deed Delivered',
        },
      }),
    ]);

    return {
      active_pipeline: totalPipeline,
      appointments_scheduled:
        appointmentsScheduled,
      deeds_delivered: deedsDelivered,
      all_count: totalPipeline,
      pending_count:
        totalPipeline - deedsDelivered,
      delivered_count: deedsDelivered,
    };
  }

  async findAllRegistrations(
    user: any,
    query: QueryRegistrationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const page = Math.max(
      1,
      Number(query.page) || 1,
    );
    const limit = Math.max(
      1,
      Math.min(100, Number(query.limit) || 10),
    );
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (
      query.project_id &&
      query.project_id !== 'all'
    ) {
      where.projectId = query.project_id;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.tab === 'pending') {
      where.status = {
        [Op.ne]: 'Original Deed Delivered',
      };
    } else if (query.tab === 'delivered') {
      where.status = 'Original Deed Delivered';
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          unitName: { [Op.iLike]: `%${search}%` },
        },
        {
          projectName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          subRegistrarOffice: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          regCode: { [Op.iLike]: `%${search}%` },
        },
        {
          registeredDeedNo: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.regModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
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
      items: rows.map((r) =>
        toSnakeCaseRegistrationItem(r),
      ),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createRegistration(
    user: any,
    dto: CreateRegistrationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    const MAX_RETRIES = 3;
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const regCode =
          await this.generateRegCode();
        const record = await this.regModel.create(
          {
            organizationId: orgId,
            projectId:
              dto.project_id || undefined,
            bookingId:
              dto.booking_id || undefined,
            customerProfileId:
              dto.customer_profile_id ||
              undefined,
            regCode,
            customerName:
              dto.customer_name.trim(),
            unitName:
              dto.unit_name?.trim() || null,
            projectName:
              dto.project_name?.trim() ||
              'Assigned Project',
            subRegistrarOffice:
              dto.sub_registrar_office.trim(),
            deedDraftStatus:
              (dto.deed_draft_status as any) ||
              'Draft Ready',
            registrationDateScheduled:
              dto.registration_date_scheduled ||
              null,
            totalGovtFees:
              Number(dto.total_govt_fees) || 0,
            feeReceiptCollected: Boolean(
              dto.fee_receipt_collected,
            ),
            registeredDeedNo:
              dto.registered_deed_no?.trim() ||
              'Pending Registry',
            status:
              (dto.status as any) ||
              'Documents Gathering',
            deliveredDate:
              dto.delivered_date || null,
            remarks: dto.remarks || null,
            createdBy: ctx.userId,
          },
        );

        return toSnakeCaseRegistrationItem(
          record,
        );
      } catch (err: any) {
        if (
          isExactConstraintCollision(
            err,
            'cs_registration_trackings_reg_code_key',
          ) &&
          attempts < MAX_RETRIES - 1
        ) {
          attempts++;
          const jitterMs =
            Math.floor(Math.random() * 20 + 10) *
            attempts;
          this.logger.warn(
            `Sequence collision on cs_registration_trackings_reg_code_key. Retrying (attempt ${attempts}/${MAX_RETRIES}) after ${jitterMs}ms...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, jitterMs),
          );
          continue;
        }
        if (
          err instanceof BadRequestException ||
          err instanceof
            InternalServerErrorException
        ) {
          throw err;
        }
        this.logger.error(
          `Registration creation failed: ${err.message}`,
          err.stack,
        );
        if (
          err.name ===
          'SequelizeUniqueConstraintError'
        ) {
          throw new BadRequestException(
            'A unique constraint violation occurred on registration tracking attributes',
          );
        }
        throw new InternalServerErrorException(
          'Failed to process registration tracking record',
        );
      }
    }
    throw new InternalServerErrorException(
      'Failed to allocate unique registration code after multiple attempts',
    );
  }

  async findRegistrationByUuid(
    user: any,
    uuid: string,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const reg = await this.regModel.findOne({
      where,
    });
    if (!reg) {
      throw new NotFoundException(
        `Registration tracking record with UUID ${uuid} not found`,
      );
    }
    return toSnakeCaseRegistrationItem(reg);
  }

  async updateRegistration(
    user: any,
    uuid: string,
    dto: UpdateRegistrationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const reg = await this.regModel.findOne({
      where,
    });
    if (!reg) {
      throw new NotFoundException(
        `Registration tracking record with UUID ${uuid} not found`,
      );
    }

    if (dto.customer_name)
      reg.customerName = dto.customer_name.trim();
    if (dto.unit_name !== undefined)
      reg.unitName = dto.unit_name
        ? dto.unit_name.trim()
        : null;
    if (dto.project_name !== undefined)
      reg.projectName = dto.project_name
        ? dto.project_name.trim()
        : null;
    if (dto.sub_registrar_office)
      reg.subRegistrarOffice =
        dto.sub_registrar_office.trim();
    if (dto.deed_draft_status)
      reg.deedDraftStatus =
        dto.deed_draft_status as any;
    if (
      dto.registration_date_scheduled !==
      undefined
    )
      reg.registrationDateScheduled =
        dto.registration_date_scheduled;
    if (dto.total_govt_fees !== undefined)
      reg.totalGovtFees =
        Number(dto.total_govt_fees) || 0;
    if (dto.fee_receipt_collected !== undefined)
      reg.feeReceiptCollected = Boolean(
        dto.fee_receipt_collected,
      );
    if (dto.registered_deed_no !== undefined)
      reg.registeredDeedNo =
        dto.registered_deed_no
          ? dto.registered_deed_no.trim()
          : null;
    if (dto.status)
      reg.status = dto.status as any;
    if (dto.delivered_date !== undefined)
      reg.deliveredDate = dto.delivered_date;
    if (dto.remarks !== undefined)
      reg.remarks = dto.remarks;
    reg.updatedBy = ctx.userId;

    await reg.save();
    return toSnakeCaseRegistrationItem(reg);
  }

  async removeRegistration(
    user: any,
    uuid: string,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const reg = await this.regModel.findOne({
      where,
    });
    if (!reg) {
      throw new NotFoundException(
        `Registration tracking record with UUID ${uuid} not found`,
      );
    }

    reg.deletedBy = ctx.userId;
    await reg.save();
    await reg.destroy();

    return {
      success: true,
      message: `Registration record ${reg.regCode} deleted successfully`,
    };
  }

  // =========================================================================
  // 3. E-MUTATION & KHATIAN TRACKING
  // =========================================================================

  async getMutationStats(
    user: any,
    projectId?: string,
  ) {
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
      activeCases,
      hearingsScheduled,
      khatianApproved,
      kanungoInquiry,
    ] = await Promise.all([
      this.mutModel.count({ where }),
      this.mutModel.count({
        where: {
          ...where,
          currentStage: 'Hearing Scheduled',
        },
      }),
      this.mutModel.count({
        where: {
          ...where,
          currentStage: 'Khatian Approved',
        },
      }),
      this.mutModel.count({
        where: {
          ...where,
          currentStage:
            'Kanungo/Surveyor Inquiry',
        },
      }),
    ]);

    return {
      active_cases: activeCases,
      hearings_scheduled: hearingsScheduled,
      khatian_approved: khatianApproved,
      kanungo_inquiry: kanungoInquiry,
      all_count: activeCases,
      hearing_count: hearingsScheduled,
      inquiry_count: kanungoInquiry,
      approved_count: khatianApproved,
    };
  }

  async findAllMutations(
    user: any,
    query: QueryMutationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const page = Math.max(
      1,
      Number(query.page) || 1,
    );
    const limit = Math.max(
      1,
      Math.min(100, Number(query.limit) || 10),
    );
    const offset = (page - 1) * limit;

    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (
      query.project_id &&
      query.project_id !== 'all'
    ) {
      where.projectId = query.project_id;
    }
    if (query.current_stage) {
      where.currentStage = query.current_stage;
    }
    if (query.tab === 'approved') {
      where.currentStage = 'Khatian Approved';
    } else if (query.tab === 'hearing') {
      where.currentStage = 'Hearing Scheduled';
    } else if (query.tab === 'inquiry') {
      where.currentStage =
        'Kanungo/Surveyor Inquiry';
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          unitName: { [Op.iLike]: `%${search}%` },
        },
        {
          projectName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          mutationAppNo: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          acLandOffice: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          mutCode: { [Op.iLike]: `%${search}%` },
        },
        {
          khatianNumber: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const { rows, count } =
      await this.mutModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [['created_at', 'DESC']],
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
      items: rows.map((r) =>
        toSnakeCaseMutationItem(r),
      ),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async createMutation(
    user: any,
    dto: CreateMutationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    const MAX_RETRIES = 3;
    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const mutCode =
          await this.generateMutCode();
        const record = await this.mutModel.create(
          {
            organizationId: orgId,
            projectId:
              dto.project_id || undefined,
            bookingId:
              dto.booking_id || undefined,
            customerProfileId:
              dto.customer_profile_id ||
              undefined,
            mutCode,
            customerName:
              dto.customer_name.trim(),
            unitName:
              dto.unit_name?.trim() || null,
            projectName:
              dto.project_name?.trim() ||
              'Assigned Project',
            mutationAppNo:
              dto.mutation_app_no.trim(),
            acLandOffice:
              dto.ac_land_office.trim(),
            currentStage:
              (dto.current_stage as any) ||
              'Kanungo/Surveyor Inquiry',
            hearingDate: dto.hearing_date || null,
            dcrNumber:
              dto.dcr_number?.trim() || null,
            dcrFeeAmount:
              Number(dto.dcr_fee_amount) ||
              1170.0,
            dcrPaid: Boolean(dto.dcr_paid),
            khatianNumber:
              dto.khatian_number?.trim() || null,
            remarks: dto.remarks || null,
            createdBy: ctx.userId,
          },
        );

        return toSnakeCaseMutationItem(record);
      } catch (err: any) {
        if (
          isExactConstraintCollision(
            err,
            'cs_mutation_trackings_mut_code_key',
          ) &&
          attempts < MAX_RETRIES - 1
        ) {
          attempts++;
          const jitterMs =
            Math.floor(Math.random() * 20 + 10) *
            attempts;
          this.logger.warn(
            `Sequence collision on cs_mutation_trackings_mut_code_key. Retrying (attempt ${attempts}/${MAX_RETRIES}) after ${jitterMs}ms...`,
          );
          await new Promise((resolve) =>
            setTimeout(resolve, jitterMs),
          );
          continue;
        }
        if (
          err instanceof BadRequestException ||
          err instanceof
            InternalServerErrorException
        ) {
          throw err;
        }
        this.logger.error(
          `Mutation creation failed: ${err.message}`,
          err.stack,
        );
        if (
          err.name ===
          'SequelizeUniqueConstraintError'
        ) {
          throw new BadRequestException(
            'A unique constraint violation occurred on mutation tracking attributes',
          );
        }
        throw new InternalServerErrorException(
          'Failed to process mutation tracking record',
        );
      }
    }
    throw new InternalServerErrorException(
      'Failed to allocate unique mutation code after multiple attempts',
    );
  }

  async findMutationByUuid(
    user: any,
    uuid: string,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const mut = await this.mutModel.findOne({
      where,
    });
    if (!mut) {
      throw new NotFoundException(
        `e-Mutation tracking record with UUID ${uuid} not found`,
      );
    }
    return toSnakeCaseMutationItem(mut);
  }

  async updateMutation(
    user: any,
    uuid: string,
    dto: UpdateMutationTrackingDto,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const mut = await this.mutModel.findOne({
      where,
    });
    if (!mut) {
      throw new NotFoundException(
        `e-Mutation tracking record with UUID ${uuid} not found`,
      );
    }

    if (dto.customer_name)
      mut.customerName = dto.customer_name.trim();
    if (dto.unit_name !== undefined)
      mut.unitName = dto.unit_name
        ? dto.unit_name.trim()
        : null;
    if (dto.project_name !== undefined)
      mut.projectName = dto.project_name
        ? dto.project_name.trim()
        : null;
    if (dto.mutation_app_no)
      mut.mutationAppNo =
        dto.mutation_app_no.trim();
    if (dto.ac_land_office)
      mut.acLandOffice =
        dto.ac_land_office.trim();
    if (dto.current_stage)
      mut.currentStage = dto.current_stage as any;
    if (dto.hearing_date !== undefined)
      mut.hearingDate = dto.hearing_date;
    if (dto.dcr_number !== undefined)
      mut.dcrNumber = dto.dcr_number
        ? dto.dcr_number.trim()
        : null;
    if (dto.dcr_fee_amount !== undefined)
      mut.dcrFeeAmount =
        Number(dto.dcr_fee_amount) || 1170.0;
    if (dto.dcr_paid !== undefined)
      mut.dcrPaid = Boolean(dto.dcr_paid);
    if (dto.khatian_number !== undefined)
      mut.khatianNumber = dto.khatian_number
        ? dto.khatian_number.trim()
        : null;
    if (dto.remarks !== undefined)
      mut.remarks = dto.remarks;
    mut.updatedBy = ctx.userId;

    await mut.save();
    return toSnakeCaseMutationItem(mut);
  }

  async removeMutation(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const mut = await this.mutModel.findOne({
      where,
    });
    if (!mut) {
      throw new NotFoundException(
        `e-Mutation tracking record with UUID ${uuid} not found`,
      );
    }

    mut.deletedBy = ctx.userId;
    await mut.save();
    await mut.destroy();

    return {
      success: true,
      message: `e-Mutation record ${mut.mutCode} deleted successfully`,
    };
  }
}
