import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  Model,
  PrimaryKey,
  UpdatedAt,
} from 'sequelize-typescript';

export abstract class BaseModel<
  T extends object = any,
  C extends object = T,
> extends Model<T, C> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  declare id: number;

  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    field: 'uuid',
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'deleted_at',
  })
  declare deletedAt?: Date;
}
