import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CsServiceTicket } from 'src/database/models/customer-service/cs_service_ticket.model';
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketReplyItem,
} from 'src/database/models/customer-service/cs_tickets.types';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { extractUserContext } from '../common/customer-service-context.helper';
import {
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
  QueryServiceTicketDto,
  CreateTicketReplyDto,
} from './dto';

export function toSnakeCaseTicketItem(t: CsServiceTicket) {
  let remainingHours = t.slaRemainingHours;
  let isOverdue = t.isOverdue;
  if (t.dueDate) {
    const diffMs = new Date(t.dueDate).getTime() - Date.now();
    remainingHours = Math.round(diffMs / (1000 * 60 * 60));
    if (remainingHours <= 0 && t.status !== TicketStatus.RESOLVED && t.status !== TicketStatus.CLOSED) {
      isOverdue = true;
    }
  }

  return {
    id: t.ticketNo || `TKT-${t.id}`,
    uuid: t.uuid,
    ticket_no: t.ticketNo,
    ticketNo: t.ticketNo,
    subject: t.subject,
    customer_name: t.customerName,
    customerName: t.customerName,
    phone: t.phone || '',
    unit: t.unit || '',
    project: t.projectName || t.projectDetails?.name || 'Assigned Project',
    project_id: t.projectId ?? null,
    booking_id: t.bookingId ?? null,
    customer_profile_id: t.customerProfileId ?? null,
    category: t.category,
    priority: t.priority,
    status: t.status,
    assigned_agent: t.assignedAgent || 'Unassigned',
    assignedAgent: t.assignedAgent || 'Unassigned',
    assigned_agent_id: t.assignedAgentId ?? null,
    sla_remaining_hours: remainingHours,
    slaRemainingHours: remainingHours,
    sla_target_hours: t.slaTargetHours,
    is_overdue: isOverdue,
    isOverdue: isOverdue,
    due_date: t.dueDate ?? null,
    resolved_at: t.resolvedAt ?? null,
    closed_at: t.closedAt ?? null,
    remarks: t.remarks ?? null,
    replies: t.replies || [],
    created_at: t.createdAt,
    createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : '',
    updated_at: t.updatedAt,
    updatedAt: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '',
  };
}

@Injectable()
export class CustomerServiceTicketsService {
  private readonly logger = new Logger(CustomerServiceTicketsService.name);

  constructor(
    @InjectModel(CsServiceTicket)
    private readonly ticketModel: typeof CsServiceTicket,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  private async generateTicketNo(): Promise<string> {
    const year = new Date().getFullYear();
    try {
      const [rows]: any = await this.ticketModel.sequelize!.query(
        `SELECT COALESCE(
          MAX(
            NULLIF(
              regexp_replace(ticket_no, '[^0-9]', '', 'g'),
              ''
            )::integer
          ),
          ${year}000
        ) AS max_code_num FROM cs_service_tickets`
      );
      let nextNum = Math.max(Number(`${year}300`), Number(rows?.[0]?.max_code_num || 0)) + 1;
      while (true) {
        const candidate = `TKT-${year}-${String(nextNum).slice(-5).padStart(5, '0')}`;
        const [existing]: any = await this.ticketModel.sequelize!.query(
          `SELECT id FROM cs_service_tickets WHERE ticket_no = :candidate LIMIT 1`,
          { replacements: { candidate } }
        );
        if (!existing || existing.length === 0) {
          return candidate;
        }
        nextNum++;
      }
    } catch {
      const count = await this.ticketModel.count({ paranoid: false });
      return `TKT-${year}-${String(300 + count + Math.floor(Math.random() * 500)).padStart(5, '0')}`;
    }
  }

  private calculateSlaHours(priority: TicketPriority): number {
    switch (priority) {
      case TicketPriority.URGENT:
        return 4;
      case TicketPriority.HIGH:
        return 12;
      case TicketPriority.LOW:
        return 48;
      case TicketPriority.MEDIUM:
      default:
        return 24;
    }
  }

  async getTicketStats(user: any, projectId?: string) {
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

    const [totalTickets, openTickets, inProgress, escalated, resolved, overdue, deletedTickets] = await Promise.all([
      this.ticketModel.count({ where }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.OPEN } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.IN_PROGRESS } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.ESCALATED } }),
      this.ticketModel.count({ where: { ...where, status: TicketStatus.RESOLVED } }),
      this.ticketModel.count({
        where: {
          ...where,
          [Op.or]: [
            { isOverdue: true },
            {
              dueDate: { [Op.lt]: new Date() },
              status: { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] },
            },
          ],
        },
      }),
      this.ticketModel.count({
        where: {
          ...where,
          deletedAt: { [Op.ne]: null },
        },
        paranoid: false,
      }),
    ]);

    const resolvedRate = totalTickets > 0 ? Math.round((resolved / totalTickets) * 100) : 0;

    return {
      total_tickets: totalTickets,
      open_tickets: openTickets,
      in_progress: inProgress,
      escalated_tickets: escalated,
      resolved_tickets: resolved,
      overdue_tickets: overdue,
      resolved_rate: resolvedRate,
      all_count: totalTickets,
      deleted_tickets: deletedTickets,
      deleted_count: deletedTickets,
    };
  }

  async findAllTickets(user: any, query: QueryServiceTicketDto) {
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
    if (query.category) {
      where.category = query.category;
    }
    if (query.priority) {
      where.priority = query.priority;
    }
    if (query.status) {
      where.status = query.status;
    }

    // Tab based filtering
    if (query.tab) {
      const t = query.tab.toLowerCase();
      if (t === 'my') {
        where[Op.or] = [
          { assignedAgentId: ctx.userId },
          { assignedAgent: { [Op.iLike]: `%${user?.name || user?.username || ''}%` } },
        ];
      } else if (t === 'unassigned') {
        where[Op.or] = [
          { assignedAgentId: null },
          { assignedAgent: { [Op.iLike]: '%unassigned%' } },
        ];
      } else if (t === 'open') {
        where.status = TicketStatus.OPEN;
      } else if (t === 'in-progress') {
        where.status = TicketStatus.IN_PROGRESS;
      } else if (t === 'pending') {
        where.status = TicketStatus.PENDING_CUSTOMER;
      } else if (t === 'overdue') {
        where[Op.or] = [
          { isOverdue: true },
          {
            dueDate: { [Op.lt]: new Date() },
            status: { [Op.notIn]: [TicketStatus.RESOLVED, TicketStatus.CLOSED] },
          },
        ];
      } else if (t === 'escalated') {
        where.status = TicketStatus.ESCALATED;
      } else if (t === 'resolved') {
        where.status = TicketStatus.RESOLVED;
      } else if (t === 'closed') {
        where.status = TicketStatus.CLOSED;
      } else if (t === 'reopened') {
        where.status = TicketStatus.REOPENED;
      }
    }

    const search = query.search?.trim();
    if (search) {
      where[Op.or] = [
        { ticketNo: { [Op.iLike]: `%${search}%` } },
        { subject: { [Op.iLike]: `%${search}%` } },
        { customerName: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } },
        { unit: { [Op.iLike]: `%${search}%` } },
        { assignedAgent: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const isDeleted =
      query.is_deleted === true ||
      String(query.is_deleted) === 'true' ||
      query.isDeleted === true ||
      String(query.isDeleted) === 'true' ||
      query.tab === 'deleted';

    if (isDeleted) {
      where.deletedAt = { [Op.ne]: null };
    }

    const { rows, count } = await this.ticketModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      paranoid: !isDeleted,
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
      items: rows.map((r) => toSnakeCaseTicketItem(r)),
      meta: {
        total: count,
        page,
        limit,
        total_pages: Math.ceil(count / limit),
      },
    };
  }

  async findTicketByUuid(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({
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
    if (!ticket) {
      throw new NotFoundException(`Ticket with UUID ${uuid} not found`);
    }
    return toSnakeCaseTicketItem(ticket);
  }

  async createTicket(user: any, dto: CreateServiceTicketDto) {
    const ctx = extractUserContext(user);
    const orgId = ctx.orgId || 1;

    const priority = dto.priority || TicketPriority.MEDIUM;
    const slaTargetHours = this.calculateSlaHours(priority);
    const dueDate = new Date(Date.now() + slaTargetHours * 60 * 60 * 1000);

    let attempts = 0;
    while (attempts < 5) {
      try {
        const ticketNo = await this.generateTicketNo();
        const record = await this.ticketModel.create({
          organizationId: orgId,
          projectId: dto.project_id || undefined,
          projectName: dto.project_name?.trim() || null,
          bookingId: dto.booking_id || undefined,
          customerProfileId: dto.customer_profile_id || undefined,
          ticketNo,
          subject: dto.subject.trim(),
          customerName: dto.customer_name.trim(),
          phone: dto.phone?.trim() || null,
          unit: dto.unit?.trim() || null,
          category: dto.category || TicketCategory.CIVIL_WORK,
          priority,
          status: dto.status || TicketStatus.OPEN,
          assignedAgentId: dto.assigned_agent_id || undefined,
          assignedAgent: dto.assigned_agent?.trim() || 'Unassigned',
          slaTargetHours,
          slaRemainingHours: slaTargetHours,
          isOverdue: false,
          dueDate,
          remarks: dto.remarks?.trim() || null,
          replies: [
            {
              id: `rep-init-${Date.now()}`,
              sender: user?.name || user?.username || 'Customer Service Desk',
              role: 'System Logger',
              message: `Ticket opened with priority [${priority}] and SLA target [${slaTargetHours}h].`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
          createdBy: ctx.userId,
        } as any);

        return toSnakeCaseTicketItem(record);
      } catch (err: any) {
        if (err.name === 'SequelizeUniqueConstraintError' && attempts < 4) {
          attempts++;
          continue;
        }
        throw err;
      }
    }
    throw new BadRequestException('Failed to create ticket after multiple attempts');
  }

  async updateTicket(user: any, uuid: string, dto: UpdateServiceTicketDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Ticket with UUID ${uuid} not found`);
    }

    if (dto.subject) ticket.subject = dto.subject.trim();
    if (dto.customer_name) ticket.customerName = dto.customer_name.trim();
    if (dto.phone !== undefined) ticket.phone = dto.phone ? dto.phone.trim() : undefined;
    if (dto.unit !== undefined) ticket.unit = dto.unit ? dto.unit.trim() : undefined;
    if (dto.category) ticket.category = dto.category;
    if (dto.priority) {
      ticket.priority = dto.priority;
      ticket.slaTargetHours = this.calculateSlaHours(dto.priority);
    }
    if (dto.status) {
      ticket.status = dto.status;
      if (dto.status === TicketStatus.RESOLVED && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
      }
      if (dto.status === TicketStatus.CLOSED && !ticket.closedAt) {
        ticket.closedAt = new Date();
      }
    }
    if (dto.assigned_agent_id !== undefined) ticket.assignedAgentId = dto.assigned_agent_id;
    if (dto.assigned_agent !== undefined) ticket.assignedAgent = dto.assigned_agent?.trim() || 'Unassigned';
    if (dto.remarks !== undefined) ticket.remarks = dto.remarks?.trim() || null;
    ticket.updatedBy = ctx.userId;

    await ticket.save();
    return toSnakeCaseTicketItem(ticket);
  }

  async addReply(user: any, uuid: string, dto: CreateTicketReplyDto) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Ticket with UUID ${uuid} not found`);
    }

    const currentReplies = Array.isArray(ticket.replies) ? [...ticket.replies] : [];
    const newReply: TicketReplyItem = {
      id: `rep-${Date.now()}`,
      sender_id: ctx.userId ?? null,
      sender: user?.name || user?.username || 'Customer Service Agent',
      role: dto.role || 'Service Representative',
      message: dto.message.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    currentReplies.push(newReply);
    ticket.replies = currentReplies;

    if (dto.status && Object.values(TicketStatus).includes(dto.status as any)) {
      ticket.status = dto.status as any;
      if (dto.status === TicketStatus.RESOLVED && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
      }
    }
    ticket.updatedBy = ctx.userId;

    await ticket.save();
    return toSnakeCaseTicketItem(ticket);
  }

  async removeTicket(user: any, uuid: string) {
    const ctx = extractUserContext(user);
    const where: any = { uuid };
    if (!ctx.isSuperAdmin && ctx.orgId) {
      where.organizationId = ctx.orgId;
    } else if (ctx.orgId) {
      where.organizationId = ctx.orgId;
    }

    const ticket = await this.ticketModel.findOne({ where });
    if (!ticket) {
      throw new NotFoundException(`Ticket with UUID ${uuid} not found`);
    }

    ticket.deletedBy = ctx.userId;
    await ticket.save();
    await ticket.destroy();

    return { success: true, message: `Ticket ${ticket.ticketNo} deleted successfully` };
  }
}
