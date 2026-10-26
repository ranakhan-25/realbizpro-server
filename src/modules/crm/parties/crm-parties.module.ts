import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CrmParty } from 'src/database/models/crm/lead/crm-party.model';
import { CrmPartyAssignment } from 'src/database/models/crm/lead/crm-party-assignment.model';
import { CrmPartyCommunication } from 'src/database/models/crm/lead/crm-party-communication.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CrmPartiesController } from './crm-parties.controller';
import { CrmPartiesService } from './crm-parties.service';

@Module({
  imports: [SequelizeModule.forFeature([CrmParty, CrmPartyAssignment, CrmPartyCommunication, SysUser])],
  controllers: [CrmPartiesController],
  providers: [CrmPartiesService],
  exports: [CrmPartiesService],
})
export class CrmPartiesModule {}
