import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LamsApproval } from '../../../database/models/lams/approval.model';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';

@Module({
  imports: [SequelizeModule.forFeature([LamsApproval])],
  controllers: [ApprovalController],
  providers: [ApprovalService],
  exports: [ApprovalService],
})
export class ApprovalModule {}
