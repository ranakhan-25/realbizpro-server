import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/database/base.model';

import type {
  DemoBookAttributes,
  DemoBookCreationAttributes,
} from '../../types/demobook.types';

@Table({
  tableName: 'sys_demo_book',
  timestamps: true,
  paranoid: true,
  underscored: false,
})
export class DemoBook extends BaseModel<
  DemoBookAttributes,
  DemoBookCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare organizationName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare organizationLocation: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare organizationEmail: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare organizationYear: number;

  // Requested demo date
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare demoDate: string;

  // Person who will be available for the virtual meeting
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare contactPersonName: string;

  // Meeting time (set later, optional)
  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  declare meetingTime?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare tradeLicense: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare createdBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare updatedBy?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare deletedBy?: string | null;
}
