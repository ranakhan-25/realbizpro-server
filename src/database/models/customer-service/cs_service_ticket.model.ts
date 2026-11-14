import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { FlatLandBooking } from '../projects/flat-land-booking/pr_flat_land_booking.model';
import { CsCustomerProfile } from './cs_customer_profile.model';
import { SysUser } from '../system/sys_user.model';
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  TicketReplyItem,
} from './cs_tickets.types';
import type { CsServiceTicketAttributes, CsServiceTicketCreationAttributes } from '../../types/csserviceticket.types';

export { TicketCategory, TicketPriority, TicketStatus, TicketReplyItem };

@Table({
  tableName: 'cs_service_tickets',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_tkt_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_tkt_status',
      fields: ['status'],
    },
    {
      name: 'idx_cs_tkt_priority',
      fields: ['priority'],
    },
    {
      name: 'idx_cs_tkt_category',
      fields: ['category'],
    },
    {
      name: 'idx_cs_tkt_no',
      fields: ['ticket_no'],
    },
  ],
})
export class CsServiceTicket extends TenantBaseModel<CsServiceTicketAttributes, CsServiceTicketCreationAttributes> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'project_id',
  })
  declare projectId?: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'projectDetails',
  })
  declare projectDetails?: Project;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'project_name',
  })
  declare projectName?: string;

  @ForeignKey(() => FlatLandBooking)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'booking_id',
  })
  declare bookingId?: string;

  @BelongsTo(() => FlatLandBooking, {
    foreignKey: 'bookingId',
    targetKey: 'uuid',
    as: 'booking',
  })
  declare booking?: FlatLandBooking;

  @ForeignKey(() => CsCustomerProfile)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'customer_profile_id',
  })
  declare customerProfileId?: number;

  @BelongsTo(() => CsCustomerProfile, {
    foreignKey: 'customerProfileId',
    targetKey: 'id',
    as: 'customerProfile',
  })
  declare customerProfile?: CsCustomerProfile;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'ticket_no',
  })
  declare ticketNo: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'subject',
  })
  declare subject: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'phone',
  })
  declare phone?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'unit',
  })
  declare unit?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    defaultValue: TicketCategory.CIVIL_WORK,
    field: 'category',
  })
  declare category: TicketCategory;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: TicketPriority.MEDIUM,
    field: 'priority',
  })
  declare priority: TicketPriority;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: TicketStatus.OPEN,
    field: 'status',
  })
  declare status: TicketStatus;

  @ForeignKey(() => SysUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'assigned_agent_id',
  })
  declare assignedAgentId?: number;

  @BelongsTo(() => SysUser, {
    foreignKey: 'assignedAgentId',
    targetKey: 'id',
    as: 'assignedUser',
  })
  declare assignedUser?: SysUser;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'assigned_agent',
  })
  declare assignedAgent?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 24,
    field: 'sla_remaining_hours',
  })
  declare slaRemainingHours: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 24,
    field: 'sla_target_hours',
  })
  declare slaTargetHours: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_overdue',
  })
  declare isOverdue: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'due_date',
  })
  declare dueDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolved_at',
  })
  declare resolvedAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'closed_at',
  })
  declare closedAt?: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'remarks',
  })
  declare remarks?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: [],
    field: 'replies',
  })
  declare replies: TicketReplyItem[];
}
