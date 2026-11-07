import type { ShareProjectInvestmentAttributes, ShareProjectInvestmentCreationAttributes } from '../../types/shareprojectinvestment.types';

import { BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';
import { ShareUser } from '../share-user/share-user.model';

export enum ShareProjectInvestmentStatus {
  PREPARED = 'prepared',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Table({ tableName: 'share_project_investments', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectInvestment extends BaseModel<ShareProjectInvestmentAttributes, ShareProjectInvestmentCreationAttributes> {
  @ForeignKey(() => ShareProject)
  @Column({ type: DataType.UUID, allowNull: false, field: 'project_uuid' })
  declare projectId: string;
  @BelongsTo(() => ShareProject, { foreignKey: 'projectId', targetKey: 'uuid' })
  declare project?: ShareProject;

  @ForeignKey(() => ShareUser)
  @Column({ type: DataType.BIGINT, allowNull: false, field: 'investor_id' })
  declare investorId: number;
  @BelongsTo(() => ShareUser, 'investorId')
  declare investor?: ShareUser;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare quantity: number;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'share_price' })
  declare sharePrice: string;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'share_value' })
  declare shareValue: string;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'service_fee' })
  declare serviceFee: string;
  @Column({ type: DataType.DECIMAL(18, 2), allowNull: false, field: 'total_amount' })
  declare totalAmount: string;
  @Column({
    type: DataType.ENUM(...Object.values(ShareProjectInvestmentStatus)),
    allowNull: false,
    defaultValue: ShareProjectInvestmentStatus.PREPARED,
  })
  declare status: ShareProjectInvestmentStatus;
}
