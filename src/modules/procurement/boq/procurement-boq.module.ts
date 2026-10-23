import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementBoq } from 'src/database/models/procurement/boq/pr_procurement_boq.model';
import { ProcurementBoqItem } from 'src/database/models/procurement/boq/pr_procurement_boq_item.model';
import { ProcurementBoqNote } from 'src/database/models/procurement/boq/pr_procurement_boq_note.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysCompany } from 'src/database/models/system/sys_company.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { Category } from 'src/database/models/procurement/configuration/products/pr_category.model';
import { ProcurementItemEntry } from 'src/database/models/procurement/configuration/products/pr_item_entry.model';
import { ProcurementUnit } from 'src/database/models/procurement/configuration/products/pr_unit.model';
import { ProcurementBoqController } from './procurement-boq.controller';
import { ProcurementBoqService } from './procurement-boq.service';
@Module({ imports: [SequelizeModule.forFeature([ProcurementBoq, ProcurementBoqItem, ProcurementBoqNote, Project, SysCompany, SysUser, Category, ProcurementItemEntry, ProcurementUnit])], controllers: [ProcurementBoqController], providers: [ProcurementBoqService] })
export class ProcurementBoqModule {}
