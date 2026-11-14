import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { TenantBaseModel } from '../../tenant-base.model';
import { Project } from '../projects/project/pr_project.model';
import { CsCustomerProfile } from './cs_customer_profile.model';
import type {
  CsWarrantyItemAttributes,
  CsWarrantyItemCreationAttributes,
} from '../../types/cswarrantyitem.types';
import type {
  WarrantyItemCategory,
  WarrantyStatus,
} from './cs_utility.types';

@Table({
  tableName: 'cs_warranty_items',
  timestamps: true,
  paranoid: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_cs_warranty_items_org_proj',
      fields: ['organization_id', 'project_id'],
    },
    {
      name: 'idx_cs_warranty_items_end_date',
      fields: ['warranty_end_date'],
    },
  ],
})
export class CsWarrantyItem extends TenantBaseModel<
  CsWarrantyItemAttributes,
  CsWarrantyItemCreationAttributes
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
    type: DataType.STRING(100),
    allowNull: false,
    field: 'unit',
  })
  declare unit: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: true,
    field: 'customer_name',
  })
  declare customerName?: string | null;

  @ForeignKey(() => CsCustomerProfile)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'customer_profile_id',
  })
  declare customerProfileId?: number | null;

  @BelongsTo(() => CsCustomerProfile, {
    foreignKey: 'customerProfileId',
    targetKey: 'id',
    as: 'customerProfile',
  })
  declare customerProfile?: CsCustomerProfile;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'item_name',
  })
  declare itemName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'category',
  })
  declare category: WarrantyItemCategory;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'brand',
  })
  declare brand: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'model_no',
  })
  declare modelNo?: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'serial_number',
  })
  declare serialNumber?: string | null;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'location',
  })
  declare location: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'quantity',
  })
  declare quantity: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'warranty_start_date',
  })
  declare warrantyStartDate: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'warranty_end_date',
  })
  declare warrantyEndDate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'coverage_details',
  })
  declare coverageDetails?: string | null;

  /**
   * Helper to get real-time dynamic warranty status
   */
  getWarrantyStatus(): WarrantyStatus {
    const today = new Date().toISOString().slice(0, 10);
    if (this.warrantyEndDate < today) {
      return 'Expired';
    }
    const end = new Date(this.warrantyEndDate);
    const now = new Date();
    const diffDays = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 30) {
      return 'Expiring Soon';
    }
    return 'Active';
  }
}
