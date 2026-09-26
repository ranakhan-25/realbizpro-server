import {
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '@/database/base.model';
import { StatusEnum } from '@/database/enum/status.enum';
import { SysCountries } from '../sys_countries.model';
import {
  SysSupplierAttributes,
  SysSupplierCreationAttributes,
} from '../../../types/syssupplier.types';

@Table({
  tableName: 'sys_suppliers',
  timestamps: true,
  paranoid: true,
  underscored: true,
})
export class SysSupplier extends BaseModel<
  SysSupplierAttributes,
  SysSupplierCreationAttributes
> {
  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    field: 'supplier_name',
  })
  declare supplierName: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    field: 'code',
  })
  declare code: string;

  @Column({
    type: DataType.ENUM(
      'Local',
      'Import',
      'Exempted',
      'Service',
    ),
    allowNull: false,
    field: 'type',
  })
  declare type:
    | 'Local'
    | 'Import'
    | 'Exempted'
    | 'Service';

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'contact_name',
  })
  declare contactName: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'phone',
  })
  declare phone: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'email',
  })
  declare email: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'mobile',
  })
  declare mobile: string | null;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    field: 'bin',
  })
  declare bin: string | null;

  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    field: 'nid_no',
  })
  declare nidNo: string | null;

  @Column({
    type: DataType.ENUM(
      'Vat Applicable',
      'Zero Vat',
      'Vat Exempted',
    ),
    allowNull: true,
    field: 'vat_status',
  })
  declare vatStatus:
    | 'Vat Applicable'
    | 'Zero Vat'
    | 'Vat Exempted'
    | null;

  @ForeignKey(() => SysCountries)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'country_id',
  })
  declare countryId: number;

  @Column({
    type: DataType.ENUM(
      ...Object.values(StatusEnum),
    ),
    allowNull: false,
    defaultValue: StatusEnum.ACTIVE,
    field: 'status',
  })
  declare status: StatusEnum;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'address',
  })
  declare address: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'note',
  })
  declare note: string | null;
}
