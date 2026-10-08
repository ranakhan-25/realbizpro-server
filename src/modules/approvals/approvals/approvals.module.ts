import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SysApprovalHistory } from '../../../database/models/deligation/sys_approval_history.model';
import { SysApprovalRequest } from '../../../database/models/deligation/sys_approval_requests.model';
import { SysApprovalStep } from '../../../database/models/deligation/sys_approval_steps.model';
import { SysApprovalWorkflow } from '../../../database/models/deligation/sys_approval_workflows.model';
import { SysDelegationStatus } from '../../../database/models/deligation/sys_delegation_statuses.model';
import { SysRequestAssignee } from '../../../database/models/deligation/sys_approval_request_assingees.model';
import { SysStepApprover } from '../../../database/models/deligation/sys_step_approvers.model';
import { SysUserDelegation } from '../../../database/models/deligation/sys_user_delegations.model';
import { SysUser } from '../../../database/models/system/sys_user.model';
import { SysNotification } from '../../../database/models/system/sys_notification.model';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { NotificationService } from '../../notifications/notifications.service';
import { FirebaseModule } from '../../firebase/firebase.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      SysApprovalRequest,
      SysApprovalWorkflow,
      SysApprovalHistory,
      SysDelegationStatus,
      SysApprovalStep,
      SysStepApprover,
      SysUser,
      SysUserDelegation,
      SysRequestAssignee,
      SysNotification,
    ]),
    FirebaseModule,
  ],
  providers: [
    ApprovalsService,
    NotificationService,
  ],
  controllers: [ApprovalsController],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
