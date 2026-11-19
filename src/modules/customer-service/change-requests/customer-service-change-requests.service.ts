import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes, WhereOptions } from 'sequelize';
import {
  ChangeRequestStatus,
  ChangeRequestType,
  CsChangeRequest,
} from 'src/database/models/customer-service/cs_change_request.model';
import { CsCustomerProfile } from 'src/database/models/customer-service/cs_customer_profile.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CreateChangeRequestDto } from './dto/create-change-request.dto';
import { UpdateChangeRequestDto } from './dto/update-change-request.dto';
import { QueryChangeRequestDto } from './dto/query-change-request.dto';
import { AdvanceChangeRequestDto } from './dto/advance-change-request.dto';
import { UpdateStatusChangeRequestDto } from './dto/update-status-change-request.dto';
import { extractUserContext } from '../common/customer-service-context.helper';

// Pure mapper functions for strict snake_case responses
export function toSnakeCaseChangeRequestItem(
  item: CsChangeRequest,
) {
  const customerProfile = item.customerProfile;
  const customerId =
    customerProfile?.customerCode ||
    (item.customerProfileId
      ? `CUST-${item.customerProfileId}`
      : 'CUST-NEW');

  return {
    id: item.requestCode || `CR-${item.id}`,
    uuid: item.uuid,
    request_code:
      item.requestCode || `CR-${item.id}`,
    request_type: item.requestType,
    customer_id: customerId,
    customer_profile_id:
      item.customerProfileId ?? null,
    customer_name: item.customerName,
    unit: item.unit,
    project: item.project || 'Assigned Project',
    project_id: item.projectId ?? null,
    booking_id: item.bookingId ?? null,
    reason: item.reason || '',
    transfer_fee: Number(item.transferFee) || 0,
    new_buyer_name: item.newBuyerName ?? null,
    new_buyer_nid: item.newBuyerNid ?? null,
    new_buyer_phone: item.newBuyerPhone ?? null,
    status: item.status,
    applied_date: item.appliedDate
      ? String(item.appliedDate)
      : String(item.createdAt).slice(0, 10),
    approval_notes: item.approvalNotes ?? null,
    created_by: item.createdBy ?? null,
    updated_by: item.updatedBy ?? null,
    deleted_by: item.deletedBy ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
    deleted_at: item.deletedAt ?? null,
  };
}

export function formatBdtCurrency(
  amount: number,
): string {
  if (amount >= 10000000) {
    return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `৳ ${(amount / 100000).toFixed(2)} Lac`;
  }
  return `৳ ${Number(amount).toLocaleString('en-IN')}`;
}

export function toSnakeCaseChangeRequestStats(data: {
  activeRequests: number;
  completedTransfers: number;
  transferFeesCollected: number;
  allCount: number;
  pendingCount: number;
  completedCount: number;
  deletedCount: number;
}) {
  return {
    active_requests: data.activeRequests,
    completed_transfers: data.completedTransfers,
    transfer_fees_collected:
      data.transferFeesCollected,
    transfer_fees_collected_formatted:
      formatBdtCurrency(
        data.transferFeesCollected,
      ),
    all_count: data.allCount,
    pending_count: data.pendingCount,
    completed_count: data.completedCount,
    deleted_count: data.deletedCount,
  };
}

const WORKFLOW_ORDER: ChangeRequestStatus[] = [
  ChangeRequestStatus.DRAFT,
  ChangeRequestStatus.LEGAL_VERIFICATION,
  ChangeRequestStatus.HOD_APPROVAL,
  ChangeRequestStatus.ACCOUNTS_CLEARANCE,
  ChangeRequestStatus.COMPLETED,
];

@Injectable()
export class CustomerServiceChangeRequestsService {
  private readonly logger = new Logger(
    CustomerServiceChangeRequestsService.name,
  );

  constructor(
    @InjectModel(CsChangeRequest)
    private readonly changeRequestModel: typeof CsChangeRequest,
    @InjectModel(CsCustomerProfile)
    private readonly customerProfileModel: typeof CsCustomerProfile,
    @Optional()
    @InjectModel(Project)
    private readonly projectModel?: typeof Project,
  ) {}

  /**
   * Fast aggregated KPI metrics & tab counts
   */
  async getStats(projectId?: string, user?: any) {
    const ctx = extractUserContext(user);
    try {
      const baseScope: WhereOptions<CsChangeRequest> = {};
      if (!ctx.isSuperAdmin && ctx.orgId) {
        (baseScope as any).organizationId = ctx.orgId;
      }
      let pUuid = projectId && projectId !== 'all' ? projectId.trim() : null;
      if (pUuid) {
        if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
          const proj = await (this.projectModel || Project).findByPk(
            Number(pUuid),
            {
              attributes: ['uuid'],
            },
          );
          pUuid = proj ? proj.uuid : '00000000-0000-0000-0000-000000000000';
        } else if (!/^[0-9a-fA-F-]{36}$/.test(pUuid)) {
          pUuid = '00000000-0000-0000-0000-000000000000';
        }
        (baseScope as any).projectId = pUuid;
      }

      // 1. Active (non-deleted) counts and sum
      const [
        allCount,
        completedCount,
        pendingCount,
        feeSumResult,
        deletedCount,
      ] = await Promise.all([
        // All active
        this.changeRequestModel.count({
          where: baseScope,
        }),
        // Completed
        this.changeRequestModel.count({
          where: {
            ...baseScope,
            status: ChangeRequestStatus.COMPLETED,
          },
        }),
        // Pending pipeline
        this.changeRequestModel.count({
          where: {
            ...baseScope,
            status: {
              [Op.in]: [
                ChangeRequestStatus.DRAFT,
                ChangeRequestStatus.LEGAL_VERIFICATION,
                ChangeRequestStatus.HOD_APPROVAL,
                ChangeRequestStatus.ACCOUNTS_CLEARANCE,
              ],
            },
          },
        }),
        // Completed fee sum
        this.changeRequestModel.sum(
          'transferFee',
          {
            where: {
              ...baseScope,
              status:
                ChangeRequestStatus.COMPLETED,
            },
          },
        ),
        // Soft-deleted records count
        this.changeRequestModel.count({
          where: {
            ...baseScope,
            deletedAt: {
              [Op.ne]: null,
            },
          },
          paranoid: false,
        }),
      ]);

      const activeRequests =
        allCount - completedCount;
      const transferFeesCollected =
        Number(feeSumResult) || 0;

      return toSnakeCaseChangeRequestStats({
        activeRequests: Math.max(
          0,
          activeRequests,
        ),
        completedTransfers: completedCount,
        transferFeesCollected,
        allCount,
        pendingCount,
        completedCount,
        deletedCount,
      });
    } catch (error: any) {
      if (
        error.message?.includes(
          'does not exist',
        ) ||
        error.message?.includes(
          'Model not initialized',
        ) ||
        error.original?.code === '42P01'
      ) {
        this.logger.warn(
          'cs_change_requests table does not exist in database yet. Returning default 0 stats.',
        );
        return toSnakeCaseChangeRequestStats({
          activeRequests: 0,
          completedTransfers: 0,
          transferFeesCollected: 0,
          allCount: 0,
          pendingCount: 0,
          completedCount: 0,
          deletedCount: 0,
        });
      }
      this.logger.error(
        `Failed to calculate change request stats: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Dropdown metadata for options, filters and workflow pipeline
   */
  async getDropdownMeta() {
    return {
      request_types: Object.values(
        ChangeRequestType,
      ),
      statuses: Object.values(
        ChangeRequestStatus,
      ),
      workflow_pipeline: WORKFLOW_ORDER,
      tab_filters: [
        'all',
        'pending',
        'completed',
        'deleted',
      ],
    };
  }

  /**
   * Paginated list of change requests with search, tab, status, and is_deleted filtering
   */
  async findChangeRequests(
    query: QueryChangeRequestDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    try {
      const isDeleted =
        (query.is_deleted === true ||
          String(query.is_deleted) === 'true' ||
          query.tab === 'deleted') &&
        String(query.is_deleted) !== 'false';
      const where: WhereOptions<CsChangeRequest> =
        {};

      if (!ctx.isSuperAdmin && ctx.orgId) {
        (where as any).organizationId = ctx.orgId;
      }

      const rawProjectId = query.project_id || query.projectId;
      if (rawProjectId && rawProjectId !== 'all') {
        let pUuid = rawProjectId.trim();
        if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
          const proj = await (this.projectModel || Project).findByPk(
            Number(pUuid),
            {
              attributes: ['uuid'],
            },
          );
          pUuid = proj ? proj.uuid : '00000000-0000-0000-0000-000000000000';
        } else if (!/^[0-9a-fA-F-]{36}$/.test(pUuid)) {
          pUuid = '00000000-0000-0000-0000-000000000000';
        }
        (where as any).projectId = pUuid;
      }

      // 1. Soft-delete condition
      if (isDeleted) {
        where.deletedAt = { [Op.ne]: null };
      }

      // 2. Tab filter (when not looking at deleted)
      if (!isDeleted && query.tab) {
        if (query.tab === 'pending') {
          where.status = {
            [Op.in]: [
              ChangeRequestStatus.DRAFT,
              ChangeRequestStatus.LEGAL_VERIFICATION,
              ChangeRequestStatus.HOD_APPROVAL,
              ChangeRequestStatus.ACCOUNTS_CLEARANCE,
            ],
          };
        } else if (query.tab === 'completed') {
          where.status =
            ChangeRequestStatus.COMPLETED;
        }
      }

      // 3. Explicit status filter
      if (
        query.status &&
        query.status !== 'all'
      ) {
        where.status = query.status;
      }

      // 4. Request type filter
      if (
        query.request_type &&
        query.request_type !== 'all'
      ) {
        where.requestType = query.request_type;
      }

      // 5. Search query (search across request_code, customer_name, unit, new_buyer_name, project)
      if (query.search && query.search.trim()) {
        const q = `%${query.search.trim()}%`;
        where[Op.or] = [
          { requestCode: { [Op.iLike]: q } },
          { customerName: { [Op.iLike]: q } },
          { unit: { [Op.iLike]: q } },
          { newBuyerName: { [Op.iLike]: q } },
          { project: { [Op.iLike]: q } },
        ];
      }

      // 6. Sorting
      const sortColumnMap: Record<
        string,
        string
      > = {
        created_at: 'createdAt',
        applied_date: 'appliedDate',
        transfer_fee: 'transferFee',
        request_code: 'requestCode',
        id: 'id',
        status: 'status',
      };
      const sortField =
        sortColumnMap[
          query.sort_by || 'created_at'
        ] || 'createdAt';
      const sortDirection =
        query.sort_order &&
        query.sort_order.toLowerCase() === 'asc'
          ? 'ASC'
          : 'DESC';

      const offset = query.getOffset();
      const limit = Math.min(
        100,
        Math.max(1, query.limit || 10),
      );

      const { count, rows } =
        await this.changeRequestModel.findAndCountAll(
          {
            where,
            paranoid: !isDeleted,
            order: [[sortField, sortDirection]],
            offset,
            limit,
          },
        );

      return {
        items: rows.map(
          toSnakeCaseChangeRequestItem,
        ),
        meta: query.getPaginationMetadata(count),
      };
    } catch (error: any) {
      if (
        error.message?.includes(
          'does not exist',
        ) ||
        error.message?.includes(
          'Model not initialized',
        ) ||
        error.original?.code === '42P01'
      ) {
        this.logger.warn(
          'cs_change_requests query fallback: returning empty list.',
        );
        return {
          items: [],
          meta: query.getPaginationMetadata(0),
        };
      }
      this.logger.error(
        `Failed to retrieve change requests: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Get single change request by UUID
   */
  async findByUuid(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
        paranoid: false,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    return toSnakeCaseChangeRequestItem(item);
  }

  /**
   * Create a new change request
   */
  async createChangeRequest(
    dto: CreateChangeRequestDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    try {
      // Resolve project_id if booking_id or project was provided
      const rawProj = dto.project_id || dto.projectId;
      let resolvedProjectId: string | null = null;
      if (rawProj && rawProj !== 'all') {
        let pUuid = rawProj.trim();
        if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
          const proj = await (this.projectModel || Project).findByPk(
            Number(pUuid),
            {
              attributes: ['uuid'],
            },
          );
          pUuid = proj ? proj.uuid : null;
        }
        resolvedProjectId = pUuid;
      }
      if (!resolvedProjectId && dto.booking_id) {
        const booking = await this.changeRequestModel.sequelize?.query(
          `SELECT "projectId" FROM pr_flat_land_bookings WHERE uuid = :bookingId LIMIT 1`,
          {
            replacements: { bookingId: dto.booking_id },
            type: QueryTypes.SELECT,
          },
        );
        if (booking && booking[0]) {
          resolvedProjectId = (booking[0] as any).projectId;
        }
      }

      // Generate a collision-safe request code: CR-1001 ...
      let requestCode = '';
      for (
        let attempt = 0;
        attempt < 5;
        attempt++
      ) {
        const candidate = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
        const existing =
          await this.changeRequestModel.findOne({
            where: { requestCode: candidate },
            paranoid: false,
          });
        if (!existing) {
          requestCode = candidate;
          break;
        }
      }

      if (!requestCode) {
        requestCode = `CR-${Date.now().toString().slice(-4)}`;
      }

      // If customer_profile_id is provided, verify it exists within org
      if (dto.customer_profile_id) {
        const profileWhere: any = { id: dto.customer_profile_id };
        if (!ctx.isSuperAdmin && ctx.orgId) {
          profileWhere.organizationId = ctx.orgId;
        }
        const profile =
          await this.customerProfileModel.findOne({
            where: profileWhere,
          });
        if (!profile) {
          throw new BadRequestException(
            `Customer profile ID ${dto.customer_profile_id} does not exist`,
          );
        }
      }

      const created =
        await this.changeRequestModel.create({
          requestCode,
          requestType: dto.request_type,
          customerProfileId:
            dto.customer_profile_id ?? null,
          customerName: dto.customer_name,
          unit: dto.unit,
          project: dto.project ?? null,
          projectId: resolvedProjectId ?? undefined,
          organizationId: ctx.orgId ?? undefined,
          bookingId: dto.booking_id ?? null,
          reason: dto.reason ?? null,
          transferFee:
            dto.transfer_fee !== undefined
              ? Number(dto.transfer_fee)
              : 0,
          newBuyerName:
            dto.new_buyer_name ?? null,
          newBuyerNid: dto.new_buyer_nid ?? null,
          newBuyerPhone:
            dto.new_buyer_phone ?? null,
          status:
            dto.status ||
            ChangeRequestStatus.LEGAL_VERIFICATION,
          appliedDate:
            dto.applied_date ||
            new Date()
              .toISOString()
              .split('T')[0],
          approvalNotes:
            dto.approval_notes ?? null,
          createdBy: ctx.userId ?? null,
          updatedBy: ctx.userId ?? null,
        });

      return toSnakeCaseChangeRequestItem(
        created,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create change request: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Update an existing change request
   */
  async updateChangeRequest(
    uuid: string,
    dto: UpdateChangeRequestDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    const updatePayload: any = {};
    if (dto.request_type !== undefined)
      updatePayload.requestType =
        dto.request_type;
    if (dto.customer_name !== undefined)
      updatePayload.customerName =
        dto.customer_name;
    if (dto.unit !== undefined)
      updatePayload.unit = dto.unit;
    if (dto.customer_profile_id !== undefined)
      updatePayload.customerProfileId =
        dto.customer_profile_id;
    if (dto.project !== undefined)
      updatePayload.project = dto.project;
    const rawProj = dto.project_id !== undefined ? dto.project_id : dto.projectId;
    if (rawProj !== undefined) {
      if (rawProj && rawProj !== 'all') {
        let pUuid = rawProj.trim();
        if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
          const proj = await (this.projectModel || Project).findByPk(
            Number(pUuid),
            {
              attributes: ['uuid'],
            },
          );
          pUuid = proj ? proj.uuid : null;
        }
        updatePayload.projectId = pUuid;
      } else {
        updatePayload.projectId = null;
      }
    }
    if (dto.booking_id !== undefined)
      updatePayload.bookingId = dto.booking_id;
    if (dto.reason !== undefined)
      updatePayload.reason = dto.reason;
    if (dto.transfer_fee !== undefined)
      updatePayload.transferFee = Number(
        dto.transfer_fee,
      );
    if (dto.new_buyer_name !== undefined)
      updatePayload.newBuyerName =
        dto.new_buyer_name;
    if (dto.new_buyer_nid !== undefined)
      updatePayload.newBuyerNid =
        dto.new_buyer_nid;
    if (dto.new_buyer_phone !== undefined)
      updatePayload.newBuyerPhone =
        dto.new_buyer_phone;
    if (dto.status !== undefined)
      updatePayload.status = dto.status;
    if (dto.applied_date !== undefined)
      updatePayload.appliedDate =
        dto.applied_date;
    if (dto.approval_notes !== undefined)
      updatePayload.approvalNotes =
        dto.approval_notes;

    if (ctx.userId) {
      updatePayload.updatedBy = ctx.userId;
    }

    await item.update(updatePayload);
    return toSnakeCaseChangeRequestItem(item);
  }

  /**
   * Advance workflow pipeline to the next sequential stage:
   * Draft -> Legal Verification -> HOD Approval -> Accounts Clearance -> Completed
   */
  async advanceStatus(
    uuid: string,
    dto: AdvanceChangeRequestDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    if (
      item.status ===
      ChangeRequestStatus.COMPLETED
    ) {
      throw new BadRequestException(
        `Change request "${item.requestCode}" is already Completed and endorsed`,
      );
    }

    if (
      item.status === ChangeRequestStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Rejected change request "${item.requestCode}" cannot be advanced`,
      );
    }

    const currentIndex = WORKFLOW_ORDER.indexOf(
      item.status,
    );
    if (
      currentIndex === -1 ||
      currentIndex >= WORKFLOW_ORDER.length - 1
    ) {
      throw new BadRequestException(
        `Cannot advance change request from current status "${item.status}"`,
      );
    }

    const nextStatus =
      WORKFLOW_ORDER[currentIndex + 1];

    let combinedNotes = item.approvalNotes || '';
    if (dto.notes && dto.notes.trim()) {
      const timestamp = new Date().toISOString();
      const noteEntry = `[${timestamp}] Stage advanced to ${nextStatus}: ${dto.notes.trim()}`;
      combinedNotes = combinedNotes
        ? `${combinedNotes}\n${noteEntry}`
        : noteEntry;
    }

    await item.update({
      status: nextStatus,
      approvalNotes: combinedNotes || null,
      updatedBy: ctx.userId ?? null,
    });

    return {
      message: `Request ${item.requestCode} advanced to ${nextStatus}`,
      data: toSnakeCaseChangeRequestItem(item),
    };
  }

  /**
   * Update workflow status directly (e.g. Reject or specific status)
   */
  async updateStatus(
    uuid: string,
    dto: UpdateStatusChangeRequestDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    let combinedNotes = item.approvalNotes || '';
    if (dto.remarks && dto.remarks.trim()) {
      const timestamp = new Date().toISOString();
      const noteEntry = `[${timestamp}] Status changed to ${dto.status}: ${dto.remarks.trim()}`;
      combinedNotes = combinedNotes
        ? `${combinedNotes}\n${noteEntry}`
        : noteEntry;
    }

    await item.update({
      status: dto.status,
      approvalNotes: combinedNotes || null,
      updatedBy: ctx.userId ?? null,
    });

    return {
      message: `Request ${item.requestCode} status updated to ${dto.status}`,
      data: toSnakeCaseChangeRequestItem(item),
    };
  }

  /**
   * Soft delete a change request
   */
  async removeChangeRequest(
    uuid: string,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    if (ctx.userId) {
      await item.update({ deletedBy: ctx.userId });
    }

    await item.destroy();

    return {
      message: `Change request "${item.requestCode}" soft-deleted successfully`,
      uuid,
    };
  }

  /**
   * Restore a soft-deleted change request
   */
  async restoreChangeRequest(
    uuid: string,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item =
      await this.changeRequestModel.findOne({
        where,
        paranoid: false,
      });

    if (!item) {
      throw new NotFoundException(
        `Change request "${uuid}" not found`,
      );
    }

    if (!item.deletedAt) {
      throw new BadRequestException(
        `Change request "${item.requestCode}" is not deleted`,
      );
    }

    await item.restore();

    const updatePayload: {
      deletedBy: null;
      updatedBy?: number;
    } = {
      deletedBy: null,
    };
    if (ctx.userId) {
      updatePayload.updatedBy = ctx.userId;
    }

    await item.update(updatePayload);

    return {
      message: `Change request "${item.requestCode}" restored successfully`,
      data: toSnakeCaseChangeRequestItem(item),
    };
  }
}
