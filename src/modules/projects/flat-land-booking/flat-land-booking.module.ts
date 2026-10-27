import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandBooking } from 'src/database/models/projects/flat-land-booking/pr_flat_land_booking.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { FlatLandBookingController } from './flat-land-booking.controller';
import { FlatLandReportController } from './flat-land-report.controller';
import { FlatLandBookingService } from './flat-land-booking.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, FlatLand, FlatLandBooking, ProjectTeamMember, SysUser])],
  controllers: [FlatLandReportController, FlatLandBookingController],
  providers: [FlatLandBookingService],
  exports: [FlatLandBookingService],
})
export class FlatLandBookingModule {}
