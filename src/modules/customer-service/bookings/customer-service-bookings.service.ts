import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  QueryTypes,
  Transaction,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  CsBookingHandover,
  HandoverStatus,
} from 'src/database/models/customer-service/cs_booking_handover.model';
import { CsCustomerProfile } from 'src/database/models/customer-service/cs_customer_profile.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CrSaleAgreement } from 'src/database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from 'src/database/models/credit-realization/cr_installment_plan.model';
import { SysNotification } from 'src/database/models/system/sys_notification.model';
import {
  BookingSortBy,
  BookingTabFilter,
  QueryPropertiesBookingsDto,
} from './dto/query-properties-bookings.dto';
import { UpdateHandoverStatusDto } from './dto/update-handover-status.dto';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  Booking360Detail,
  BookingListItem,
  BookingListResponse,
  BookingStatsData,
  DemandLetterPreview,
} from './dto/properties-booking-response.dto';

/**
 * State machine: Allowed next steps for handover lifecycle
 */
export const ALLOWED_TRANSITIONS: Partial<
  Record<HandoverStatus, HandoverStatus[]>
> = {
  [HandoverStatus.UNDER_CONSTRUCTION]: [
    HandoverStatus.READY_FOR_SNAGGING,
    HandoverStatus.SCHEDULED,
  ],
  [HandoverStatus.SCHEDULED]: [
    HandoverStatus.READY_FOR_SNAGGING,
    HandoverStatus.READY_FOR_KEY_DELIVERY,
  ],
  [HandoverStatus.READY_FOR_SNAGGING]: [
    HandoverStatus.SNAG_RECTIFICATION,
    HandoverStatus.READY_FOR_KEY_DELIVERY,
    HandoverStatus.DLP_ACTIVE,
  ],
  [HandoverStatus.SNAG_RECTIFICATION]: [
    HandoverStatus.READY_FOR_KEY_DELIVERY,
  ],
  [HandoverStatus.READY_FOR_KEY_DELIVERY]: [
    HandoverStatus.POSSESSION_TAKEN,
    HandoverStatus.DLP_ACTIVE,
  ],
  [HandoverStatus.POSSESSION_TAKEN]: [
    HandoverStatus.DLP_ACTIVE,
    HandoverStatus.HANDED_OVER,
  ],
  [HandoverStatus.DLP_ACTIVE]: [
    HandoverStatus.HANDED_OVER,
  ],
  [HandoverStatus.HANDED_OVER]: [],
};

/**
 * Compute statutory DLP start and expiry dates (possession_date + 2 years minus 1 day)
 */
export function computeDlpDates(
  possessionDateStr: string,
  years = 2,
): {
  dlpStartDate: string;
  dlpExpiryDate: string;
} {
  const dlpStartDate = possessionDateStr;
  const date = new Date(possessionDateStr);
  date.setFullYear(date.getFullYear() + years);
  date.setDate(date.getDate() - 1);
  const dlpExpiryDate = date
    .toISOString()
    .slice(0, 10);
  return { dlpStartDate, dlpExpiryDate };
}

/**
 * Format currency to Bangladeshi standard notation (Cr, Lac, or formatted comma string)
 */
export function formatBdtCurrency(
  amount: number,
): string {
  if (amount >= 10000000) {
    return `৳ ${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `৳ ${(amount / 100000).toFixed(2)} Lac`;
  }
  return `৳ ${Number(amount).toLocaleString(
    'en-US',
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

@Injectable()
export class CustomerServiceBookingsService {
  private readonly logger = new Logger(
    CustomerServiceBookingsService.name,
  );

  constructor(
    private readonly sequelize: Sequelize,
    @InjectModel(FlatLandBooking)
    private readonly bookingModel: typeof FlatLandBooking,
    @InjectModel(CsBookingHandover)
    private readonly handoverModel: typeof CsBookingHandover,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(CsCustomerProfile)
    private readonly customerProfileModel: typeof CsCustomerProfile,
    @InjectModel(CrSaleAgreement)
    private readonly saleAgreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPlan)
    private readonly installmentPlanModel: typeof CrInstallmentPlan,
    @InjectModel(SysNotification)
    private readonly notificationModel: typeof SysNotification,
  ) {}

  /**
   * Helper to resolve project uuid and numeric ID safely
   */
  private async resolveProjectIdentifiers(
    projectId?: string | null,
  ): Promise<{
    uuid: string | null;
    numericId: number | null;
  }> {
    if (!projectId) {
      return { uuid: null, numericId: null };
    }
    const trimmed = String(projectId).trim();
    if (!trimmed) {
      return { uuid: null, numericId: null };
    }

    const isUuid =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        trimmed,
      );
    const isNumeric = /^\d+$/.test(trimmed);

    if (isUuid) {
      const proj =
        await this.projectModel.findOne({
          where: { uuid: trimmed } as any,
          attributes: ['id', 'uuid'],
        });
      return {
        uuid: trimmed,
        numericId: proj ? Number(proj.id) : null,
      };
    }

    if (isNumeric) {
      const numId = parseInt(trimmed, 10);
      const proj =
        await this.projectModel.findByPk(numId, {
          attributes: ['id', 'uuid'],
        });
      return {
        uuid: proj ? proj.uuid : null,
        numericId: numId,
      };
    }

    const proj = await this.projectModel.findOne({
      where: { code: trimmed } as any,
      attributes: ['id', 'uuid'],
    });
    return {
      uuid: proj ? proj.uuid : null,
      numericId: proj ? Number(proj.id) : null,
    };
  }

  /**
   * 1. GET /stats
   * High-performance single SQL aggregation query
   */
  async getStats(
    projectId?: string,
    user?: any,
  ): Promise<{
    success: boolean;
    data: BookingStatsData;
  }> {
    const ctx = extractUserContext(user);
    try {
      const extraConditions: string[] = [
        'b.deleted_at IS NULL',
      ];
      const replacements: Record<string, any> =
        {};

      if (projectId) {
        const resolved =
          await this.resolveProjectIdentifiers(
            projectId,
          );
        const conds: string[] = [];
        if (resolved.uuid) {
          replacements.projUuid = resolved.uuid;
          conds.push(
            'b.project_id::text = :projUuid',
          );
          conds.push(
            'h.project_id::text = :projUuid',
          );
        }
        if (conds.length > 0) {
          extraConditions.push(
            `(${conds.join(' OR ')})`,
          );
        } else {
          extraConditions.push('1 = 0');
        }
      }

      if (!ctx.isSuperAdmin && ctx.orgId) {
        extraConditions.push(
          '(h.organization_id = :orgId OR b.created_by IN (SELECT id::text FROM sys_users WHERE org_id = :orgId))',
        );
        replacements.orgId = ctx.orgId;
      }

      const whereSql =
        extraConditions.join(' AND ');

      const sql = `
        SELECT
          COUNT(*)::int AS total_booked_units,
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Ready for Snagging')::int AS ready_for_snagging,
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'DLP Active')::int AS dlp_active,
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Handed Over')::int AS handed_over,
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Under Construction')::int AS under_construction,
          COALESCE(SUM(b."grandTotal"), 0)::numeric AS total_portfolio_valuation,
          COALESCE(SUM(b."paid"), 0)::numeric AS total_collected_amount,
          COALESCE(SUM(b."due"), 0)::numeric AS total_outstanding_due,
          (SELECT COUNT(*)::int FROM "pr_flat_land_bookings" WHERE deleted_at IS NOT NULL) AS deleted_count
        FROM "pr_flat_land_bookings" b
        LEFT JOIN "cs_booking_handovers" h
          ON b.uuid = h.booking_id AND h.deleted_at IS NULL
        WHERE ${whereSql};
      `;

      const [rawStats] =
        await this.sequelize.query<any>(sql, {
          replacements,
          type: QueryTypes.SELECT,
        });

      const totalValuation = Number(
        rawStats?.total_portfolio_valuation || 0,
      );
      const totalCollected = Number(
        rawStats?.total_collected_amount || 0,
      );
      const totalDue = Number(
        rawStats?.total_outstanding_due || 0,
      );

      const stats: BookingStatsData = {
        total_booked_units: Number(
          rawStats?.total_booked_units || 0,
        ),
        ready_for_snagging: Number(
          rawStats?.ready_for_snagging || 0,
        ),
        dlp_active: Number(
          rawStats?.dlp_active || 0,
        ),
        handed_over: Number(
          rawStats?.handed_over || 0,
        ),
        under_construction: Number(
          rawStats?.under_construction || 0,
        ),
        total_portfolio_valuation: totalValuation,
        total_portfolio_valuation_formatted:
          formatBdtCurrency(totalValuation),
        total_collected_amount: totalCollected,
        total_collected_amount_formatted:
          formatBdtCurrency(totalCollected),
        total_outstanding_due: totalDue,
        total_outstanding_due_formatted:
          formatBdtCurrency(totalDue),
        deleted_count: Number(
          rawStats?.deleted_count || 0,
        ),
      };

      return {
        success: true,
        data: stats,
      };
    } catch (err: any) {
      this.logger.error(
        `Error calculating booking stats: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * 2. GET /
   * Paginated list with search, filters, whitelist sorting, and independent tab counts
   */
  async findBookings(
    query: QueryPropertiesBookingsDto,
    user?: any,
  ): Promise<{
    success: boolean;
    data: BookingListResponse;
  }> {
    const ctx = extractUserContext(user);
    try {
      const page = Math.max(1, query.page || 1);
      const limit = Math.min(
        100,
        Math.max(1, query.limit || 10),
      );
      const offset = query.getOffset();

      const search = query.search?.trim();
      const tab =
        query.tab || BookingTabFilter.ALL;
      const projectId = query.project_id?.trim();
      const customerId =
        query.customer_id?.trim();

      // Base conditions for filtering (shared by list and tab_counts)
      const isDeleted = Boolean(
        (query as any).is_deleted ??
        (query as any).isDeleted,
      );
      const baseConditions: string[] = [
        isDeleted
          ? 'b.deleted_at IS NOT NULL'
          : 'b.deleted_at IS NULL',
      ];
      const replacements: Record<string, any> = {
        limit,
        offset,
      };

      if (!ctx.isSuperAdmin && ctx.orgId) {
        replacements.orgId = ctx.orgId;
        baseConditions.push(
          '(h.organization_id = :orgId OR c.organization_id = :orgId OR b.created_by IN (SELECT id::text FROM sys_users WHERE org_id = :orgId))',
        );
      }

      if (search) {
        replacements.searchLike = `%${search}%`;
        baseConditions.push(`(
          b.code ILIKE :searchLike
          OR b."customerName" ILIKE :searchLike
          OR p.name ILIKE :searchLike
          OR p.code ILIKE :searchLike
          OR fl."flatLandNo" ILIKE :searchLike
          OR c.phone_number ILIKE :searchLike
          OR c.customer_code ILIKE :searchLike
          OR h.key_register_no ILIKE :searchLike
        )`);
      }

      if (projectId) {
        const resolved =
          await this.resolveProjectIdentifiers(
            projectId,
          );
        const conds: string[] = [];
        if (resolved.uuid) {
          replacements.projUuid = resolved.uuid;
          conds.push(
            'b.project_id::text = :projUuid',
          );
          conds.push('p.uuid::text = :projUuid');
          conds.push(
            'h.project_id::text = :projUuid',
          );
        }
        if (resolved.numericId !== null) {
          replacements.projNumericId =
            resolved.numericId;
          conds.push('p.id = :projNumericId');
        }
        if (conds.length > 0) {
          baseConditions.push(
            `(${conds.join(' OR ')})`,
          );
        } else {
          baseConditions.push('1 = 0');
        }
      }

      if (customerId) {
        replacements.customerId = customerId;
        baseConditions.push(
          '(c.uuid::text = :customerId OR c.customer_code = :customerId OR c.id::text = :customerId)',
        );
      }

      const baseWhereSql =
        baseConditions.length > 0
          ? `WHERE ${baseConditions.join(' AND ')}`
          : '';

      // 1. Single query for tab counts (respects search, project, customer, but NOT tab)
      const tabCountsSql = `
        SELECT
          COUNT(*)::int AS "all",
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Ready for Snagging')::int AS "snagging",
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'DLP Active')::int AS "dlp",
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Handed Over')::int AS "handedover",
          COUNT(*) FILTER (WHERE COALESCE(h.handover_status, 'Under Construction') = 'Under Construction')::int AS "under_construction"
        FROM "pr_flat_land_bookings" b
        LEFT JOIN "cs_booking_handovers" h ON b.uuid = h.booking_id AND h.deleted_at IS NULL
        LEFT JOIN "project" p ON b.project_id = p.uuid AND p.deleted_at IS NULL
        LEFT JOIN "pr_flat_land" fl ON b."flatLandId" = fl.uuid AND fl.deleted_at IS NULL
        LEFT JOIN "cs_customer_profiles" c ON LOWER(TRIM(b."customerName")) = LOWER(TRIM(c.customer_name)) AND c.deleted_at IS NULL
        ${baseWhereSql};
      `;

      // 2. Tab filter condition for main items list
      const listConditions = [...baseConditions];
      if (tab === BookingTabFilter.SNAGGING) {
        listConditions.push(
          "COALESCE(h.handover_status, 'Under Construction') = 'Ready for Snagging'",
        );
      } else if (tab === BookingTabFilter.DLP) {
        listConditions.push(
          "COALESCE(h.handover_status, 'Under Construction') = 'DLP Active'",
        );
      } else if (
        tab === BookingTabFilter.HANDEDOVER
      ) {
        listConditions.push(
          "COALESCE(h.handover_status, 'Under Construction') = 'Handed Over'",
        );
      } else if (
        tab ===
        BookingTabFilter.UNDER_CONSTRUCTION
      ) {
        listConditions.push(
          "COALESCE(h.handover_status, 'Under Construction') = 'Under Construction'",
        );
      }

      const listWhereSql = `WHERE ${listConditions.join(' AND ')}`;

      // 3. Whitelist sort mapping
      let sortSql = 'b.created_at DESC';
      const order =
        query.sort_order?.toUpperCase() === 'ASC'
          ? 'ASC'
          : 'DESC';
      if (
        query.sort_by ===
        BookingSortBy.BOOKING_DATE
      ) {
        sortSql = `b."bookingDate" ${order}`;
      } else if (
        query.sort_by ===
        BookingSortBy.CUSTOMER_NAME
      ) {
        sortSql = `b."customerName" ${order}`;
      } else if (
        query.sort_by ===
        BookingSortBy.TOTAL_PRICE
      ) {
        sortSql = `b."grandTotal" ${order}`;
      } else if (
        query.sort_by ===
        BookingSortBy.PAID_AMOUNT
      ) {
        sortSql = `b.paid ${order}`;
      } else if (
        query.sort_by === BookingSortBy.DUE_AMOUNT
      ) {
        sortSql = `b.due ${order}`;
      } else if (
        query.sort_by === BookingSortBy.CREATED_AT
      ) {
        sortSql = `b.created_at ${order}`;
      }

      // 4. Execute tab counts & items list concurrently
      const [
        tabCountsResult,
        rawItems,
        [{ total: filteredTotal }],
      ] = await Promise.all([
        this.sequelize.query<any>(tabCountsSql, {
          replacements,
          type: QueryTypes.SELECT,
        }),
        this.sequelize.query<any>(
          `
          SELECT
            b.id,
            b.uuid,
            b.code,
            b."bookingDate" AS "booking_date",
            b."customerName" AS "customer_name",
            b."salesBy" AS "sales_by",
            b.rate,
            b."otherCost" AS "other_cost",
            b.parking,
            b."utilityCharge" AS "utility_charge",
            b.discount,
            b.subtotal,
            b."grandTotal" AS "grand_total",
            b.paid AS "paid_amount",
            b.due AS "due_amount",
            b.status AS "booking_status",
            b.created_at,
            b.updated_at,
            p.id AS "project_id",
            p.uuid AS "project_uuid",
            p.name AS "project_name",
            p.code AS "project_code",
            fl.id AS "unit_id",
            fl.uuid AS "unit_uuid",
            fl."flatLandNo" AS "unit_number",
            fl."propertyType" AS "unit_type",
            fl.unit AS "floor",
            fl.size AS "size_sqft",
            c.id AS "customer_profile_id",
            c.uuid AS "customer_uuid",
            c.customer_code,
            c.phone_number AS "customer_phone",
            c.email AS "customer_email",
            COALESCE(h.handover_status, 'Under Construction') AS "handover_status",
            h.possession_date,
            h.dlp_start_date,
            h.dlp_expiry_date,
            h.key_register_no,
            h.possession_cert_no,
            COALESCE(h.total_snags_reported, 0)::int AS "total_snags_reported",
            COALESCE(h.total_snags_resolved, 0)::int AS "total_snags_resolved"
          FROM "pr_flat_land_bookings" b
          LEFT JOIN "cs_booking_handovers" h ON b.uuid = h.booking_id AND h.deleted_at IS NULL
          LEFT JOIN "project" p ON b.project_id = p.uuid AND p.deleted_at IS NULL
          LEFT JOIN "pr_flat_land" fl ON b."flatLandId" = fl.uuid AND fl.deleted_at IS NULL
          LEFT JOIN "cs_customer_profiles" c ON LOWER(TRIM(b."customerName")) = LOWER(TRIM(c.customer_name)) AND c.deleted_at IS NULL
          ${listWhereSql}
          ORDER BY ${sortSql}
          LIMIT :limit OFFSET :offset;
          `,
          {
            replacements,
            type: QueryTypes.SELECT,
          },
        ),
        this.sequelize.query<{ total: number }>(
          `
          SELECT COUNT(*)::int AS total
          FROM "pr_flat_land_bookings" b
          LEFT JOIN "cs_booking_handovers" h ON b.uuid = h.booking_id AND h.deleted_at IS NULL
          LEFT JOIN "project" p ON b.project_id = p.uuid AND p.deleted_at IS NULL
          LEFT JOIN "pr_flat_land" fl ON b."flatLandId" = fl.uuid AND fl.deleted_at IS NULL
          LEFT JOIN "cs_customer_profiles" c ON LOWER(TRIM(b."customerName")) = LOWER(TRIM(c.customer_name)) AND c.deleted_at IS NULL
          ${listWhereSql};
          `,
          {
            replacements,
            type: QueryTypes.SELECT,
          },
        ),
      ]);

      const tabCounts = tabCountsResult[0] || {
        all: 0,
        snagging: 0,
        dlp: 0,
        handedover: 0,
        under_construction: 0,
      };

      const items: BookingListItem[] =
        rawItems.map((r) => {
          const grandTotal = Number(
            r.grand_total || 0,
          );
          const paidAmount = Number(
            r.paid_amount || 0,
          );
          const dueAmount = Number(
            r.due_amount || 0,
          );

          let paymentStatus:
            | 'Paid'
            | 'Partial'
            | 'Due'
            | 'Overdue' = 'Due';
          if (dueAmount <= 0 && paidAmount > 0) {
            paymentStatus = 'Paid';
          } else if (
            paidAmount > 0 &&
            dueAmount > 0
          ) {
            paymentStatus = 'Partial';
          }

          const snagsReported = Number(
            r.total_snags_reported || 0,
          );
          const snagsResolved = Number(
            r.total_snags_resolved || 0,
          );
          const openSnags = Math.max(
            0,
            snagsReported - snagsResolved,
          );

          return {
            id: r.code || `BK-${r.id}`,
            uuid: r.uuid,
            code: r.code,
            customer_id:
              r.customer_code ||
              `CUST-${r.customer_profile_id || r.id}`,
            customer_uuid: r.customer_uuid,
            customer_name: r.customer_name,
            customer_phone:
              r.customer_phone || undefined,
            customer_email:
              r.customer_email || undefined,
            project_id: r.project_uuid,
            project_name:
              r.project_name ||
              'Assigned Project',
            project_code:
              r.project_code || undefined,
            unit_id: r.unit_uuid,
            unit_type: r.unit_type || 'Apartment',
            unit_number:
              r.unit_number || undefined,
            floor: r.floor || undefined,
            size_sqft:
              Number(r.size_sqft) || undefined,
            total_price: grandTotal,
            booking_money:
              Number(r.paid_amount || 0) > 0
                ? Number(r.paid_amount)
                : Number(r.rate || 0),
            paid_amount: paidAmount,
            due_amount: dueAmount,
            payment_status: paymentStatus,
            handover_status:
              r.handover_status as HandoverStatus,
            booking_date: r.booking_date
              ? String(r.booking_date).slice(
                  0,
                  10,
                )
              : String(r.created_at).slice(0, 10),
            possession_date: r.possession_date
              ? String(r.possession_date).slice(
                  0,
                  10,
                )
              : undefined,
            dlp_start_date: r.dlp_start_date
              ? String(r.dlp_start_date).slice(
                  0,
                  10,
                )
              : undefined,
            dlp_expiry_date: r.dlp_expiry_date
              ? String(r.dlp_expiry_date).slice(
                  0,
                  10,
                )
              : undefined,
            key_register_no:
              r.key_register_no || undefined,
            possession_cert_no:
              r.possession_cert_no || undefined,
            total_snags_reported: snagsReported,
            total_snags_resolved: snagsResolved,
            open_snags: openSnags,
            created_at: r.created_at,
            updated_at: r.updated_at,
          };
        });

      const total = Number(filteredTotal || 0);
      const totalPages =
        Math.ceil(total / limit) || 1;

      return {
        success: true,
        data: {
          items,
          tab_counts: {
            all: Number(tabCounts.all || 0),
            snagging: Number(
              tabCounts.snagging || 0,
            ),
            dlp: Number(tabCounts.dlp || 0),
            handedover: Number(
              tabCounts.handedover || 0,
            ),
            under_construction: Number(
              tabCounts.under_construction || 0,
            ),
          },
          meta: {
            total,
            page,
            limit,
            total_pages: totalPages,
            has_next_page: page < totalPages,
            has_previous_page: page > 1,
          },
        },
      };
    } catch (err: any) {
      this.logger.error(
        `Error querying portfolio bookings: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * 3. GET /dropdown/meta
   * Dynamic lists for projects, handover statuses, and unit types
   */
  async getDropdownMeta(user?: any): Promise<{
    success: boolean;
    data: {
      projects: Array<{
        id: number;
        uuid: string;
        name: string;
        code?: string;
      }>;
      handover_statuses: Array<{
        value: string;
        label: string;
      }>;
      unit_types: Array<{
        value: string;
        label: string;
      }>;
    };
  }> {
    const projects =
      await this.projectModel.findAll({
        attributes: [
          'id',
          'uuid',
          'name',
          'code',
        ],
        order: [['name', 'ASC']],
      });

    return {
      success: true,
      data: {
        projects: projects.map((p) => ({
          id: Number(p.id),
          uuid: p.uuid,
          name: p.name,
          code: p.code,
        })),
        handover_statuses: [
          {
            value:
              HandoverStatus.UNDER_CONSTRUCTION,
            label: 'Under Construction',
          },
          {
            value:
              HandoverStatus.READY_FOR_SNAGGING,
            label: 'Ready for Joint Snagging',
          },
          {
            value: HandoverStatus.DLP_ACTIVE,
            label: 'DLP Active (2-Year Warranty)',
          },
          {
            value: HandoverStatus.HANDED_OVER,
            label: 'Fully Handed Over',
          },
        ],
        unit_types: [
          {
            value: 'Apartment',
            label: 'Residential Apartment',
          },
          {
            value: 'Commercial Flat',
            label: 'Commercial Space / Office',
          },
          { value: 'Plot', label: 'Land Plot' },
          {
            value: 'Parking',
            label: 'Parking Bay',
          },
        ],
      },
    };
  }

  /**
   * 4. GET /:uuid
   * Complete Booking 360 view by UUID
   */
  async getBooking360(
    uuid: string,
    user?: any,
  ): Promise<{
    success: boolean;
    data: Booking360Detail;
  }> {
    const ctx = extractUserContext(user);
    const booking =
      await this.bookingModel.findOne({
        where: { uuid },
      });

    if (!booking) {
      throw new NotFoundException(
        `Booking with UUID "${uuid}" not found`,
      );
    }

    if (!ctx.isSuperAdmin && ctx.orgId) {
      const [creatorUser] =
        await this.sequelize.query<{
          id: string;
        }>(
          `SELECT id FROM sys_users WHERE id::text = :createdBy AND org_id = :orgId`,
          {
            replacements: {
              createdBy: booking.createdBy,
              orgId: ctx.orgId,
            },
            type: QueryTypes.SELECT,
          },
        );
      if (!creatorUser) {
        throw new NotFoundException(
          `Booking with UUID "${uuid}" not found`,
        );
      }
    }

    if (booking.projectId) {
      const proj =
        await this.projectModel.findOne({
          where: {
            uuid: booking.projectId,
          } as any,
          attributes: [
            'id',
            'uuid',
            'name',
            'code',
          ],
        });
      if (proj) {
        (booking as any).project = proj;
      }
    }

    if (booking.flatLandId) {
      const flat =
        await this.flatLandModel.findOne({
          where: {
            uuid: booking.flatLandId,
          } as any,
        });
      if (flat) {
        (booking as any).flatLand = flat;
      }
    }

    // Handover record
    const handover =
      await this.handoverModel.findOne({
        where: { bookingId: uuid },
      });

    // Customer profile matching
    const customer =
      await this.customerProfileModel.findOne({
        where: this.sequelize.where(
          this.sequelize.fn(
            'LOWER',
            this.sequelize.fn(
              'TRIM',
              this.sequelize.col('customer_name'),
            ),
          ),
          booking.customerName
            .toLowerCase()
            .trim(),
        ),
      });

    // Sale agreement & installment history
    const agreement =
      await this.saleAgreementModel.findOne({
        attributes: [
          'id',
          'uuid',
          'agreement_number',
          'customer_name',
          'customer_phone',
          'property_type',
          'unit_identifier',
          'total_price',
          'status',
        ],
        where: this.sequelize.where(
          this.sequelize.fn(
            'LOWER',
            this.sequelize.fn(
              'TRIM',
              this.sequelize.col('customer_name'),
            ),
          ),
          booking.customerName
            .toLowerCase()
            .trim(),
        ),
      });

    if (agreement) {
      const plans =
        await this.installmentPlanModel.findAll({
          where: {
            sale_agreement_id: agreement.id,
          } as any,
          order: [['installment_no', 'ASC']],
        });
      (agreement as any).installment_plans =
        plans;
    }

    const grandTotal = Number(
      booking.grandTotal || 0,
    );
    const paid = Number(booking.paid || 0);
    const due = Number(booking.due || 0);

    const snagsReported = Number(
      handover?.totalSnagsReported || 0,
    );
    const snagsResolved = Number(
      handover?.totalSnagsResolved || 0,
    );
    const openSnags = Math.max(
      0,
      snagsReported - snagsResolved,
    );

    const milestones =
      agreement?.installment_plans?.map(
        (inst) => ({
          installment_no: Number(
            inst.installment_no || 0,
          ),
          title:
            inst.title ||
            `Installment #${inst.installment_no}`,
          due_date: String(inst.due_date || ''),
          payable_amount: Number(
            inst.payable_amount || 0,
          ),
          paid_amount: Number(
            inst.paid_amount || 0,
          ),
          due_amount: Number(
            inst.due_amount || 0,
          ),
          status: inst.status || 'unpaid',
        }),
      ) || [];

    const detail: Booking360Detail = {
      booking: {
        id: booking.code || `BK-${booking.id}`,
        uuid: booking.uuid,
        code: booking.code,
        booking_date: booking.bookingDate
          ? String(booking.bookingDate).slice(
              0,
              10,
            )
          : '',
        sales_by: booking.salesBy || undefined,
        status: booking.status || 'Active',
        rate: Number(booking.rate || 0),
        subtotal: Number(booking.subtotal || 0),
        other_cost: Number(
          booking.otherCost || 0,
        ),
        parking: Number(booking.parking || 0),
        utility_charge: Number(
          booking.utilityCharge || 0,
        ),
        discount: Number(booking.discount || 0),
        grand_total: grandTotal,
        paid,
        due,
        payment_status:
          due <= 0 && paid > 0
            ? 'Paid'
            : paid > 0
              ? 'Partial'
              : 'Due',
        attachment:
          booking.attachment || undefined,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
      },
      unit: {
        unit_id: booking.flatLand?.uuid,
        unit_number:
          booking.flatLand?.flatLandNo ||
          undefined,
        unit_type:
          booking.flatLand?.propertyType ||
          'Apartment',
        floor:
          booking.flatLand?.unit || undefined,
        size_sqft:
          Number(booking.flatLand?.size) ||
          undefined,
        bedroom: booking.flatLand?.bedroom,
        bathroom: booking.flatLand?.bathroom,
        facing:
          booking.flatLand?.facing || undefined,
        amenities:
          booking.flatLand?.amenities ||
          undefined,
        drawing:
          booking.flatLand?.drawing || undefined,
        dining:
          booking.flatLand?.dining || undefined,
        kitchen:
          booking.flatLand?.kitchen || undefined,
        balcony:
          booking.flatLand?.balcony || undefined,
        parking:
          booking.flatLand?.parking || undefined,
        basement:
          booking.flatLand?.basement || undefined,
        status: booking.flatLand?.status,
      },
      project: {
        id: booking.project?.id
          ? Number(booking.project.id)
          : undefined,
        uuid: booking.project?.uuid,
        code: booking.project?.code || undefined,
        name:
          booking.project?.name ||
          'Assigned Project',
        project_type:
          booking.project?.projectType ||
          undefined,
        location:
          booking.project?.location || undefined,
        description:
          booking.project?.description ||
          undefined,
      },
      customer: {
        customer_id:
          customer?.customerCode ||
          `CUST-${customer?.id || booking.id}`,
        customer_uuid: customer?.uuid,
        customer_name: booking.customerName,
        customer_phone: customer?.phoneNumber,
        customer_email: customer?.email,
        customer_address: customer?.address,
        nid_number: customer?.nidNumber,
        tin_number: customer?.tinNumber,
        nominee_name: customer?.nomineeName,
        nominee_relation:
          customer?.nomineeRelation,
      },
      handover: {
        handover_status:
          handover?.handoverStatus ||
          HandoverStatus.UNDER_CONSTRUCTION,
        possession_date: handover?.possessionDate
          ? String(handover.possessionDate).slice(
              0,
              10,
            )
          : undefined,
        dlp_start_date: handover?.dlpStartDate
          ? String(handover.dlpStartDate).slice(
              0,
              10,
            )
          : undefined,
        dlp_expiry_date: handover?.dlpExpiryDate
          ? String(handover.dlpExpiryDate).slice(
              0,
              10,
            )
          : undefined,
        key_register_no:
          handover?.keyRegisterNo || undefined,
        possession_cert_no:
          handover?.possessionCertNo || undefined,
        total_snags_reported: snagsReported,
        total_snags_resolved: snagsResolved,
        open_snags: openSnags,
        remarks: handover?.remarks || undefined,
      },
      cost_breakdown: {
        rate: Number(booking.rate || 0),
        subtotal: Number(booking.subtotal || 0),
        parking: Number(booking.parking || 0),
        utility_charge: Number(
          booking.utilityCharge || 0,
        ),
        other_cost: Number(
          booking.otherCost || 0,
        ),
        discount: Number(booking.discount || 0),
        grand_total: grandTotal,
        paid_amount: paid,
        due_amount: due,
      },
      milestone_history: milestones,
      snag_summary: {
        total_snags_reported: snagsReported,
        total_snags_resolved: snagsResolved,
        open_snags: openSnags,
      },
    };

    return {
      success: true,
      data: detail,
    };
  }

  /**
   * 5. PATCH /:uuid/handover-status
   * Strict state machine transition inside DB transaction with row lock
   */
  async updateHandoverStatus(
    uuid: string,
    dto: UpdateHandoverStatusDto,
    user?: any,
  ): Promise<{
    success: boolean;
    message: string;
    data: CsBookingHandover;
  }> {
    const ctx = extractUserContext(user);
    return this.sequelize.transaction(
      async (transaction: Transaction) => {
        // Find booking first
        const booking =
          await this.bookingModel.findOne({
            where: { uuid },
            transaction,
          });

        if (!booking) {
          throw new NotFoundException(
            `Booking with UUID "${uuid}" not found`,
          );
        }

        // Find or lock existing handover record
        let handover =
          await this.handoverModel.findOne({
            where: { bookingId: uuid },
            lock: Transaction.LOCK.UPDATE,
            transaction,
          });

        if (
          handover &&
          !ctx.isSuperAdmin &&
          ctx.orgId &&
          handover.organizationId &&
          Number(handover.organizationId) !==
            Number(ctx.orgId)
        ) {
          throw new NotFoundException(
            `Booking with UUID "${uuid}" not found`,
          );
        }

        const currentStatus =
          handover?.handoverStatus ||
          HandoverStatus.UNDER_CONSTRUCTION;
        const targetStatus = dto.handover_status;

        // 1. Verify state machine transition
        if (currentStatus !== targetStatus) {
          const allowedNext =
            ALLOWED_TRANSITIONS[currentStatus] ||
            [];
          if (
            !allowedNext.includes(targetStatus)
          ) {
            throw new BadRequestException(
              `Invalid handover status transition from "${currentStatus}" to "${targetStatus}". Allowed next step: ${
                allowedNext.join(', ') ||
                'None (terminal state)'
              }`,
            );
          }
        }

        // Calculate snags
        const totalReported =
          dto.total_snags_reported !== undefined
            ? dto.total_snags_reported
            : handover?.totalSnagsReported || 0;
        const totalResolved =
          dto.total_snags_resolved !== undefined
            ? dto.total_snags_resolved
            : handover?.totalSnagsResolved || 0;
        const openSnags = Math.max(
          0,
          totalReported - totalResolved,
        );

        // 2. Validate prerequisites for DLP Active (the official handover step)
        if (
          targetStatus ===
          HandoverStatus.DLP_ACTIVE
        ) {
          const possessionDate =
            dto.possession_date ||
            handover?.possessionDate;
          if (!possessionDate) {
            throw new BadRequestException(
              'possession_date is required when transitioning to DLP Active',
            );
          }

          if (openSnags > 0) {
            throw new BadRequestException(
              `Cannot transition to DLP Active with ${openSnags} unresolved snags. Please resolve all snags first.`,
            );
          }
        }

        // 3. Compute DLP dates if moving to DLP Active
        let dlpStartDate =
          dto.possession_date ||
          handover?.possessionDate;
        let dlpExpiryDate =
          dto.dlp_expiry_date ||
          handover?.dlpExpiryDate;

        if (
          targetStatus ===
            HandoverStatus.DLP_ACTIVE &&
          dlpStartDate &&
          !dlpExpiryDate
        ) {
          const computed = computeDlpDates(
            dlpStartDate,
            2,
          );
          dlpStartDate = computed.dlpStartDate;
          dlpExpiryDate = computed.dlpExpiryDate;
        }

        // 4. Find linked customer profile ID if available
        const customer =
          await this.customerProfileModel.findOne(
            {
              where: this.sequelize.where(
                this.sequelize.fn(
                  'LOWER',
                  this.sequelize.fn(
                    'TRIM',
                    this.sequelize.col(
                      'customer_name',
                    ),
                  ),
                ),
                booking.customerName
                  .toLowerCase()
                  .trim(),
              ),
              attributes: ['id'],
              transaction,
            },
          );

        // 5. Upsert handover record
        if (!handover) {
          handover =
            await this.handoverModel.create(
              {
                bookingId: uuid,
                customerProfileId: customer?.id
                  ? Number(customer.id)
                  : undefined,
                organizationId:
                  ctx.orgId || undefined,
                projectId:
                  booking.projectId || undefined,
                handoverStatus: targetStatus,
                possessionDate:
                  dto.possession_date,
                dlpStartDate,
                dlpExpiryDate,
                keyRegisterNo:
                  dto.key_register_no,
                possessionCertNo:
                  dto.possession_cert_no,
                totalSnagsReported: totalReported,
                totalSnagsResolved: totalResolved,
                remarks: dto.remarks,
                createdBy: ctx.userId,
                updatedBy: ctx.userId,
              },
              { transaction },
            );
        } else {
          await handover.update(
            {
              customerProfileId: customer?.id
                ? Number(customer.id)
                : handover.customerProfileId,
              organizationId:
                handover.organizationId ||
                ctx.orgId ||
                undefined,
              projectId:
                handover.projectId ||
                booking.projectId ||
                undefined,
              handoverStatus: targetStatus,
              possessionDate:
                dto.possession_date ||
                handover.possessionDate,
              dlpStartDate:
                dlpStartDate ||
                handover.dlpStartDate,
              dlpExpiryDate:
                dlpExpiryDate ||
                handover.dlpExpiryDate,
              keyRegisterNo:
                dto.key_register_no ||
                handover.keyRegisterNo,
              possessionCertNo:
                dto.possession_cert_no ||
                handover.possessionCertNo,
              totalSnagsReported: totalReported,
              totalSnagsResolved: totalResolved,
              remarks:
                dto.remarks || handover.remarks,
              updatedBy: ctx.userId,
            },
            { transaction },
          );
        }

        // 6. Audit & Notification
        this.logger.log(
          `[AUDIT] Booking ${booking.code} (${uuid}) handover status transitioned: ${currentStatus} -> ${targetStatus} by User ${ctx.userId || 'System'}`,
        );

        if (ctx.userId) {
          try {
            await this.notificationModel.create(
              {
                title: `Handover Status: ${booking.code}`,
                message: `Booking ${booking.code} transitioned to ${targetStatus}`,
                userId: ctx.userId,
                isRead: false,
                data: {
                  booking_uuid: uuid,
                  previous_status: currentStatus,
                  new_status: targetStatus,
                  timestamp:
                    new Date().toISOString(),
                },
              },
              { transaction },
            );
          } catch (notifErr: any) {
            this.logger.warn(
              `Could not emit database notification: ${notifErr.message}`,
            );
          }
        }

        return {
          success: true,
          message: `Handover status for booking ${booking.code} successfully updated to ${targetStatus}`,
          data: handover,
        };
      },
    );
  }

  /**
   * 6. GET /:uuid/demand-letter-preview
   * Instant milestone and bank payment instructions for Demand Letter generation
   */
  async getDemandLetterPreview(
    uuid: string,
    user?: any,
  ): Promise<{
    success: boolean;
    data: DemandLetterPreview;
  }> {
    const ctx = extractUserContext(user);
    const booking =
      await this.bookingModel.findOne({
        where: { uuid },
      });

    if (!booking) {
      throw new NotFoundException(
        `Booking with UUID "${uuid}" not found`,
      );
    }

    if (!ctx.isSuperAdmin && ctx.orgId) {
      const [creatorUser] =
        await this.sequelize.query<{
          id: string;
        }>(
          `SELECT id FROM sys_users WHERE id::text = :createdBy AND org_id = :orgId`,
          {
            replacements: {
              createdBy: booking.createdBy,
              orgId: ctx.orgId,
            },
            type: QueryTypes.SELECT,
          },
        );
      if (!creatorUser) {
        throw new NotFoundException(
          `Booking with UUID "${uuid}" not found`,
        );
      }
    }

    if (booking.projectId) {
      const proj =
        await this.projectModel.findOne({
          where: {
            uuid: booking.projectId,
          } as any,
          attributes: [
            'id',
            'uuid',
            'name',
            'code',
          ],
        });
      if (proj) {
        (booking as any).project = proj;
      }
    }

    if (booking.flatLandId) {
      const flat =
        await this.flatLandModel.findOne({
          where: {
            uuid: booking.flatLandId,
          } as any,
        });
      if (flat) {
        (booking as any).flatLand = flat;
      }
    }

    const customer =
      await this.customerProfileModel.findOne({
        where: this.sequelize.where(
          this.sequelize.fn(
            'LOWER',
            this.sequelize.fn(
              'TRIM',
              this.sequelize.col('customer_name'),
            ),
          ),
          booking.customerName
            .toLowerCase()
            .trim(),
        ),
      });

    // Look for real installment schedule
    const agreement =
      await this.saleAgreementModel.findOne({
        attributes: [
          'id',
          'uuid',
          'agreement_number',
          'customer_name',
          'customer_phone',
          'property_type',
          'unit_identifier',
          'total_price',
          'status',
        ],
        where: this.sequelize.where(
          this.sequelize.fn(
            'LOWER',
            this.sequelize.fn(
              'TRIM',
              this.sequelize.col('customer_name'),
            ),
          ),
          booking.customerName
            .toLowerCase()
            .trim(),
        ),
      });

    if (agreement) {
      const plans =
        await this.installmentPlanModel.findAll({
          where: {
            sale_agreement_id: agreement.id,
          } as any,
          order: [['installment_no', 'ASC']],
        });
      (agreement as any).installment_plans =
        plans;
    }

    // Find next unpaid or overdue milestone
    const today = new Date()
      .toISOString()
      .slice(0, 10);
    const activeMilestone =
      agreement?.installment_plans?.find(
        (inst) =>
          (inst.status || '').toLowerCase() !==
            'paid' &&
          Number(inst.due_amount || 0) > 0,
      );

    const grandTotal = Number(
      booking.grandTotal || 0,
    );
    const totalPaid = Number(booking.paid || 0);
    const totalDue = Number(booking.due || 0);

    const refNumber = `DL-${booking.code}-${activeMilestone ? `MS${String(activeMilestone.installment_no).padStart(2, '0')}` : 'BAL'}-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}`;

    const preview: DemandLetterPreview = {
      booking_code: booking.code,
      booking_uuid: booking.uuid,
      customer_name: booking.customerName,
      customer_phone: customer?.phoneNumber,
      project_name:
        booking.project?.name ||
        'Assigned Project',
      unit_number:
        booking.flatLand?.flatLandNo || undefined,
      demand_letter_reference: refNumber,
      generation_date: today,
      current_milestone: activeMilestone
        ? {
            installment_no: Number(
              activeMilestone.installment_no,
            ),
            title:
              activeMilestone.title ||
              `Installment #${activeMilestone.installment_no}`,
            due_date: String(
              activeMilestone.due_date || '',
            ),
            payable_amount: Number(
              activeMilestone.payable_amount || 0,
            ),
            paid_amount: Number(
              activeMilestone.paid_amount || 0,
            ),
            due_amount: Number(
              activeMilestone.due_amount || 0,
            ),
            is_overdue:
              String(
                activeMilestone.due_date || '',
              ) < today,
          }
        : {
            title:
              'Current Outstanding Property Balance Demand',
            payable_amount: totalDue,
            paid_amount: 0,
            due_amount: totalDue,
            is_overdue: totalDue > 0,
          },
      financial_summary: {
        grand_total: grandTotal,
        total_paid: totalPaid,
        total_due: totalDue,
      },
      bank_instructions: {
        bank_name:
          'Mutual Trust Bank Limited (MTBL)',
        account_name:
          'RealBiz Pro Real Estate Dev Ltd.',
        account_number: '0021-0210034567',
        branch_name:
          'Gulshan Corporate Branch, Dhaka',
        routing_number: '145260844',
        payment_methods: [
          'Bank Deposit',
          'BEFTN / RTGS',
          'Corporate Cheque / Pay Order',
          'Direct Wire',
        ],
      },
    };

    return {
      success: true,
      data: preview,
    };
  }
}
