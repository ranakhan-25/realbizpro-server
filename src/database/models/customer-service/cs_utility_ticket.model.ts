import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { CsUtilityTechnician } from './cs_utility_technician.model';
import { CsWarrantyItem } from './cs_warranty_item.model';
import type {
  CsUtilityTicketAttributes,
  CsUtilityTicketCreationAttributes,
} from '../../types/csutilityticket.types';
import type {
  UtilityTicketCategory,
  UtilityTicketCostType,
  UtilityTicketPriority,
  UtilityTicketStatus,
} from './cs_utility.types';

@Table({
  tableName: 'cs_utility_tickets',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_utility_tickets_org_proj_serial',
      fields: ['organization_id', 'project_id', 'queue_serial'],
    },
    {
      name: 'idx_cs_utility_tickets_status',
      fields: ['status'],
    },
  ],
})
export class CsUtilityTicket extends TenantBaseModel<
  CsUtilityTicketAttributes,
  CsUtilityTicketCreationAttributes
> {
  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'project_id',
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
  })
  declare project?: Project;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
    field: 'ticket_number',
  })
  declare ticketNumber: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'queue_serial',
  })
  declare queueSerial: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'unit',
  })
  declare unit: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'customer_name',
  })
  declare customerName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'customer_phone',
  })
  declare customerPhone?: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'category',
  })
  declare category: UtilityTicketCategory;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description',
  })
  declare description: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'Medium',
    field: 'priority',
  })
  declare priority: UtilityTicketPriority;

  @Column({
    type: DataType.STRING(30),
    allowNull: false,
    defaultValue: 'Open',
    field: 'status',
  })
  declare status: UtilityTicketStatus;

  @ForeignKey(() => CsUtilityTechnician)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'technician_id',
  })
  declare technicianId?: number | null;

  @BelongsTo(() => CsUtilityTechnician, {
    foreignKey: 'technicianId',
    as: 'technician',
  })
  declare technician?: CsUtilityTechnician;

  @ForeignKey(() => CsWarrantyItem)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'warranty_item_id',
  })
  declare warrantyItemId?: number | null;

  @BelongsTo(() => CsWarrantyItem, {
    foreignKey: 'warrantyItemId',
    as: 'warrantyItem',
  })
  declare warrantyItem?: CsWarrantyItem;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    defaultValue: 'PAID',
    field: 'cost_type',
  })
  declare costType: UtilityTicketCostType;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0,
    field: 'estimated_charge',
  })
  declare estimatedCharge: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: true,
    field: 'actual_charge',
  })
  declare actualCharge?: number | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'assigned_at',
  })
  declare assignedAt?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'resolved_at',
  })
  declare resolvedAt?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'handed_over_at',
  })
  declare handedOverAt?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'closed_at',
  })
  declare closedAt?: Date | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'resolution_notes',
  })
  declare resolutionNotes?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'customer_feedback',
  })
  declare customerFeedback?: string | null;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'customer_rating',
  })
  declare customerRating?: number | null;
}
