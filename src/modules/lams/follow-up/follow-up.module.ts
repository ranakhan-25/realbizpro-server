import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FollowUp } from '../../../database/models/lams/follow-up.model';
import { FollowUpController } from './follow-up.controller';
import { FollowUpService } from './follow-up.service';

@Module({
  imports: [SequelizeModule.forFeature([FollowUp])],
  controllers: [FollowUpController],
  providers: [FollowUpService],
})
export class FollowUpModule {}
