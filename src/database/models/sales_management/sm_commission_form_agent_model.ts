import {
  Table, Column, Model, DataType, PrimaryKey, Default,
  CreatedAt, UpdatedAt, DeletedAt, HasMany, Index
} from 'sequelize-typescript';
import { Commission } from './sm_commission_form_model';

@Table({ tableName: 'commission_agents', timestamps: true, paranoid: true, underscored: true })
export class Agent extends Model<Agent> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  @Column({ type: DataType.UUID, field: 'id' })
  declare uuid: string;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare role: string | null;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  declare deals: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare avatar: string | null;

  @HasMany(() => Commission)
  declare commissions: Commission[];

  @CreatedAt @Column({ field: 'created_at' }) declare createdAt: Date;
  @UpdatedAt @Column({ field: 'updated_at' }) declare updatedAt: Date;
  @DeletedAt @Column({ field: 'deleted_at' }) declare deletedAt: Date | null;
}
