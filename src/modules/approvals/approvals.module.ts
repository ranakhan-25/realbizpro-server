import { Module } from '@nestjs/common';
import { ApprovalsModule as ApprovalsCoreModule } from './approvals/approvals.module';
import { WorkflowsModule } from './workflows/workflows.module';

@Module({
  imports: [WorkflowsModule, ApprovalsCoreModule],
  exports: [WorkflowsModule, ApprovalsCoreModule],
})
export class ApprovalsModule {}
