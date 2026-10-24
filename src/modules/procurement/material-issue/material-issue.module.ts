import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProcurementGrn } from 'src/database/models/procurement/grn/pr_grn.model';
import { ProcurementGrnItem } from 'src/database/models/procurement/grn/pr_grn_item.model';
import { ProcurementMaterialIssue } from 'src/database/models/procurement/material-issue/pr_material_issue.model';
import { ProcurementMaterialIssueItem } from 'src/database/models/procurement/material-issue/pr_material_issue_item.model';
import { MaterialIssueController } from './material-issue.controller';
import { MaterialIssueService } from './material-issue.service';

@Module({
  imports: [SequelizeModule.forFeature([SysUser, ProcurementGrn, ProcurementGrnItem, ProcurementMaterialIssue, ProcurementMaterialIssueItem])],
  controllers: [MaterialIssueController],
  providers: [MaterialIssueService],
  exports: [MaterialIssueService],
})
export class MaterialIssueModule {}
