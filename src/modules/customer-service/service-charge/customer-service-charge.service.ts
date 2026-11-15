import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CsServiceChargeRate } from 'src/database/models/customer-service/cs_service_charge_rate.model';
import { CsFlatServiceCharge } from 'src/database/models/customer-service/cs_flat_service_charge.model';
import { CsBuildingIncome } from 'src/database/models/customer-service/cs_building_income.model';
import { CsBuildingExpense } from 'src/database/models/customer-service/cs_building_expense.model';
import { CsParkingExternalRental } from 'src/database/models/customer-service/cs_parking_external_rental.model';
import { CsSecurityCompany } from 'src/database/models/customer-service/cs_security_company.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  UpsertServiceChargeRateDto,
  GenerateMonthlyChargesDto,
  CreateFlatServiceChargeDto,
  CollectChargePaymentDto,
  QueryFlatServiceChargeDto,
  CreateBuildingIncomeDto,
  UpdateBuildingIncomeDto,
  QueryBuildingIncomeDto,
  CreateBuildingExpenseDto,
  UpdateBuildingExpenseDto,
  QueryBuildingExpenseDto,
} from './dto';

// Date range helper for DATEONLY columns (e.g. '2026-11' -> '2026-11-01' to '2026-11-30')
export function getMonthDateRange(yearMonth: string) {
  const parts = yearMonth.split('-').map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = parts[1] || new Date().getMonth() + 1;
  const lastDay = new Date(year, month, 0).getDate();
  return {
    start: `${year}-${String(month).padStart(2, '0')}-01`,
    end: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
  };
}

// Pure snake_case mappers
export function toSnakeCaseRate(item: CsServiceChargeRate) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    rate_basis: item.rateBasis,
    rate_per_sqft: Number(item.ratePerSqft || 0),
    fixed_rate_per_flat: Number(item.fixedRatePerFlat || 0),
    due_day_of_month: item.dueDayOfMonth,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseFlatCharge(item: CsFlatServiceCharge) {
  const total = Number(item.totalAmount || 0);
  const paid = Number(item.paidAmount || 0);
  const due = Math.max(0, total - paid);

  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    flat_number: item.flatNumber,
    resident_name: item.residentName,
    resident_phone: item.residentPhone ?? null,
    flat_size_sqft: Number(item.flatSizeSqft || 0),
    billing_month: item.billingMonth,
    rate_applied: Number(item.rateApplied || 0),
    total_amount: total,
    paid_amount: paid,
    due_amount: due,
    payment_status: item.paymentStatus,
    due_date: item.dueDate,
    payment_date: item.paymentDate ?? null,
    payment_method: item.paymentMethod ?? null,
    reference_number: item.referenceNumber ?? null,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseIncome(item: CsBuildingIncome) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    income_type: item.incomeType,
    title: item.title,
    amount: Number(item.amount || 0),
    income_date: item.incomeDate,
    received_from: item.receivedFrom ?? null,
    source_reference: item.sourceReference ?? null,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseExpense(item: CsBuildingExpense) {
  return {
    id: item.id,
    uuid: item.uuid,
    organization_id: item.organizationId ?? null,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    expense_type: item.expenseType,
    title: item.title,
    vendor_name: item.vendorName ?? null,
    amount: Number(item.amount || 0),
    expense_date: item.expenseDate,
    invoice_reference: item.invoiceReference ?? null,
    payment_status: item.paymentStatus,
    notes: item.notes ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

@Injectable()
export class CustomerServiceChargeService {
  private readonly logger = new Logger(CustomerServiceChargeService.name);

  constructor(
    @InjectModel(CsServiceChargeRate)
    private readonly rateModel: typeof CsServiceChargeRate,
    @InjectModel(CsFlatServiceCharge)
    private readonly flatChargeModel: typeof CsFlatServiceCharge,
    @InjectModel(CsBuildingIncome)
    private readonly incomeModel: typeof CsBuildingIncome,
    @InjectModel(CsBuildingExpense)
    private readonly expenseModel: typeof CsBuildingExpense,
    @InjectModel(CsParkingExternalRental)
    private readonly parkingRentalModel: typeof CsParkingExternalRental,
    @InjectModel(CsSecurityCompany)
    private readonly securityCompanyModel: typeof CsSecurityCompany,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(FlatLand)
    private readonly flatLandModel: typeof FlatLand,
    @InjectModel(FlatLandBooking)
    private readonly flatBookingModel: typeof FlatLandBooking,
  ) {}

  // =========================================================================
  // 1. SERVICE CHARGE RATE
  // =========================================================================

  async getProjectRate(user: any, projectId: string) {
    const ctx = extractUserContext(user);

    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    const rate = await this.rateModel.findOne({
      where: {
        projectId,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    if (rate) {
      return {
        ...toSnakeCaseRate(rate),
        is_configured: true,
      };
    }

    // Default rate if not configured yet
    return {
      id: null,
      uuid: null,
      organization_id: ctx.orgId,
      project_id: projectId,
      project_name: null,
      rate_basis: 'PER_SQFT',
      rate_per_sqft: 5.0,
      fixed_rate_per_flat: 5000.0,
      due_day_of_month: 10,
      notes: 'Default unconfigured tariff policy (5.00 ৳ / sqft)',
      is_configured: false,
    };
  }

  async upsertProjectRate(user: any, dto: UpsertServiceChargeRateDto) {
    const ctx = extractUserContext(user);

    let rate = await this.rateModel.findOne({
      where: {
        projectId: dto.project_id,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (rate) {
      await rate.update({
        rateBasis: dto.rate_basis,
        ratePerSqft: dto.rate_per_sqft ?? rate.ratePerSqft,
        fixedRatePerFlat: dto.fixed_rate_per_flat ?? rate.fixedRatePerFlat,
        dueDayOfMonth: dto.due_day_of_month ?? rate.dueDayOfMonth,
        notes: dto.notes !== undefined ? dto.notes : rate.notes,
        updatedBy: ctx.userId ?? null,
      });
    } else {
      rate = await this.rateModel.create({
        organizationId: ctx.orgId,
        projectId: dto.project_id,
        rateBasis: dto.rate_basis,
        ratePerSqft: dto.rate_per_sqft ?? 5.0,
        fixedRatePerFlat: dto.fixed_rate_per_flat ?? 5000.0,
        dueDayOfMonth: dto.due_day_of_month ?? 10,
        notes: dto.notes ?? null,
        createdBy: ctx.userId,
      });
    }

    const reloaded = await this.rateModel.findByPk(rate.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseRate(reloaded!);
  }

  // =========================================================================
  // 2. FLAT SERVICE CHARGES
  // =========================================================================

  async generateMonthlyCharges(user: any, dto: GenerateMonthlyChargesDto) {
    const ctx = extractUserContext(user);

    if (!dto.project_id) {
      throw new BadRequestException('Project ID is required');
    }
    if (!dto.billing_month || !/^\d{4}-\d{2}$/.test(dto.billing_month)) {
      throw new BadRequestException('Billing month must be in YYYY-MM format');
    }

    // 1. Fetch project rate config
    const rateConfig = await this.getProjectRate(user, dto.project_id);
    const rateBasis = rateConfig.rate_basis;
    const ratePerSqft = Number(rateConfig.rate_per_sqft || 5.0);
    const fixedRatePerFlat = Number(rateConfig.fixed_rate_per_flat || 5000.0);
    const dueDay = rateConfig.due_day_of_month || 10;

    const dueDate =
      dto.due_date ||
      `${dto.billing_month}-${String(Math.min(dueDay, 28)).padStart(2, '0')}`;

    // 2. Determine target flats
    let flatsToProcess: Array<{
      flat_number: string;
      resident_name: string;
      resident_phone?: string;
      flat_size_sqft?: number;
    }> = [];

    if (dto.flats && dto.flats.length > 0) {
      flatsToProcess = dto.flats;
    } else {
      // Auto-detect flats from FlatLand in this project
      const projectFlats = await this.flatLandModel.findAll({
        where: {
          projectId: dto.project_id,
        },
        include: [
          {
            model: this.flatBookingModel,
            as: 'bookings',
            required: false,
          },
        ],
      });

      if (projectFlats.length > 0) {
        flatsToProcess = projectFlats.map((f) => {
          const booking = f.bookings?.[0];
          const parsedSize = parseFloat(String(f.size || '1500').replace(/[^0-9.]/g, ''));
          return {
            flat_number: f.flatLandNo || 'Flat',
            resident_name: booking?.customerName || (booking as any)?.applicantName || 'Resident',
            resident_phone: (booking as any)?.customerPhone ?? (booking as any)?.phone ?? null,
            flat_size_sqft: isNaN(parsedSize) || parsedSize <= 0 ? 1500 : parsedSize,
          };
        });
      } else {
        // Fallback: Check if previous month had charges in this project
        const previousCharges = await this.flatChargeModel.findAll({
          where: {
            projectId: dto.project_id,
            ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
          },
          attributes: ['flatNumber', 'residentName', 'residentPhone', 'flatSizeSqft'],
          group: ['flatNumber', 'residentName', 'residentPhone', 'flatSizeSqft'],
          limit: 100,
        });

        if (previousCharges.length > 0) {
          flatsToProcess = previousCharges.map((p) => ({
            flat_number: p.flatNumber,
            resident_name: p.residentName,
            resident_phone: p.residentPhone ?? undefined,
            flat_size_sqft: Number(p.flatSizeSqft || 1500),
          }));
        } else {
          // Standard defaults for newly created project
          const defaultUnits = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B'];
          flatsToProcess = defaultUnits.map((u) => ({
            flat_number: u,
            resident_name: `Flat Owner (${u})`,
            resident_phone: null,
            flat_size_sqft: 1500,
          }));
        }
      }
    }

    let generatedCount = 0;
    let updatedCount = 0;
    const generatedItems = [];

    for (const item of flatsToProcess) {
      const size = Number(item.flat_size_sqft || 1500);
      let calculatedTotal = 0;
      let appliedRate = 0;

      if (rateBasis === 'PER_SQFT') {
        appliedRate = ratePerSqft;
        calculatedTotal = Math.round(size * ratePerSqft * 100) / 100;
      } else {
        appliedRate = fixedRatePerFlat;
        calculatedTotal = fixedRatePerFlat;
      }

      // Check existing charge for this flat + month
      const existing = await this.flatChargeModel.findOne({
        where: {
          projectId: dto.project_id,
          flatNumber: item.flat_number,
          billingMonth: dto.billing_month,
          ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
        },
      });

      if (existing) {
        const paidAmount = Number(existing.paidAmount || 0);
        let newStatus = existing.paymentStatus;
        if (paidAmount >= calculatedTotal && calculatedTotal > 0) {
          newStatus = 'PAID';
        } else if (paidAmount > 0) {
          newStatus = 'PARTIAL';
        } else {
          newStatus = 'DUE';
        }

        await existing.update({
          residentName: item.resident_name || existing.residentName,
          residentPhone: item.resident_phone ?? existing.residentPhone,
          flatSizeSqft: size,
          rateApplied: appliedRate,
          totalAmount: calculatedTotal,
          paymentStatus: newStatus,
          dueDate,
          updatedBy: ctx.userId ?? null,
        });

        updatedCount++;
        generatedItems.push(existing);
      } else {
        const created = await this.flatChargeModel.create({
          organizationId: ctx.orgId,
          projectId: dto.project_id,
          flatNumber: item.flat_number,
          residentName: item.resident_name || `Owner ${item.flat_number}`,
          residentPhone: item.resident_phone ?? null,
          flatSizeSqft: size,
          billingMonth: dto.billing_month,
          rateApplied: appliedRate,
          totalAmount: calculatedTotal,
          paidAmount: 0,
          paymentStatus: 'DUE',
          dueDate,
          createdBy: ctx.userId,
        });

        generatedCount++;
        generatedItems.push(created);
      }
    }

    return {
      message: `Monthly charges processed for ${dto.billing_month}`,
      billing_month: dto.billing_month,
      project_id: dto.project_id,
      generated_count: generatedCount,
      updated_count: updatedCount,
      total_flats_billed: flatsToProcess.length,
      rate_applied: {
        rate_basis: rateBasis,
        rate_value: rateBasis === 'PER_SQFT' ? ratePerSqft : fixedRatePerFlat,
      },
    };
  }

  async createFlatCharge(user: any, dto: CreateFlatServiceChargeDto) {
    const ctx = extractUserContext(user);

    // Compute total if not provided
    let total = dto.total_amount;
    let rateApplied = 0;

    if (total === undefined || total === null) {
      const rateConfig = await this.getProjectRate(user, dto.project_id);
      const size = Number(dto.flat_size_sqft || 1500);
      if (rateConfig.rate_basis === 'PER_SQFT') {
        rateApplied = Number(rateConfig.rate_per_sqft || 5.0);
        total = Math.round(size * rateApplied * 100) / 100;
      } else {
        rateApplied = Number(rateConfig.fixed_rate_per_flat || 5000.0);
        total = rateApplied;
      }
    }

    const dueDate =
      dto.due_date || `${dto.billing_month}-10`;

    // Check existing
    const existing = await this.flatChargeModel.findOne({
      where: {
        projectId: dto.project_id,
        flatNumber: dto.flat_number,
        billingMonth: dto.billing_month,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Charge already exists for flat ${dto.flat_number} in month ${dto.billing_month}`,
      );
    }

    const created = await this.flatChargeModel.create({
      organizationId: ctx.orgId,
      projectId: dto.project_id,
      flatNumber: dto.flat_number,
      residentName: dto.resident_name,
      residentPhone: dto.resident_phone ?? null,
      flatSizeSqft: dto.flat_size_sqft ?? 1500,
      billingMonth: dto.billing_month,
      rateApplied: rateApplied || 0,
      totalAmount: total,
      paidAmount: 0,
      paymentStatus: 'DUE',
      dueDate,
      notes: dto.notes ?? null,
      createdBy: ctx.userId,
    });

    const reloaded = await this.flatChargeModel.findByPk(created.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseFlatCharge(reloaded!);
  }

  async listFlatCharges(user: any, query: QueryFlatServiceChargeDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 25)));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id) {
      where.projectId = query.project_id;
    }
    if (query.billing_month) {
      where.billingMonth = query.billing_month;
    }
    if (query.payment_status && query.payment_status !== 'all') {
      where.paymentStatus = query.payment_status;
    }
    if (query.search) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { flatNumber: { [Op.iLike]: s } },
        { residentName: { [Op.iLike]: s } },
        { residentPhone: { [Op.iLike]: s } },
      ];
    }

    const { count, rows } = await this.flatChargeModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['flatNumber', 'ASC']],
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    // Compute summary stats for the current filter
    const allFiltered = await this.flatChargeModel.findAll({
      where,
      attributes: ['totalAmount', 'paidAmount', 'paymentStatus'],
    });

    let totalReceivable = 0;
    let totalCollected = 0;
    let totalDue = 0;
    let paidCount = 0;
    let dueCount = 0;

    for (const c of allFiltered) {
      const tot = Number(c.totalAmount || 0);
      const paid = Number(c.paidAmount || 0);
      totalReceivable += tot;
      totalCollected += paid;
      totalDue += Math.max(0, tot - paid);

      if (c.paymentStatus === 'PAID') paidCount++;
      else dueCount++;
    }

    const collectionRate =
      totalReceivable > 0
        ? Math.round((totalCollected / totalReceivable) * 1000) / 10
        : 0;

    return {
      items: rows.map(toSnakeCaseFlatCharge),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
      stats: {
        total_flats: count,
        total_receivable: Math.round(totalReceivable * 100) / 100,
        total_collected: Math.round(totalCollected * 100) / 100,
        total_due: Math.round(totalDue * 100) / 100,
        collection_rate_percent: collectionRate,
        paid_count: paidCount,
        due_count: dueCount,
      },
    };
  }

  async collectChargePayment(
    user: any,
    uuid: string,
    dto: CollectChargePaymentDto,
  ) {
    const ctx = extractUserContext(user);

    const charge = await this.flatChargeModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!charge) {
      throw new NotFoundException(`Flat service charge not found`);
    }

    const currentPaid = Number(charge.paidAmount || 0);
    const addedPaid = Number(dto.paid_amount);
    const newPaid = Math.round((currentPaid + addedPaid) * 100) / 100;
    const totalAmount = Number(charge.totalAmount || 0);

    let newStatus = charge.paymentStatus;
    if (newPaid >= totalAmount) {
      newStatus = 'PAID';
    } else if (newPaid > 0) {
      newStatus = 'PARTIAL';
    } else {
      newStatus = 'DUE';
    }

    const paymentDate =
      dto.payment_date || new Date().toISOString().slice(0, 10);

    await charge.update({
      paidAmount: newPaid,
      paymentStatus: newStatus,
      paymentDate,
      paymentMethod: dto.payment_method ?? charge.paymentMethod,
      referenceNumber: dto.reference_number ?? charge.referenceNumber,
      notes: dto.notes ? `${charge.notes ? charge.notes + '; ' : ''}${dto.notes}` : charge.notes,
      updatedBy: ctx.userId ?? null,
    });

    const reloaded = await this.flatChargeModel.findByPk(charge.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseFlatCharge(reloaded!);
  }

  // =========================================================================
  // 3. EXTRA BUILDING INCOMES (Hall, Rooftop, Pool, Mosque, Parking, Other)
  // =========================================================================

  async createBuildingIncome(user: any, dto: CreateBuildingIncomeDto) {
    const ctx = extractUserContext(user);

    const income = await this.incomeModel.create({
      organizationId: ctx.orgId,
      projectId: dto.project_id,
      incomeType: dto.income_type,
      title: dto.title,
      amount: dto.amount,
      incomeDate: dto.income_date,
      receivedFrom: dto.received_from ?? null,
      sourceReference: dto.source_reference ?? null,
      notes: dto.notes ?? null,
      createdBy: ctx.userId,
    });

    const reloaded = await this.incomeModel.findByPk(income.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseIncome(reloaded!);
  }

  async listBuildingIncomes(user: any, query: QueryBuildingIncomeDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 25)));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id) {
      where.projectId = query.project_id;
    }
    if (query.income_type && query.income_type !== 'all') {
      where.incomeType = query.income_type;
    }
    if (query.month) {
      const r = getMonthDateRange(query.month);
      where.incomeDate = { [Op.between]: [r.start, r.end] };
    }
    if (query.start_date && query.end_date) {
      where.incomeDate = { [Op.between]: [query.start_date, query.end_date] };
    } else if (query.start_date) {
      where.incomeDate = { [Op.gte]: query.start_date };
    } else if (query.end_date) {
      where.incomeDate = { [Op.lte]: query.end_date };
    }
    if (query.search) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: s } },
        { receivedFrom: { [Op.iLike]: s } },
        { sourceReference: { [Op.iLike]: s } },
      ];
    }

    const { count, rows } = await this.incomeModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['incomeDate', 'DESC'], ['id', 'DESC']],
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    const allFiltered = await this.incomeModel.findAll({
      where,
      attributes: ['amount', 'incomeType'],
    });

    let totalAmount = 0;
    const categoryTotals: Record<string, number> = {};

    for (const inc of allFiltered) {
      const amt = Number(inc.amount || 0);
      totalAmount += amt;
      categoryTotals[inc.incomeType] = (categoryTotals[inc.incomeType] || 0) + amt;
    }

    return {
      items: rows.map(toSnakeCaseIncome),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
      stats: {
        total_income: Math.round(totalAmount * 100) / 100,
        by_category: categoryTotals,
      },
    };
  }

  async updateBuildingIncome(
    user: any,
    uuid: string,
    dto: UpdateBuildingIncomeDto,
  ) {
    const ctx = extractUserContext(user);

    const income = await this.incomeModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!income) {
      throw new NotFoundException('Building income entry not found');
    }

    await income.update({
      incomeType: dto.income_type ?? income.incomeType,
      title: dto.title ?? income.title,
      amount: dto.amount !== undefined ? dto.amount : income.amount,
      incomeDate: dto.income_date ?? income.incomeDate,
      receivedFrom: dto.received_from !== undefined ? dto.received_from : income.receivedFrom,
      sourceReference: dto.source_reference !== undefined ? dto.source_reference : income.sourceReference,
      notes: dto.notes !== undefined ? dto.notes : income.notes,
      updatedBy: ctx.userId ?? null,
    });

    const reloaded = await this.incomeModel.findByPk(income.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseIncome(reloaded!);
  }

  async deleteBuildingIncome(user: any, uuid: string) {
    const ctx = extractUserContext(user);

    const income = await this.incomeModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!income) {
      throw new NotFoundException('Building income entry not found');
    }

    await income.update({ deletedBy: ctx.userId ?? null });
    await income.destroy();
    return { success: true, message: 'Building income entry deleted' };
  }

  // =========================================================================
  // 4. BUILDING EXPENSES (Security, Lift, Utilities, Cleaning, Maintenance)
  // =========================================================================

  async createBuildingExpense(user: any, dto: CreateBuildingExpenseDto) {
    const ctx = extractUserContext(user);

    const expense = await this.expenseModel.create({
      organizationId: ctx.orgId,
      projectId: dto.project_id,
      expenseType: dto.expense_type,
      title: dto.title,
      vendorName: dto.vendor_name ?? null,
      amount: dto.amount,
      expenseDate: dto.expense_date,
      invoiceReference: dto.invoice_reference ?? null,
      paymentStatus: dto.payment_status ?? 'PAID',
      notes: dto.notes ?? null,
      createdBy: ctx.userId,
    });

    const reloaded = await this.expenseModel.findByPk(expense.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseExpense(reloaded!);
  }

  async listBuildingExpenses(user: any, query: QueryBuildingExpenseDto) {
    const ctx = extractUserContext(user);
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.max(1, Math.min(100, Number(query.limit || 25)));
    const offset = (page - 1) * limit;

    const where: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (query.project_id) {
      where.projectId = query.project_id;
    }
    if (query.expense_type && query.expense_type !== 'all') {
      where.expenseType = query.expense_type;
    }
    if (query.payment_status && query.payment_status !== 'all') {
      where.paymentStatus = query.payment_status;
    }
    if (query.month) {
      const r = getMonthDateRange(query.month);
      where.expenseDate = { [Op.between]: [r.start, r.end] };
    }
    if (query.start_date && query.end_date) {
      where.expenseDate = { [Op.between]: [query.start_date, query.end_date] };
    } else if (query.start_date) {
      where.expenseDate = { [Op.gte]: query.start_date };
    } else if (query.end_date) {
      where.expenseDate = { [Op.lte]: query.end_date };
    }
    if (query.search) {
      const s = `%${query.search.trim()}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: s } },
        { vendorName: { [Op.iLike]: s } },
        { invoiceReference: { [Op.iLike]: s } },
      ];
    }

    const { count, rows } = await this.expenseModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['expenseDate', 'DESC'], ['id', 'DESC']],
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    const allFiltered = await this.expenseModel.findAll({
      where,
      attributes: ['amount', 'expenseType', 'paymentStatus'],
    });

    let totalAmount = 0;
    const categoryTotals: Record<string, number> = {};

    for (const exp of allFiltered) {
      const amt = Number(exp.amount || 0);
      totalAmount += amt;
      categoryTotals[exp.expenseType] = (categoryTotals[exp.expenseType] || 0) + amt;
    }

    return {
      items: rows.map(toSnakeCaseExpense),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
      stats: {
        total_expense: Math.round(totalAmount * 100) / 100,
        by_category: categoryTotals,
      },
    };
  }

  async updateBuildingExpense(
    user: any,
    uuid: string,
    dto: UpdateBuildingExpenseDto,
  ) {
    const ctx = extractUserContext(user);

    const expense = await this.expenseModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!expense) {
      throw new NotFoundException('Building expense entry not found');
    }

    await expense.update({
      expenseType: dto.expense_type ?? expense.expenseType,
      title: dto.title ?? expense.title,
      vendorName: dto.vendor_name !== undefined ? dto.vendor_name : expense.vendorName,
      amount: dto.amount !== undefined ? dto.amount : expense.amount,
      expenseDate: dto.expense_date ?? expense.expenseDate,
      invoiceReference: dto.invoice_reference !== undefined ? dto.invoice_reference : expense.invoiceReference,
      paymentStatus: dto.payment_status ?? expense.paymentStatus,
      notes: dto.notes !== undefined ? dto.notes : expense.notes,
      updatedBy: ctx.userId ?? null,
    });

    const reloaded = await this.expenseModel.findByPk(expense.id, {
      include: [{ model: this.projectModel, as: 'project', required: false }],
    });

    return toSnakeCaseExpense(reloaded!);
  }

  async deleteBuildingExpense(user: any, uuid: string) {
    const ctx = extractUserContext(user);

    const expense = await this.expenseModel.findOne({
      where: {
        uuid,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    if (!expense) {
      throw new NotFoundException('Building expense entry not found');
    }

    await expense.update({ deletedBy: ctx.userId ?? null });
    await expense.destroy();
    return { success: true, message: 'Building expense entry deleted' };
  }

  // =========================================================================
  // 5. MONTHLY FINANCIAL SUMMARY (Cross-module feeds + Math)
  // =========================================================================

  async getMonthlySummary(user: any, projectId: string, month?: string) {
    const ctx = extractUserContext(user);

    if (!projectId) {
      throw new BadRequestException('Project ID is required');
    }

    const billingMonth = month || new Date().toISOString().slice(0, 7);

    // 1. Flat Service Charges
    const charges = await this.flatChargeModel.findAll({
      where: {
        projectId,
        billingMonth,
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    let totalChargesReceivable = 0;
    let chargesCollected = 0;
    let chargesDue = 0;

    for (const c of charges) {
      const tot = Number(c.totalAmount || 0);
      const paid = Number(c.paidAmount || 0);
      totalChargesReceivable += tot;
      chargesCollected += paid;
      chargesDue += Math.max(0, tot - paid);
    }

    const monthRange = getMonthDateRange(billingMonth);

    // 2. Extra Incomes from cs_building_incomes
    const incomes = await this.incomeModel.findAll({
      where: {
        projectId,
        incomeDate: { [Op.between]: [monthRange.start, monthRange.end] },
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    let extraIncomesTotal = 0;
    const incomesByCategory: Record<string, number> = {
      COMMUNITY_HALL: 0,
      ROOFTOP_RENT: 0,
      PARKING: 0,
      SWIMMING_POOL: 0,
      MOSQUE: 0,
      OTHER: 0,
    };

    for (const inc of incomes) {
      const amt = Number(inc.amount || 0);
      extraIncomesTotal += amt;
      incomesByCategory[inc.incomeType] =
        (incomesByCategory[inc.incomeType] || 0) + amt;
    }

    // 3. Cross-Module Feed: Parking External Rentals (Prompt 8)
    // Read active rentals in this project
    const parkingRentals = await this.parkingRentalModel.findAll({
      where: {
        projectId,
        status: 'ACTIVE',
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    let parkingMonthlyRentTotal = 0;
    let parkingCollectedTotal = 0;
    for (const r of parkingRentals) {
      const mRent = Number(r.monthlyRent || 0);
      parkingMonthlyRentTotal += mRent;
      if (r.paymentStatus === 'PAID') {
        parkingCollectedTotal += mRent;
      }
    }

    // If parking income wasn't manually logged in cs_building_incomes,
    // cross-feed it from external rentals
    const autoCrossFedParking =
      incomesByCategory.PARKING === 0 ? parkingCollectedTotal : 0;
    const finalParkingIncome = incomesByCategory.PARKING + autoCrossFedParking;
    const totalExtraIncomes = extraIncomesTotal + autoCrossFedParking;

    // 4. Expenses from cs_building_expenses
    const expenses = await this.expenseModel.findAll({
      where: {
        projectId,
        expenseDate: { [Op.between]: [monthRange.start, monthRange.end] },
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    let directExpensesTotal = 0;
    const expensesByCategory: Record<string, number> = {
      SECURITY: 0,
      LIFT: 0,
      UTILITIES: 0,
      CLEANING: 0,
      MAINTENANCE: 0,
      OTHER: 0,
    };

    for (const exp of expenses) {
      const amt = Number(exp.amount || 0);
      directExpensesTotal += amt;
      expensesByCategory[exp.expenseType] =
        (expensesByCategory[exp.expenseType] || 0) + amt;
    }

    // 5. Cross-Module Feed: Security Companies (Prompt 7)
    // Read active security contracts scoped to this project
    const securityCompanies = await this.securityCompanyModel.findAll({
      where: {
        status: 'ACTIVE',
        [Op.or]: [
          { projectId },
          { projectId: null }, // Org-wide security company
        ],
        ...(ctx.isSuperAdmin || !ctx.orgId ? {} : { organizationId: ctx.orgId }),
      },
    });

    let contractedSecurityMonthlyCost = 0;
    for (const c of securityCompanies) {
      contractedSecurityMonthlyCost += Number(c.monthlyCost || 0);
    }

    // If security wasn't logged manually in cs_building_expenses,
    // we show the contracted cost in cross_module_feeds and factor into expenses if zero
    const autoCrossFedSecurity =
      expensesByCategory.SECURITY === 0 ? contractedSecurityMonthlyCost : 0;
    const finalSecurityExpense =
      expensesByCategory.SECURITY + autoCrossFedSecurity;
    const totalExpenses = directExpensesTotal + autoCrossFedSecurity;

    // 6. Math Balance
    const totalGrossIncome =
      Math.round((chargesCollected + totalExtraIncomes) * 100) / 100;
    const netBalance =
      Math.round((totalGrossIncome - totalExpenses) * 100) / 100;
    const collectionRate =
      totalChargesReceivable > 0
        ? Math.round((chargesCollected / totalChargesReceivable) * 1000) / 10
        : 0;

    return {
      project_id: projectId,
      billing_month: billingMonth,
      summary: {
        total_gross_income: totalGrossIncome,
        total_expenses: Math.round(totalExpenses * 100) / 100,
        net_balance: netBalance,
        financial_status:
          netBalance >= 0 ? 'SURPLUS' : 'DEFICIT',
      },
      service_charges: {
        total_receivable: Math.round(totalChargesReceivable * 100) / 100,
        collected: Math.round(chargesCollected * 100) / 100,
        due: Math.round(chargesDue * 100) / 100,
        collection_rate_percent: collectionRate,
        flats_count: charges.length,
      },
      extra_incomes: {
        total: Math.round(totalExtraIncomes * 100) / 100,
        breakdown: {
          ...incomesByCategory,
          PARKING: Math.round(finalParkingIncome * 100) / 100,
        },
      },
      expenses: {
        total: Math.round(totalExpenses * 100) / 100,
        breakdown: {
          ...expensesByCategory,
          SECURITY: Math.round(finalSecurityExpense * 100) / 100,
        },
      },
      cross_module_feeds: {
        parking: {
          active_external_rentals_count: parkingRentals.length,
          monthly_rent_expected: Math.round(parkingMonthlyRentTotal * 100) / 100,
          monthly_rent_collected: Math.round(parkingCollectedTotal * 100) / 100,
          feed_included_in_income: autoCrossFedParking > 0,
        },
        security: {
          active_companies_count: securityCompanies.length,
          contracted_monthly_cost: Math.round(contractedSecurityMonthlyCost * 100) / 100,
          feed_included_in_expense: autoCrossFedSecurity > 0,
        },
      },
    };
  }
}
