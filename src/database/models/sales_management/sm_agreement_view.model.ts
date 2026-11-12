import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

export enum AgreementStatus {
  SIGNED = 'Signed',
  PENDING = 'Pending',
  DRAFT = 'Draft',
}

export enum PropertyType {
  RESIDENTIAL_LAND = 'Residential Land',
  APARTMENT = 'Apartment',
  COMMERCIAL = 'Commercial',
  VILLA = 'Villa',
}

@Table({
  tableName: 'agreements',
  timestamps: true,
  paranoid: true, // enables soft-delete (deletedAt)
  underscored: true,
  indexes: [
    {
      name: 'agreements_agreement_code',
      unique: true,
      fields: ['agreement_code'],
    },
  ],
})
export class Agreement extends Model<Agreement> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: 'agreement_code',
  })
  declare agreementCode: string;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare buyer: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: 'buyer_avatar' })
  declare buyerAvatar: string | null;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare property: string;

  @Column({ type: DataType.STRING(50), allowNull: false, field: 'property_code' })
  declare propertyCode: string;

  @Column({
    type: DataType.ENUM(...Object.values(PropertyType)),
    allowNull: false,
    field: 'property_type',
  })
  declare propertyType: PropertyType;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare price: number;

  @Column({ type: DataType.DECIMAL(15, 2), allowNull: false })
  declare advance: number;

  @Column({ type: DataType.DATEONLY, allowNull: false, field: 'agreement_date' })
  declare date: string;

  @Default(AgreementStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(AgreementStatus)),
    allowNull: false,
  })
  declare status: AgreementStatus;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare image: string | null;

  @Column({ type: DataType.STRING(120), allowNull: true })
  declare buyerEmail: string | null;

  @Column({ type: DataType.STRING(30), allowNull: true })
  declare buyerPhone: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare notes: string | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  declare updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  declare deletedAt: Date | null;
}
