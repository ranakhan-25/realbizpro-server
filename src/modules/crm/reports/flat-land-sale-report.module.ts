import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrSaleAgreement } from 'src/database/models/credit-realization/cr_sale_agreement.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { FlatLandSaleReportController } from './flat-land-sale-report.controller';
import { FlatLandSaleReportService } from './flat-land-sale-report.service';

@Module({
  imports: [SequelizeModule.forFeature([FlatLandBooking, FlatLand, Project, ProjectTeamMember, SysUser, CrSaleAgreement])],
  controllers: [FlatLandSaleReportController],
  providers: [FlatLandSaleReportService],
})
export class FlatLandSaleReportModule {}
