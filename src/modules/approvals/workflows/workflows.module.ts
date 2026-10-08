import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysApprovalStep } from '../../../database/models/deligation/sys_approval_steps.model';
import { SysApprovalWorkflow } from '../../../database/models/deligation/sys_approval_workflows.model';
import { SysRequestAssignee } from '../../../database/models/deligation/sys_approval_request_assingees.model';
import { SysStepApprover } from '../../../database/models/deligation/sys_step_approvers.model';
import { WorkflowsController } from './workflows.controller';
import { WorkflowsService } from './workflows.service';
import { SysApprovalHistory } from '../../../database/models/deligation/sys_approval_history.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysApprovalWorkflow,
      SysApprovalStep,
      SysStepApprover,
      SysRequestAssignee,
      SysApprovalHistory,
    ]),
  ],
  providers: [WorkflowsService],
  controllers: [WorkflowsController],
  exports: [WorkflowsService],
})
export class WorkflowsModule {}
