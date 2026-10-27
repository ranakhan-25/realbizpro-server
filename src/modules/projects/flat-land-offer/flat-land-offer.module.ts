import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FlatLand } from 'src/database/models/projects/flatland/pr_flatland.model';
import { FlatLandOffer } from 'src/database/models/projects/flat-land-offer/pr_flat_land_offer.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { ProjectTeamMember } from 'src/database/models/projects/project-team-member/pr_project_team_member.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { FlatLandOfferController } from './flat-land-offer.controller';
import { FlatLandOfferService } from './flat-land-offer.service';

@Module({
  imports: [SequelizeModule.forFeature([Project, FlatLand, FlatLandOffer, ProjectTeamMember, SysUser])],
  controllers: [FlatLandOfferController],
  providers: [FlatLandOfferService],
  exports: [FlatLandOfferService],
})
export class FlatLandOfferModule {}
