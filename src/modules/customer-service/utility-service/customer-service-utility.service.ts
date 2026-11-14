import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { CsUtilityTechnician } from 'src/database/models/customer-service/cs_utility_technician.model';
import { CsWarrantyItem } from 'src/database/models/customer-service/cs_warranty_item.model';
import { CsUtilityTicket } from 'src/database/models/customer-service/cs_utility_ticket.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { QueryTechnicianDto } from './dto/query-technician.dto';
import { CreateWarrantyItemDto } from './dto/create-warranty-item.dto';
import { UpdateWarrantyItemDto } from './dto/update-warranty-item.dto';
import { QueryWarrantyItemDto } from './dto/query-warranty-item.dto';
import { CreateUtilityTicketDto } from './dto/create-utility-ticket.dto';
import { UpdateUtilityTicketDto } from './dto/update-utility-ticket.dto';
import { QueryUtilityTicketDto } from './dto/query-utility-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { formatBdtCurrency } from '../change-requests/customer-service-change-requests.service';

// Pure Mappers for strict snake_case responses
export function toSnakeCaseTechnicianItem(item: CsUtilityTechnician) {
  return {
    id: item.id,
    uuid: item.uuid,
    name: item.name,
    phone: item.phone,
    specialty: item.specialty,
    technician_type: item.technicianType,
    vendor_name: item.vendorName ?? null,
    is_active: item.isActive,
    project_id: item.projectId ?? null,
    project_name: item.project?.name ?? null,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseWarrantyItem(item: CsWarrantyItem) {
  const today = new Date().toISOString().slice(0, 10);
  let status: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
  if (item.warrantyEndDate < today) {
    status = 'Expired';
  } else {
    const end = new Date(item.warrantyEndDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 30) {
      status = 'Expiring Soon';
    }
  }

  return {
    id: item.id,
    uuid: item.uuid,
    project_id: item.projectId,
    project_name: item.project?.name ?? null,
    unit: item.unit,
    customer_name: item.customerName ?? null,
    customer_profile_id: item.customerProfileId ?? null,
    item_name: item.itemName,
    category: item.category,
    brand: item.brand,
    model_no: item.modelNo ?? null,
    serial_number: item.serialNumber ?? null,
    location: item.location,
    quantity: item.quantity,
    warranty_start_date: item.warrantyStartDate,
    warranty_end_date: item.warrantyEndDate,
    coverage_details: item.coverageDetails ?? null,
    warranty_status: status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
}

export function toSnakeCaseUtilityTicketItem(ticket: CsUtilityTicket) {
  return {
    id: ticket.id,
    uuid: ticket.uuid,
    ticket_number: ticket.ticketNumber,
    queue_serial: ticket.queueSerial,
    project_id: ticket.projectId,
    project_name: ticket.project?.name ?? null,
    unit: ticket.unit,
    customer_name: ticket.customerName,
    customer_phone: ticket.customerPhone ?? null,
    category: ticket.category,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    technician_id: ticket.technicianId ?? null,
    technician: ticket.technician
      ? {
          id: ticket.technician.id,
          uuid: ticket.technician.uuid,
          name: ticket.technician.name,
          phone: ticket.technician.phone,
          specialty: ticket.technician.specialty,
          technician_type: ticket.technician.technicianType,
        }
      : null,
    warranty_item_id: ticket.warrantyItemId ?? null,
    warranty_item: ticket.warrantyItem
      ? {
          id: ticket.warrantyItem.id,
          uuid: ticket.warrantyItem.uuid,
          item_name: ticket.warrantyItem.itemName,
          brand: ticket.warrantyItem.brand,
          category: ticket.warrantyItem.category,
          warranty_end_date: ticket.warrantyItem.warrantyEndDate,
        }
      : null,
    cost_type: ticket.costType,
    estimated_charge: Number(ticket.estimatedCharge) || 0,
    estimated_charge_formatted: formatBdtCurrency(
      Number(ticket.estimatedCharge) || 0,
    ),
    actual_charge: ticket.actualCharge !== null ? Number(ticket.actualCharge) : null,
    assigned_at: ticket.assignedAt ?? null,
    resolved_at: ticket.resolvedAt ?? null,
    handed_over_at: ticket.handedOverAt ?? null,
    closed_at: ticket.closedAt ?? null,
    resolution_notes: ticket.resolutionNotes ?? null,
    customer_feedback: ticket.customerFeedback ?? null,
    customer_rating: ticket.customerRating ?? null,
    created_at: ticket.createdAt,
    updated_at: ticket.updatedAt,
  };
}

@Injectable()
export class CustomerServiceUtilityService {
  private readonly logger = new Logger(CustomerServiceUtilityService.name);

  constructor(
    @InjectModel(CsUtilityTechnician)
    private readonly technicianModel: typeof CsUtilityTechnician,
    @InjectModel(CsWarrantyItem)
    private readonly warrantyItemModel: typeof CsWarrantyItem,
    @InjectModel(CsUtilityTicket)
    private readonly ticketModel: typeof CsUtilityTicket,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  // ==========================================
  // 1. TECHNICIANS MODULE
  // ==========================================

  async findTechnicians(query: QueryTechnicianDto, user?: any) {
    const ctx = extractUserContext(user);
    const where: WhereOptions<CsUtilityTechnician> = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      (where as any).organizationId = ctx.orgId;
    }

    if (query.project_id && query.project_id !== 'all') {
      (where as any)[Op.or] = [
        { projectId: query.project_id },
        { projectId: null },
      ];
    }

    if (query.is_deleted) {
      (where as any).deletedAt = { [Op.ne]: null };
    }

    if (query.specialty) {
      (where as any).specialty = query.specialty;
    }

    if (query.technician_type) {
      (where as any).technicianType = query.technician_type;
    }

    if (query.is_active !== undefined) {
      (where as any).isActive = query.is_active;
    }

    if (query.search && query.search.trim()) {
      const q = `%${query.search.trim()}%`;
      (where as any)[Op.or] = [
        { name: { [Op.iLike]: q } },
        { phone: { [Op.iLike]: q } },
        { vendorName: { [Op.iLike]: q } },
      ];
    }

    const offset = query.getOffset();
    const limit = Math.min(100, Math.max(1, query.limit || 10));

    const { count, rows } = await this.technicianModel.findAndCountAll({
      where,
      paranoid: !query.is_deleted,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    });

    return {
      items: rows.map(toSnakeCaseTechnicianItem),
      meta: query.getPaginationMetadata(count),
    };
  }

  async createTechnician(dto: CreateTechnicianDto, user?: any) {
    const ctx = extractUserContext(user);
    if (!ctx.isSuperAdmin && !ctx.orgId) {
      throw new BadRequestException('Organization context missing for user');
    }

    const technician = await this.technicianModel.create({
      organizationId: ctx.orgId ?? null,
      projectId: dto.project_id ?? null,
      name: dto.name.trim(),
      phone: dto.phone.trim(),
      specialty: dto.specialty,
      technicianType: dto.technician_type ?? 'In-house',
      vendorName: dto.vendor_name?.trim() ?? null,
      isActive: dto.is_active ?? true,
      createdBy: ctx.userId ?? null,
    });

    return toSnakeCaseTechnicianItem(technician);
  }

  async updateTechnician(
    uuid: string,
    dto: UpdateTechnicianDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const technician = await this.technicianModel.findOne({ where });
    if (!technician) {
      throw new NotFoundException(`Technician with UUID "${uuid}" not found`);
    }

    if (dto.name !== undefined) technician.name = dto.name.trim();
    if (dto.phone !== undefined) technician.phone = dto.phone.trim();
    if (dto.specialty !== undefined) technician.specialty = dto.specialty;
    if (dto.technician_type !== undefined)
      technician.technicianType = dto.technician_type;
    if (dto.vendor_name !== undefined)
      technician.vendorName = dto.vendor_name?.trim() || null;
    if (dto.is_active !== undefined) technician.isActive = dto.is_active;
    if (dto.project_id !== undefined)
      technician.projectId = dto.project_id || null;

    technician.updatedBy = ctx.userId ?? null;
    await technician.save();

    return toSnakeCaseTechnicianItem(technician);
  }

  async removeTechnician(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const technician = await this.technicianModel.findOne({ where });
    if (!technician) {
      throw new NotFoundException(`Technician with UUID "${uuid}" not found`);
    }

    technician.deletedBy = ctx.userId ?? null;
    await technician.save();
    await technician.destroy();

    return { success: true, message: 'Technician deleted successfully' };
  }

  // ==========================================
  // 2. WARRANTY REGISTRY MODULE
  // ==========================================

  async getWarrantyStats(projectId?: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    const today = new Date().toISOString().slice(0, 10);
    const future30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const [totalCount, expiredCount, expiringSoonCount] = await Promise.all([
      this.warrantyItemModel.count({ where }),
      this.warrantyItemModel.count({
        where: {
          ...where,
          warrantyEndDate: { [Op.lt]: today },
        },
      }),
      this.warrantyItemModel.count({
        where: {
          ...where,
          warrantyEndDate: {
            [Op.gte]: today,
            [Op.lte]: future30,
          },
        },
      }),
    ]);

    const activeCount = Math.max(0, totalCount - expiredCount);

    return {
      total_items: totalCount,
      active_items: activeCount,
      expiring_soon_items: expiringSoonCount,
      expired_items: expiredCount,
    };
  }

  async findWarrantyItems(query: QueryWarrantyItemDto, user?: any) {
    const ctx = extractUserContext(user);
    const where: WhereOptions<CsWarrantyItem> = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      (where as any).organizationId = ctx.orgId;
    }

    if (query.project_id && query.project_id !== 'all') {
      (where as any).projectId = query.project_id;
    }

    if (query.is_deleted) {
      (where as any).deletedAt = { [Op.ne]: null };
    }

    if (query.category) {
      (where as any).category = query.category;
    }

    if (query.brand) {
      (where as any).brand = { [Op.iLike]: `%${query.brand.trim()}%` };
    }

    if (query.unit) {
      (where as any).unit = { [Op.iLike]: `%${query.unit.trim()}%` };
    }

    const today = new Date().toISOString().slice(0, 10);
    if (query.status === 'expired') {
      (where as any).warrantyEndDate = { [Op.lt]: today };
    } else if (query.status === 'active') {
      (where as any).warrantyEndDate = { [Op.gte]: today };
    } else if (query.status === 'expiring_soon') {
      const future30 = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      (where as any).warrantyEndDate = {
        [Op.gte]: today,
        [Op.lte]: future30,
      };
    }

    if (query.search && query.search.trim()) {
      const q = `%${query.search.trim()}%`;
      (where as any)[Op.or] = [
        { itemName: { [Op.iLike]: q } },
        { brand: { [Op.iLike]: q } },
        { unit: { [Op.iLike]: q } },
        { location: { [Op.iLike]: q } },
      ];
    }

    const offset = query.getOffset();
    const limit = Math.min(100, Math.max(1, query.limit || 10));

    const { count, rows } = await this.warrantyItemModel.findAndCountAll({
      where,
      paranoid: !query.is_deleted,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
      ],
      order: [['warrantyEndDate', 'ASC']],
      offset,
      limit,
    });

    return {
      items: rows.map(toSnakeCaseWarrantyItem),
      meta: query.getPaginationMetadata(count),
    };
  }

  async createWarrantyItem(dto: CreateWarrantyItemDto, user?: any) {
    const ctx = extractUserContext(user);
    if (!ctx.isSuperAdmin && !ctx.orgId) {
      throw new BadRequestException('Organization context missing for user');
    }

    const project = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });

    if (!project) {
      throw new NotFoundException(
        `Project with UUID "${dto.project_id}" not found`,
      );
    }

    const item = await this.warrantyItemModel.create({
      organizationId: ctx.orgId ?? null,
      projectId: dto.project_id,
      unit: dto.unit.trim(),
      customerName: dto.customer_name?.trim() ?? null,
      customerProfileId: dto.customer_profile_id ?? null,
      itemName: dto.item_name.trim(),
      category: dto.category,
      brand: dto.brand.trim(),
      modelNo: dto.model_no?.trim() ?? null,
      serialNumber: dto.serial_number?.trim() ?? null,
      location: dto.location.trim(),
      quantity: dto.quantity || 1,
      warrantyStartDate: dto.warranty_start_date,
      warrantyEndDate: dto.warranty_end_date,
      coverageDetails: dto.coverage_details?.trim() ?? null,
      createdBy: ctx.userId ?? null,
    });

    return toSnakeCaseWarrantyItem(item);
  }

  async updateWarrantyItem(
    uuid: string,
    dto: UpdateWarrantyItemDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item = await this.warrantyItemModel.findOne({ where });
    if (!item) {
      throw new NotFoundException(`Warranty item with UUID "${uuid}" not found`);
    }

    if (dto.unit !== undefined) item.unit = dto.unit.trim();
    if (dto.customer_name !== undefined)
      item.customerName = dto.customer_name?.trim() || null;
    if (dto.item_name !== undefined) item.itemName = dto.item_name.trim();
    if (dto.category !== undefined) item.category = dto.category;
    if (dto.brand !== undefined) item.brand = dto.brand.trim();
    if (dto.model_no !== undefined)
      item.modelNo = dto.model_no?.trim() || null;
    if (dto.serial_number !== undefined)
      item.serialNumber = dto.serial_number?.trim() || null;
    if (dto.location !== undefined) item.location = dto.location.trim();
    if (dto.quantity !== undefined) item.quantity = dto.quantity;
    if (dto.warranty_start_date !== undefined)
      item.warrantyStartDate = dto.warranty_start_date;
    if (dto.warranty_end_date !== undefined)
      item.warrantyEndDate = dto.warranty_end_date;
    if (dto.coverage_details !== undefined)
      item.coverageDetails = dto.coverage_details?.trim() || null;

    item.updatedBy = ctx.userId ?? null;
    await item.save();

    return toSnakeCaseWarrantyItem(item);
  }

  async removeWarrantyItem(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const item = await this.warrantyItemModel.findOne({ where });
    if (!item) {
      throw new NotFoundException(`Warranty item with UUID "${uuid}" not found`);
    }

    item.deletedBy = ctx.userId ?? null;
    await item.save();
    await item.destroy();

    return { success: true, message: 'Warranty item deleted successfully' };
  }

  // ==========================================
  // 3. UTILITY TICKETS & FIFO QUEUE WORKFLOW
  // ==========================================

  async getTicketStats(projectId?: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = {};
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }
    if (projectId && projectId !== 'all') {
      where.projectId = projectId;
    }

    const [
      totalTickets,
      openCount,
      assignedCount,
      inProgressCount,
      resolvedCount,
      handedOverCount,
      closedCount,
      freeCount,
      paidCount,
      chargesSum,
    ] = await Promise.all([
      this.ticketModel.count({ where }),
      this.ticketModel.count({ where: { ...where, status: 'Open' } }),
      this.ticketModel.count({ where: { ...where, status: 'Assigned' } }),
      this.ticketModel.count({ where: { ...where, status: 'In Progress' } }),
      this.ticketModel.count({ where: { ...where, status: 'Resolved' } }),
      this.ticketModel.count({ where: { ...where, status: 'Handed Over' } }),
      this.ticketModel.count({ where: { ...where, status: 'Closed' } }),
      this.ticketModel.count({ where: { ...where, costType: 'FREE' } }),
      this.ticketModel.count({ where: { ...where, costType: 'PAID' } }),
      this.ticketModel.sum('actualCharge', { where }) ||
        this.ticketModel.sum('estimatedCharge', {
          where: { ...where, costType: 'PAID' },
        }),
    ]);

    const activeQueue = openCount + assignedCount + inProgressCount;
    const collectedCharges = Number(chargesSum) || 0;

    return {
      total_tickets: totalTickets,
      active_queue: activeQueue,
      open_count: openCount,
      assigned_count: assignedCount,
      in_progress_count: inProgressCount,
      resolved_count: resolvedCount,
      handed_over_count: handedOverCount,
      closed_count: closedCount,
      free_count: freeCount,
      paid_count: paidCount,
      total_collected_charges: collectedCharges,
      total_collected_charges_formatted: formatBdtCurrency(collectedCharges),
    };
  }

  async findTickets(query: QueryUtilityTicketDto, user?: any) {
    const ctx = extractUserContext(user);
    const where: WhereOptions<CsUtilityTicket> = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      (where as any).organizationId = ctx.orgId;
    }

    if (query.project_id && query.project_id !== 'all') {
      (where as any).projectId = query.project_id;
    }

    if (query.is_deleted) {
      (where as any).deletedAt = { [Op.ne]: null };
    }

    // Tab filter
    if (!query.is_deleted && query.tab) {
      if (query.tab === 'queue') {
        (where as any).status = {
          [Op.in]: ['Open', 'Assigned', 'In Progress'],
        };
      } else if (query.tab === 'open') {
        (where as any).status = 'Open';
      } else if (query.tab === 'assigned') {
        (where as any).status = 'Assigned';
      } else if (query.tab === 'in_progress') {
        (where as any).status = 'In Progress';
      } else if (query.tab === 'resolved') {
        (where as any).status = 'Resolved';
      } else if (query.tab === 'handed_over') {
        (where as any).status = 'Handed Over';
      } else if (query.tab === 'closed') {
        (where as any).status = 'Closed';
      } else if (query.tab === 'free') {
        (where as any).costType = 'FREE';
      } else if (query.tab === 'paid') {
        (where as any).costType = 'PAID';
      }
    }

    if (query.status && query.status !== 'all') {
      (where as any).status = query.status;
    }

    if (query.category) {
      (where as any).category = query.category;
    }

    if (query.priority) {
      (where as any).priority = query.priority;
    }

    if (query.cost_type && query.cost_type !== 'all') {
      (where as any).costType = query.cost_type;
    }

    if (query.technician_id) {
      (where as any).technicianId = query.technician_id;
    }

    if (query.search && query.search.trim()) {
      const q = `%${query.search.trim()}%`;
      (where as any)[Op.or] = [
        { ticketNumber: { [Op.iLike]: q } },
        { customerName: { [Op.iLike]: q } },
        { customerPhone: { [Op.iLike]: q } },
        { unit: { [Op.iLike]: q } },
        { description: { [Op.iLike]: q } },
      ];
    }

    const sortField = query.sort_by || 'queue_serial';
    const sortOrder =
      query.sort_order && query.sort_order.toLowerCase() === 'desc'
        ? 'DESC'
        : 'ASC';

    const offset = query.getOffset();
    const limit = Math.min(100, Math.max(1, query.limit || 10));

    const { count, rows } = await this.ticketModel.findAndCountAll({
      where,
      paranoid: !query.is_deleted,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.technicianModel,
          as: 'technician',
          attributes: [
            'id',
            'uuid',
            'name',
            'phone',
            'specialty',
            'technicianType',
          ],
          required: false,
        },
        {
          model: this.warrantyItemModel,
          as: 'warrantyItem',
          attributes: [
            'id',
            'uuid',
            'itemName',
            'brand',
            'category',
            'warrantyEndDate',
          ],
          required: false,
        },
      ],
      order: [[sortField, sortOrder]],
      offset,
      limit,
    });

    return {
      items: rows.map(toSnakeCaseUtilityTicketItem),
      meta: query.getPaginationMetadata(count),
    };
  }

  async findTicketByUuid(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({
      where,
      include: [
        {
          model: this.projectModel,
          as: 'project',
          attributes: ['id', 'uuid', 'name', 'code'],
          required: false,
        },
        {
          model: this.technicianModel,
          as: 'technician',
          required: false,
        },
        {
          model: this.warrantyItemModel,
          as: 'warrantyItem',
          required: false,
        },
      ],
    });

    if (!ticket) {
      throw new NotFoundException(`Utility ticket "${uuid}" not found`);
    }

    return toSnakeCaseUtilityTicketItem(ticket);
  }

  /**
   * Create Utility Ticket with auto-increment queue serial per project
   * and automatic FREE / PAID computation based on active warranty registry
   */
  async createTicket(dto: CreateUtilityTicketDto, user?: any) {
    const ctx = extractUserContext(user);
    if (!ctx.isSuperAdmin && !ctx.orgId) {
      throw new BadRequestException('Organization context missing for user');
    }

    const project = await this.projectModel.findOne({
      where: {
        uuid: dto.project_id,
      } as any,
    });

    if (!project) {
      throw new NotFoundException(
        `Project with UUID "${dto.project_id}" not found`,
      );
    }

    // 1. Compute FREE / PAID logic based on active warranty item
    let costType: 'FREE' | 'PAID' = 'PAID';
    let estimatedCharge = Number(dto.estimated_charge) || 0;

    if (dto.warranty_item_id) {
      const warrantyItem = await this.warrantyItemModel.findOne({
        where: {
          id: dto.warranty_item_id,
          projectId: dto.project_id,
          ...(ctx.isSuperAdmin || !ctx.orgId
            ? {}
            : { organizationId: ctx.orgId }),
        },
      });

      if (warrantyItem) {
        const today = new Date().toISOString().slice(0, 10);
        if (warrantyItem.warrantyEndDate >= today) {
          // Under active warranty -> 100% FREE!
          costType = 'FREE';
          estimatedCharge = 0.0;
        } else {
          // Warranty expired -> PAID with estimated charge
          costType = 'PAID';
          if (!estimatedCharge) estimatedCharge = 500.0;
        }
      }
    } else {
      costType = 'PAID';
    }

    // 2. Auto-increment FIFO Queue Serial per project
    const maxSerialTicket = await this.ticketModel.findOne({
      where: {
        projectId: dto.project_id,
      },
      order: [['queueSerial', 'DESC']],
      paranoid: false,
    });

    const queueSerial = (maxSerialTicket?.queueSerial || 0) + 1;
    const projectCode = project.code || 'PRJ';
    const ticketNumber = `UTL-${projectCode}-${String(queueSerial).padStart(4, '0')}`;

    // 3. Status determination
    const status = dto.technician_id ? 'Assigned' : 'Open';
    const assignedAt = dto.technician_id ? new Date() : null;

    const ticket = await this.ticketModel.create({
      organizationId: ctx.orgId ?? null,
      projectId: dto.project_id,
      ticketNumber,
      queueSerial,
      unit: dto.unit.trim(),
      customerName: dto.customer_name.trim(),
      customerPhone: dto.customer_phone?.trim() ?? null,
      category: dto.category,
      description: dto.description.trim(),
      priority: dto.priority ?? 'Medium',
      status,
      technicianId: dto.technician_id ?? null,
      warrantyItemId: dto.warranty_item_id ?? null,
      costType,
      estimatedCharge,
      assignedAt,
      createdBy: ctx.userId ?? null,
    });

    return this.findTicketByUuid(ticket.uuid, user);
  }

  async updateTicket(
    uuid: string,
    dto: UpdateUtilityTicketDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Utility ticket "${uuid}" not found`);
    }

    if (dto.unit !== undefined) ticket.unit = dto.unit.trim();
    if (dto.customer_name !== undefined)
      ticket.customerName = dto.customer_name.trim();
    if (dto.customer_phone !== undefined)
      ticket.customerPhone = dto.customer_phone?.trim() || null;
    if (dto.category !== undefined) ticket.category = dto.category;
    if (dto.description !== undefined)
      ticket.description = dto.description.trim();
    if (dto.priority !== undefined) ticket.priority = dto.priority;

    // Recompute FREE / PAID if warranty item updated
    if (dto.warranty_item_id !== undefined) {
      ticket.warrantyItemId = dto.warranty_item_id || null;
      if (ticket.warrantyItemId) {
        const warrantyItem = await this.warrantyItemModel.findOne({
          where: {
            id: ticket.warrantyItemId,
            projectId: ticket.projectId,
            ...(ctx.isSuperAdmin || !ctx.orgId
              ? {}
              : { organizationId: ctx.orgId }),
          },
        });
        const today = new Date().toISOString().slice(0, 10);
        if (warrantyItem && warrantyItem.warrantyEndDate >= today) {
          ticket.costType = 'FREE';
          ticket.estimatedCharge = 0.0;
        } else {
          ticket.costType = 'PAID';
          if (dto.estimated_charge !== undefined) {
            ticket.estimatedCharge = dto.estimated_charge;
          }
        }
      } else {
        ticket.costType = 'PAID';
        if (dto.estimated_charge !== undefined) {
          ticket.estimatedCharge = dto.estimated_charge;
        }
      }
    } else if (dto.estimated_charge !== undefined) {
      ticket.estimatedCharge = dto.estimated_charge;
    }

    if (dto.technician_id !== undefined) {
      ticket.technicianId = dto.technician_id || null;
      if (ticket.technicianId && ticket.status === 'Open') {
        ticket.status = 'Assigned';
        ticket.assignedAt = new Date();
      }
    }

    ticket.updatedBy = ctx.userId ?? null;
    await ticket.save();

    return this.findTicketByUuid(ticket.uuid, user);
  }

  async assignTechnician(
    uuid: string,
    dto: AssignTechnicianDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Utility ticket "${uuid}" not found`);
    }

    const technician = await this.technicianModel.findOne({
      where: {
        id: dto.technician_id,
        ...(ctx.isSuperAdmin || !ctx.orgId
          ? {}
          : { organizationId: ctx.orgId }),
      },
    });

    if (!technician) {
      throw new NotFoundException(
        `Technician ID ${dto.technician_id} not found in your organization`,
      );
    }

    ticket.technicianId = technician.id;
    ticket.status = 'Assigned';
    ticket.assignedAt = new Date();
    ticket.updatedBy = ctx.userId ?? null;
    await ticket.save();

    return this.findTicketByUuid(ticket.uuid, user);
  }

  async updateTicketStatus(
    uuid: string,
    dto: UpdateTicketStatusDto,
    user?: any,
  ) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Utility ticket "${uuid}" not found`);
    }

    ticket.status = dto.status;
    const now = new Date();

    if (dto.status === 'In Progress' && !ticket.assignedAt) {
      ticket.assignedAt = now;
    }

    if (dto.status === 'Resolved') {
      ticket.resolvedAt = now;
      if (dto.resolution_notes) {
        ticket.resolutionNotes = dto.resolution_notes;
      }
      if (dto.actual_charge !== undefined) {
        ticket.actualCharge = dto.actual_charge;
      }
    }

    if (dto.status === 'Handed Over') {
      ticket.handedOverAt = now;
      if (dto.customer_feedback) {
        ticket.customerFeedback = dto.customer_feedback;
      }
      if (dto.customer_rating) {
        ticket.customerRating = dto.customer_rating;
      }
    }

    if (dto.status === 'Closed') {
      ticket.closedAt = now;
    }

    ticket.updatedBy = ctx.userId ?? null;
    await ticket.save();

    return this.findTicketByUuid(ticket.uuid, user);
  }

  async removeTicket(uuid: string, user?: any) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Utility ticket "${uuid}" not found`);
    }

    ticket.deletedBy = ctx.userId ?? null;
    await ticket.save();
    await ticket.destroy();

    return { success: true, message: 'Utility ticket deleted successfully' };
  }

  // ==========================================
  // 4. DROPDOWN METADATA
  // ==========================================

  async getDropdownMeta(projectId?: string, user?: any) {
    const ctx = extractUserContext(user);
    const techWhere: any = { isActive: true };
    const warrantyWhere: any = {};

    if (!ctx.isSuperAdmin && ctx.orgId) {
      techWhere.organizationId = ctx.orgId;
      warrantyWhere.organizationId = ctx.orgId;
    }

    if (projectId && projectId !== 'all') {
      techWhere[Op.or] = [{ projectId }, { projectId: null }];
      warrantyWhere.projectId = projectId;
    }

    const [technicians, warrantyItems] = await Promise.all([
      this.technicianModel.findAll({
        where: techWhere,
        attributes: ['id', 'uuid', 'name', 'phone', 'specialty'],
        order: [['name', 'ASC']],
      }),
      this.warrantyItemModel.findAll({
        where: warrantyWhere,
        attributes: [
          'id',
          'uuid',
          'itemName',
          'brand',
          'unit',
          'category',
          'warrantyEndDate',
        ],
        order: [['itemName', 'ASC']],
      }),
    ]);

    const today = new Date().toISOString().slice(0, 10);

    return {
      categories: ['Plumbing', 'Electrical', 'Sanitary', 'Other'],
      priorities: ['Low', 'Medium', 'High', 'Emergency'],
      statuses: [
        'Open',
        'Assigned',
        'In Progress',
        'Resolved',
        'Handed Over',
        'Closed',
      ],
      technicians: technicians.map((t) => ({
        id: t.id,
        uuid: t.uuid,
        name: t.name,
        phone: t.phone,
        specialty: t.specialty,
      })),
      warranty_items: warrantyItems.map((w) => ({
        id: w.id,
        uuid: w.uuid,
        item_name: w.itemName,
        brand: w.brand,
        unit: w.unit,
        category: w.category,
        warranty_end_date: w.warrantyEndDate,
        is_active_warranty: w.warrantyEndDate >= today,
      })),
    };
  }
}
