import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from '../../base.model';

import type {
  SysUserAttributes,
  SysUserCreationAttributes,
} from '../../types/sysuser.types';

import { SysFileModel } from './sys_file.model';
import { SysModules } from './sys_module.model';
import { SysModuleToUser } from './sys_module_to_user.model';
import { SysPermission } from './sys_permission.model';
import { SysRole } from './sys_role.model';
import { SysUserPermission } from './sys_user_permission.model';
import { SysUserRole } from './sys_user_role.model';
import { SysUserSection } from './sys_user_section.model';
import { SysUserToken } from './sys_user_token.model';
import { SysCompany } from './sys_company.model';
import { SysUserCompany } from './sys_user_company.model';

export enum UserTypeEnum {
  SHOWROOM = 'Showroom',
  DISTRIBUTION = 'Distribution',
  WAREHOUSE = 'Warehouse',
  FACTORY = 'Factory',
  PRODUCTION_UNIT = 'Production Unit',
  HEAD_OFFICE = 'Head Office',
  OFFICE = 'Office',
  EMPLOYEE = 'Employee',
  POS = 'Pos',
}

@Table({
  tableName: 'sys_users',
  timestamps: true,
  underscored: true,
})
export class SysUser
  extends BaseModel<
    SysUserAttributes,
    SysUserCreationAttributes
  >
  implements SysUserAttributes
{
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: 'name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
    field: 'email',
  })
  declare email: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    unique: true,
    field: 'mobile',
  })
  declare mobile?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    field: 'password',
  })
  declare password: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    field: 'user_code',
  })
  declare userCode?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: 'designation',
  })
  declare designationName?: string;

  @ForeignKey(() => SysFileModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'file_id',
  })
  declare fileId?: number;

  @BelongsTo(() => SysFileModel, 'fileId')
  declare avatar?: SysFileModel;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: 'fcm_token',
  })
  declare fcmToken?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'receiving_point_id',
  })
  declare receivingPointId?: number;

  //column employee id belongs to model HrmEmployee
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'employee_id',
  })
  declare employeeId?: number;

  //relation with distribution when distribution user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'distribution_id',
  })
  declare distributionId?: number;

  //relation with warehouse when warehouse user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'warehouse_id',
  })
  declare warehouseId?: number;

  //relation with factory when factory user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'factory_id',
  })
  declare factoryId?: number;

  //relation with production unit when Production Unit user
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'unit_id',
  })
  declare unitId?: number;

  @Column({
    field: 'user_type',
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: UserTypeEnum.OFFICE,
  })
  declare userType: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'refresh_token_expires_at',
  })
  declare refreshTokenExpiresAt?: Date | null;

  //designation id foreign key
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    field: 'designation_id',
  })
  declare designationId?: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_login_at',
  })
  declare lastLoginAt?: Date;

  @BelongsToMany(() => SysRole, {
    through: () => SysUserRole,
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles',
  })
  declare roles?: SysRole[];

  @BelongsToMany(() => SysModules, {
    through: () => SysModuleToUser,
    foreignKey: 'user_id',
    otherKey: 'module_id',
    as: 'modules',
  })
  declare modules?: SysModules[];

  @BelongsToMany(() => SysPermission, {
    through: () => SysUserPermission,
    foreignKey: 'user_id',
    otherKey: 'permission_id',
    as: 'permissions',
  })
  declare permissions?: SysPermission[];

  @HasMany(() => SysUserToken, 'userId')
  declare tokens?: SysUserToken[];

  // Direct access to pivot table records
  @HasMany(() => SysUserPermission, 'userId')
  declare userPermissions?: SysUserPermission[];

  @BelongsToMany(() => SysCompany, {
    through: () => SysUserCompany,
    foreignKey: 'user_id',
    otherKey: 'company_id',
    as: 'companies',
  })
  declare companies?: SysCompany[];

  @HasMany(() => SysUserCompany, 'userId')
  declare userCompanies?: SysUserCompany[];

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare firstName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare lastName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare username?: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
  })
  declare phone?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  declare isSuperUser?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  declare isActive?: boolean;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare passwordHash?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare refreshToken?: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'last_logout_at',
  })
  declare lastLogoutAt?: Date | null;

  // Helper method to check if refresh token is valid
  isRefreshTokenValid(): boolean {
    if (
      !this.refreshToken ||
      !this.refreshTokenExpiresAt
    ) {
      return false;
    }
    return (
      new Date() < this.refreshTokenExpiresAt
    );
  }
}
