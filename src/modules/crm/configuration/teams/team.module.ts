import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [SequelizeModule.forFeature([LeadTeam, LeadTeamMember, SysUser])],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
