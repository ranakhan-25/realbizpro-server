import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { MaterialRequisition } from '../material-requisition/pr_material_requisition.model';
import type {
  SiteAttributes,
  SiteCreationAttributes,
} from 'src/database/types/site.types';
import { Project } from '../project/pr_project.model';
import { BaseModel } from 'src/database/base.model';
import { ProjectShareAssignment } from '../project-share-assignment/pr_project_share_assignment.model';
import { WorkOrder } from '../billing/work-order/pr_work_order.model';

@Table({
  tableName: 'sites',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class Site
  extends BaseModel<
    SiteAttributes,
    SiteCreationAttributes
  >
  implements SiteAttributes
{
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare location?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    targetKey: 'uuid',
    as: 'project',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  declare project?: Project;

  @HasMany(() => MaterialRequisition, {
    foreignKey: 'siteId',
    sourceKey: 'uuid',
    as: 'materialRequisitions',
  })
  declare materialRequisitions?: MaterialRequisition[];

  @HasMany(() => ProjectShareAssignment, {
    foreignKey: 'projectTypeId',
    sourceKey: 'uuid',
    as: 'shareAssignments',
  })
  declare shareAssignments?: ProjectShareAssignment[];
  @HasMany(() => WorkOrder, {
    foreignKey: 'siteId',
    sourceKey: 'uuid',
    as: 'workOrders',
  })
  declare workOrders?: WorkOrder[];
  // ─── Audit fields ───────────────────────────────────────
  @Column({
    type: DataType.INTEGER, // change to STRING / UUID if needed
    allowNull: true,
  })
  declare createdBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare updatedBy?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare deletedBy?: number;
}
