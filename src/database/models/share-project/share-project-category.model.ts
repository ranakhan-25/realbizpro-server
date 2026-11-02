import type { ShareProjectCategoryAttributes, ShareProjectCategoryCreationAttributes } from '../../types/shareprojectcategory.types';

import { Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { BaseModel } from '../../base.model';
import { ShareProject } from './share-project.model';

@Table({ tableName: 'share_project_categories', timestamps: true, paranoid: true, underscored: true })
export class ShareProjectCategory extends BaseModel<ShareProjectCategoryAttributes, ShareProjectCategoryCreationAttributes> {
  @Column({ type: DataType.STRING(50), allowNull: false, unique: true })
  declare code: string;
  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;
  @HasMany(() => ShareProject, { foreignKey: 'categoryId', sourceKey: 'id' })
  declare projects?: ShareProject[];
}
