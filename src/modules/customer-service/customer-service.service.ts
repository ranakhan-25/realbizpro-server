import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Op,
  QueryTypes,
  WhereOptions,
} from 'sequelize';
import {
  CsCustomerProfile,
  CustomerProfileStatus,
} from 'src/database/models/customer-service/cs_customer_profile.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { CrSaleAgreement } from 'src/database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPayment } from 'src/database/models/credit-realization/cr_installment_payment.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { CreateCustomerProfileDto } from './dto/create-customer-profile.dto';
import { QueryCustomerProfileDto } from './dto/query-customer-profile.dto';
import { UpdateCustomerProfileDto } from './dto/update-customer-profile.dto';
import { extractUserContext } from './common/customer-service-context.helper';

// Pure mapper functions for strict snake_case responses
export function toSnakeCaseCustomerItem(
  profile: CsCustomerProfile,
  stats: {
    count: number;
    paid: number;
    due: number;
  },
) {
  return {
    id:
      profile.customerCode ||
      `CUST-${profile.id}`,
    uuid: profile.uuid,
    customer_code:
      profile.customerCode ||
      `CUST-${profile.id}`,
    customer_name: profile.customerName,
    phone_number: profile.phoneNumber,
    email: profile.email || 'N/A',
    nid_number: profile.nidNumber,
    tin_number: profile.tinNumber || undefined,
    address:
      profile.address || 'Dhaka, Bangladesh',
    nominee_name:
      profile.nomineeName || 'Unspecified',
    nominee_relation:
      profile.nomineeRelation || 'Spouse',
    nominee_nid: profile.nomineeNid || 'N/A',
    customer_status: profile.customerStatus,
    total_bookings:
      stats.count > 0 ? stats.count : 1,
    total_paid_amount: stats.paid,
    total_due_amount: stats.due,
    joined_date: profile.joinedDate
      ? String(profile.joinedDate)
      : String(profile.createdAt).slice(0, 10),
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
    deleted_at: profile.deletedAt || null,
  };
}

export function toSnakeCaseCustomerStats(data: {
  totalClients: number;
  vipClients: number;
  activeClients?: number;
  disputedClients?: number;
  deletedClients?: number;
  totalLifetimeCollections: number;
  totalLifetimeCollectionsFormatted: string;
}) {
  return {
    total_clients: data.totalClients,
    vip_clients: data.vipClients,
    active_clients:
      data.activeClients ??
      Math.max(
        0,
        data.totalClients - data.vipClients,
      ),
    disputed_clients: data.disputedClients ?? 0,
    deleted_clients: data.deletedClients ?? 0,
    total_lifetime_collections:
      data.totalLifetimeCollections,
    total_lifetime_collections_formatted:
      data.totalLifetimeCollectionsFormatted,
  };
}

export function toSnakeCaseCustomerDetail(
  customer: CsCustomerProfile,
  bookings: any[],
  financialSummary: {
    totalPaid: number;
    totalDue: number;
    count: number;
  },
) {
  return {
    profile: {
      id:
        customer.customerCode ||
        `CUST-${customer.id}`,
      uuid: customer.uuid,
      customer_code:
        customer.customerCode ||
        `CUST-${customer.id}`,
      customer_name: customer.customerName,
      phone_number: customer.phoneNumber,
      email: customer.email || 'N/A',
      nid_number: customer.nidNumber,
      tin_number:
        customer.tinNumber || 'Not Provided',
      address:
        customer.address || 'Dhaka, Bangladesh',
      customer_status: customer.customerStatus,
      joined_date: customer.joinedDate
        ? String(customer.joinedDate)
        : String(customer.createdAt).slice(0, 10),
      created_at: customer.createdAt,
      updated_at: customer.updatedAt,
    },
    kyc: {
      verified: true,
      nid_number: customer.nidNumber,
      tin_number:
        customer.tinNumber || 'Not Provided',
      primary_phone: customer.phoneNumber,
      email: customer.email || 'N/A',
      mailing_address:
        customer.address || 'Dhaka, Bangladesh',
    },
    nominee: {
      nominee_name:
        customer.nomineeName || 'Unspecified',
      nominee_relation:
        customer.nomineeRelation || 'Spouse',
      nominee_nid:
        customer.nomineeNid || 'Not Provided',
    },
    financial_summary: {
      total_paid_amount:
        financialSummary.totalPaid,
      total_due_amount: financialSummary.totalDue,
      total_bookings:
        financialSummary.count > 0
          ? financialSummary.count
          : 1,
    },
    bookings: bookings.map((b) => ({
      booking_id: b.code || `BK-${b.id}`,
      uuid: b.uuid,
      project_name:
        b.project?.name || 'Assigned Project',
      booking_date: b.bookingDate,
      grand_total: Number(b.grandTotal || 0),
      paid_amount: Number(b.paid || 0),
      due_amount: Number(b.due || 0),
      status: b.status || 'Active',
    })),
  };
}

@Injectable()
export class CustomerServiceService {
  private readonly logger = new Logger(
    CustomerServiceService.name,
  );

  constructor(
    @InjectModel(CsCustomerProfile)
    private readonly customerProfileModel: typeof CsCustomerProfile,
    @InjectModel(FlatLandBooking)
    private readonly flatLandBookingModel: typeof FlatLandBooking,
    @InjectModel(CrSaleAgreement)
    private readonly crSaleAgreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPayment)
    private readonly crInstallmentPaymentModel: typeof CrInstallmentPayment,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  /**
   * Find paginated customers with snake_case response and N+1 prevention
   */
  async findCustomers(
    query: QueryCustomerProfileDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(
      100,
      Math.max(1, query.limit || 10),
    );
    const offset = query.getOffset();
    const search = query.search?.trim();
    const status = query.status
      ?.trim()
      .toLowerCase();
    const isDeleted =
      query.is_deleted === true ||
      String(query.is_deleted) === 'true';

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const rawProjectId = query.project_id || query.projectId;
    if (rawProjectId && rawProjectId !== 'all') {
      let pUuid = rawProjectId.trim();
      if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
        const proj = await this.projectModel.findByPk(Number(pUuid), {
          attributes: ['uuid'],
        });
        pUuid = proj ? proj.uuid : '00000000-0000-0000-0000-000000000000';
      } else if (!/^[0-9a-fA-F-]{36}$/.test(pUuid)) {
        pUuid = '00000000-0000-0000-0000-000000000000';
      }
      where.projectId = pUuid;
    }

    if (isDeleted) {
      where.deletedAt = { [Op.ne]: null };
    }

    if (status && status !== 'all') {
      where.customerStatus = status;
    }

    if (search) {
      where[Op.or] = [
        {
          customerName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          phoneNumber: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          nidNumber: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          nomineeName: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          customerCode: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    const sortField =
      query.sort_by === 'customer_name'
        ? 'customerName'
        : 'createdAt';
    const sortOrder =
      (
        query.sort_order || 'desc'
      ).toUpperCase() === 'ASC'
        ? 'ASC'
        : 'DESC';

    try {
      const { rows, count } =
        await this.customerProfileModel.findAndCountAll(
          {
            where,
            attributes: [
              'id',
              'uuid',
              'customerCode',
              'customerName',
              'phoneNumber',
              'email',
              'nidNumber',
              'tinNumber',
              'address',
              'nomineeName',
              'nomineeRelation',
              'nomineeNid',
              'customerStatus',
              'joinedDate',
              'createdAt',
              'updatedAt',
              'deletedAt',
            ],
            order: [[sortField, sortOrder]],
            limit,
            offset,
            paranoid: !isDeleted,
          },
        );

      // Batch query bookings to aggregate financial numbers without N+1 queries
      const customerNames = rows
        .map((r) => r.customerName)
        .filter(Boolean);
      const bookingsByCustomer: Record<
        string,
        {
          count: number;
          paid: number;
          due: number;
        }
      > = {};

      if (customerNames.length > 0) {
        const bookings =
          await this.flatLandBookingModel.findAll(
            {
              where: {
                customerName: {
                  [Op.in]: customerNames,
                },
              },
              attributes: [
                'customerName',
                'paid',
                'due',
                'grandTotal',
              ],
            },
          );

        for (const b of bookings) {
          const key = (b.customerName || '')
            .toLowerCase()
            .trim();
          if (!bookingsByCustomer[key]) {
            bookingsByCustomer[key] = {
              count: 0,
              paid: 0,
              due: 0,
            };
          }
          bookingsByCustomer[key].count += 1;
          bookingsByCustomer[key].paid += Number(
            b.paid || 0,
          );
          bookingsByCustomer[key].due += Number(
            b.due || 0,
          );
        }
      }

      const items = rows.map((profile) => {
        const key = (profile.customerName || '')
          .toLowerCase()
          .trim();
        const stats = bookingsByCustomer[key] || {
          count: 0,
          paid: 0,
          due: 0,
        };
        return toSnakeCaseCustomerItem(
          profile,
          stats,
        );
      });

      return {
        items,
        meta: query.getPaginationMetadata(count),
      };
    } catch (err: any) {
      this.logger.error(
        `Error querying customer profiles: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Summary KPI metrics for Customer 360 overview (snake_case response)
   * High-performance single-roundtrip aggregation query with Promise.all
   */
  async getCustomerStats(projectId?: string, user?: any) {
    const ctx = extractUserContext(user);
    try {
      const extraFilters: string[] = [];
      const replacements: Record<string, any> = {};

      if (!ctx.isSuperAdmin && ctx.orgId) {
        extraFilters.push(`AND "organization_id" = :orgId`);
        replacements.orgId = ctx.orgId;
      }
      let pUuid = projectId && projectId !== 'all' ? projectId.trim() : null;
      if (pUuid) {
        if (!/^[0-9a-fA-F-]{36}$/.test(pUuid) && !isNaN(Number(pUuid))) {
          const proj = await this.projectModel.findByPk(Number(pUuid), {
            attributes: ['uuid'],
          });
          pUuid = proj ? proj.uuid : '00000000-0000-0000-0000-000000000000';
        } else if (!/^[0-9a-fA-F-]{36}$/.test(pUuid)) {
          pUuid = '00000000-0000-0000-0000-000000000000';
        }
      }
      if (pUuid) {
        extraFilters.push(`AND "project_id" = :projectId`);
        replacements.projectId = pUuid;
      }
      const filterSql = extraFilters.join(' ');

      const bookingWhere: any = {};
      if (pUuid) {
        bookingWhere.projectId = pUuid;
      }

      const [
        countsResult,
        totalBookingPaid,
        totalInstallmentPaid,
      ] = await Promise.all([
        this.customerProfileModel.sequelize.query<{
          totalClients: number;
          vipClients: number;
          activeClients: number;
          disputedClients: number;
          deletedClients: number;
        }>(
          `
            SELECT
              COUNT(*) FILTER (WHERE "deleted_at" IS NULL ${filterSql})::int AS "totalClients",
              COUNT(*) FILTER (WHERE "deleted_at" IS NULL AND "customer_status" = 'vip' ${filterSql})::int AS "vipClients",
              COUNT(*) FILTER (WHERE "deleted_at" IS NULL AND "customer_status" = 'active' ${filterSql})::int AS "activeClients",
              COUNT(*) FILTER (WHERE "deleted_at" IS NULL AND "customer_status" = 'disputed' ${filterSql})::int AS "disputedClients",
              COUNT(*) FILTER (WHERE "deleted_at" IS NOT NULL ${filterSql})::int AS "deletedClients"
            FROM "cs_customer_profiles"
            `,
          {
            replacements,
            type: QueryTypes.SELECT,
          },
        ),
        this.flatLandBookingModel
          .sum('paid', { where: bookingWhere })
          .then((val) => Number(val || 0)),
        this.crInstallmentPaymentModel
          .sum('paid_amount')
          .then((val) => Number(val || 0)),
      ]);

      const counts = countsResult[0] || {
        totalClients: 0,
        vipClients: 0,
        activeClients: 0,
        disputedClients: 0,
        deletedClients: 0,
      };

      const totalClients = Number(
        counts.totalClients || 0,
      );
      const vipClients = Number(
        counts.vipClients || 0,
      );
      const activeClients = Number(
        counts.activeClients || 0,
      );
      const disputedClients = Number(
        counts.disputedClients || 0,
      );
      const deletedClients = Number(
        counts.deletedClients || 0,
      );

      const totalLifetimeCollections =
        totalBookingPaid + totalInstallmentPaid;

      let totalLifetimeCollectionsFormatted =
        '৳ 0.00';
      if (totalLifetimeCollections >= 10000000) {
        totalLifetimeCollectionsFormatted = `৳ ${(totalLifetimeCollections / 10000000).toFixed(2)} Cr`;
      } else if (
        totalLifetimeCollections >= 100000
      ) {
        totalLifetimeCollectionsFormatted = `৳ ${(totalLifetimeCollections / 100000).toFixed(1)} Lac`;
      } else {
        totalLifetimeCollectionsFormatted = `৳ ${totalLifetimeCollections.toLocaleString()}`;
      }

      return toSnakeCaseCustomerStats({
        totalClients,
        vipClients,
        activeClients,
        disputedClients,
        deletedClients,
        totalLifetimeCollections,
        totalLifetimeCollectionsFormatted,
      });
    } catch (err: any) {
      this.logger.error(
        `Error calculating customer stats: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * Complete 360 profile by UUID (snake_case response)
   */
  async getCustomer360Profile(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const customer =
      await this.customerProfileModel.findOne({
        where,
      });

    if (!customer) {
      throw new NotFoundException(
        `Customer profile with UUID "${uuid}" not found`,
      );
    }

    // Fetch related bookings
    const bookings =
      await this.flatLandBookingModel.findAll({
        where: {
          customerName: {
            [Op.iLike]: `%${customer.customerName}%`,
          },
        },
        order: [['bookingDate', 'DESC']],
      });

    const projectUuids = [
      ...new Set(
        bookings
          .map((b) => b.projectId)
          .filter(Boolean),
      ),
    ];
    if (projectUuids.length > 0) {
      const projects = await this.projectModel.findAll({
        where: {
          uuid: {
            [Op.in]: projectUuids,
          },
        } as any,
        attributes: [
          'id',
          'uuid',
          'name',
          'code',
        ],
      });
      const projectMap = new Map(
        projects.map((p) => [p.uuid, p]),
      );
      for (const b of bookings) {
        if (b.projectId && projectMap.has(b.projectId)) {
          (b as any).project = projectMap.get(b.projectId);
        }
      }
    }

    const totalPaid = bookings.reduce(
      (sum, b) => sum + Number(b.paid || 0),
      0,
    );
    const totalDue = bookings.reduce(
      (sum, b) => sum + Number(b.due || 0),
      0,
    );

    return toSnakeCaseCustomerDetail(
      customer,
      bookings,
      {
        totalPaid,
        totalDue,
        count: bookings.length,
      },
    );
  }

  /**
   * Create new customer profile using snake_case DTO
   */
  async createCustomerProfile(
    dto: CreateCustomerProfileDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const phone = dto.phone_number.trim();
    const nid = dto.nid_number.trim();

    // Check if phone or NID already exists within current organization
    const existingWhere: any = {
      [Op.or]: [
        { phoneNumber: phone },
        { nidNumber: nid },
      ],
    };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      existingWhere.organizationId = ctx.orgId;
    }

    const existing =
      await this.customerProfileModel.findOne({
        where: existingWhere,
      });

    if (existing) {
      if (existing.phoneNumber === phone) {
        throw new ConflictException(
          `Customer with phone number "${phone}" already exists`,
        );
      }
      if (existing.nidNumber === nid) {
        throw new ConflictException(
          `Customer with NID "${nid}" already exists`,
        );
      }
    }

    const profile =
      await this.customerProfileModel.create({
        customerName: dto.customer_name.trim(),
        phoneNumber: phone,
        nidNumber: nid,
        email: dto.email?.trim() || undefined,
        tinNumber:
          dto.tin_number?.trim() || undefined,
        address: dto.address?.trim() || undefined,
        nomineeName:
          dto.nominee_name?.trim() || undefined,
        nomineeRelation:
          dto.nominee_relation || 'Spouse',
        nomineeNid:
          dto.nominee_nid?.trim() || undefined,
        customerStatus:
          dto.customer_status ||
          CustomerProfileStatus.ACTIVE,
        partyId: dto.party_id,
        customerAccountId:
          dto.customer_account_id,
        organizationId: ctx.orgId || undefined,
        projectId: dto.project_id || dto.projectId || undefined,
        createdBy: ctx.userId,
      });

    return toSnakeCaseCustomerItem(profile, {
      count: 0,
      paid: 0,
      due: 0,
    });
  }

  /**
   * Update customer profile using snake_case DTO
   */
  async updateCustomerProfile(
    uuid: string,
    dto: UpdateCustomerProfileDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const profile =
      await this.customerProfileModel.findOne({
        where,
      });

    if (!profile) {
      throw new NotFoundException(
        `Customer profile "${uuid}" not found`,
      );
    }

    if (
      dto.phone_number &&
      dto.phone_number !== profile.phoneNumber
    ) {
      const phoneExistsWhere: any = {
        phoneNumber: dto.phone_number,
        uuid: { [Op.ne]: uuid },
      };
      if (!ctx.isSuperAdmin && ctx.orgId) {
        phoneExistsWhere.organizationId = ctx.orgId;
      }
      const phoneExists =
        await this.customerProfileModel.findOne({
          where: phoneExistsWhere,
        });
      if (phoneExists) {
        throw new ConflictException(
          `Phone "${dto.phone_number}" already in use`,
        );
      }
    }

    const updateData: any = {};
    if (dto.customer_name !== undefined)
      updateData.customerName =
        dto.customer_name.trim();
    if (dto.phone_number !== undefined)
      updateData.phoneNumber =
        dto.phone_number.trim();
    if (dto.nid_number !== undefined)
      updateData.nidNumber =
        dto.nid_number.trim();
    if (dto.email !== undefined)
      updateData.email =
        dto.email?.trim() || null;
    if (dto.tin_number !== undefined)
      updateData.tinNumber =
        dto.tin_number?.trim() || null;
    if (dto.address !== undefined)
      updateData.address =
        dto.address?.trim() || null;
    if (dto.nominee_name !== undefined)
      updateData.nomineeName =
        dto.nominee_name?.trim() || null;
    if (dto.nominee_relation !== undefined)
      updateData.nomineeRelation =
        dto.nominee_relation || 'Spouse';
    if (dto.nominee_nid !== undefined)
      updateData.nomineeNid =
        dto.nominee_nid?.trim() || null;
    if (dto.customer_status !== undefined)
      updateData.customerStatus =
        dto.customer_status;
    if (dto.party_id !== undefined)
      updateData.partyId = dto.party_id;
    if (dto.customer_account_id !== undefined)
      updateData.customerAccountId =
        dto.customer_account_id;
    if (dto.project_id !== undefined || dto.projectId !== undefined)
      updateData.projectId = dto.project_id || dto.projectId;
    updateData.updatedBy = ctx.userId;

    await profile.update(updateData);
    return toSnakeCaseCustomerItem(profile, {
      count: 0,
      paid: 0,
      due: 0,
    });
  }

  /**
   * Soft delete customer profile (sets deleted_by and deletes paranoid)
   */
  async removeCustomerProfile(
    uuid: string,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const profile =
      await this.customerProfileModel.findOne({
        where,
      });

    if (!profile) {
      throw new NotFoundException(
        `Customer profile "${uuid}" not found`,
      );
    }

    if (ctx.userId) {
      await profile.update({ deletedBy: ctx.userId });
    }
    await profile.destroy();

    return {
      message:
        'Customer profile deleted successfully',
    };
  }

  /**
   * Restore a soft-deleted customer profile
   */
  async restoreCustomerProfile(
    uuid: string,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const profile =
      await this.customerProfileModel.findOne({
        where,
        paranoid: false,
      });

    if (!profile) {
      throw new NotFoundException(
        `Customer profile "${uuid}" not found`,
      );
    }

    if (!profile.deletedAt) {
      throw new BadRequestException(
        `Customer profile "${uuid}" is not deleted`,
      );
    }

    await profile.restore();
    const updateData: {
      deletedBy: null;
      updatedBy?: number;
    } = {
      deletedBy: null,
    };
    if (ctx.userId) {
      updateData.updatedBy = ctx.userId;
    }
    await profile.update(updateData);

    return {
      message:
        'Customer profile restored successfully',
      data: toSnakeCaseCustomerItem(profile, {
        count: 0,
        paid: 0,
        due: 0,
      }),
    };
  }

  /**
   * Dropdown of real DB customers: [{ value, label, uuid }]
   */
  async getCustomersDropdown(search?: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (search && search.trim()) {
      const q = search.trim();
      where[Op.or] = [
        {
          customerName: { [Op.iLike]: `%${q}%` },
        },
        { phoneNumber: { [Op.iLike]: `%${q}%` } },
        {
          customerCode: { [Op.iLike]: `%${q}%` },
        },
      ];
    }

    const customers =
      await this.customerProfileModel.findAll({
        where,
        attributes: [
          'id',
          'uuid',
          'customerCode',
          'customerName',
          'phoneNumber',
        ],
        order: [['customerName', 'ASC']],
        limit: 50,
      });

    return customers.map((c) => ({
      value: c.uuid,
      label: `${c.customerName} - ${c.phoneNumber} (${c.customerCode})`,
      uuid: c.uuid,
    }));
  }

  /**
   * Real dropdown meta options for statuses & nominee relations (NO hardcoded dropdowns)
   */
  getDropdownMeta() {
    return {
      customer_statuses: [
        {
          value: 'active',
          label: 'Active Regular',
        },
        { value: 'vip', label: 'VIP Client' },
        {
          value: 'disputed',
          label: 'Flagged / Disputed',
        },
        {
          value: 'closed',
          label: 'Closed Account',
        },
      ],
      nominee_relations: [
        { value: 'Spouse', label: 'Spouse' },
        { value: 'Son', label: 'Son' },
        { value: 'Daughter', label: 'Daughter' },
        { value: 'Father', label: 'Father' },
        { value: 'Mother', label: 'Mother' },
        { value: 'Brother', label: 'Brother' },
      ],
    };
  }
}
