import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUserId } from '../../../common/decorators/auth.decorators';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApprovalsService } from './approvals.service';
import { ApproveRejectDto } from './dto/approve-reject.dto';
import { PendingApprovalDto } from './dto/pendingApproval.dto';
import { StartApprovalDto } from './dto/start-approval.dto';
import { PermissionsGuard } from '@/common/guards/permissions.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';

@Controller('approvals')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags('System | Approvals')
export class ApprovalsController {
  constructor(
    private approvalsService: ApprovalsService,
  ) {}

  /**
   * Start a new approval process
   */
  @Post('start')
  @Permissions('create_approval')
  @ApiOperation({
    summary: 'Start new approval process',
    description:
      'Initiates a new approval request for a reference record (leave, PR, PO, etc.)',
  })
  @ApiResponse({
    status: 201,
    description:
      'Approval request created successfully',
    schema: {
      example: {
        success: true,
        message:
          'Approval request created successfully',
        data: {
          id: 1,
          workflowId: 1,
          referenceId: 42,
          referenceTable: 'hr_leave_requests',
          currentStep: 1,
          statusId: 2,
          requestedBy: 10,
          sessionVariables: {
            dept_id: 5,
            amount: 1000,
          },
          remarks: 'Urgent leave',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Workflow has no steps or invalid configuration',
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found or inactive',
  })
  async startApproval(
    @CurrentUserId() currentUserId: number,
    @Body() dto: StartApprovalDto,
  ) {
    return await this.approvalsService.startApprovalProcess(
      {
        workflowSlug: dto.workflowSlug,
        referenceId: dto.referenceId,
        remarks: dto.remarks,
        requestedBy: currentUserId,
      },
    );
  }

  /**
   * Get my approval requests
   */
  @Get('my-requests')
  @Permissions('view_my_approvals')
  @ApiOperation({
    summary: 'Get my approval requests',
    description:
      'Retrieves all approval requests initiated by the current user',
  })
  @ApiResponse({
    status: 200,
    description:
      'My requests retrieved successfully',
    schema: {
      example: {
        success: true,
        count: 2,
        data: [
          {
            id: 1,
            workflowId: 1,
            referenceId: 42,
            referenceTable: 'hr_leave_requests',
            currentStep: 2,
            statusId: 2,
            requestedBy: 10,
            sessionVariables: {
              dept_id: 5,
              amount: 1000,
            },
            remarks: 'Urgent leave',
            workflow: {
              id: 1,
              workflowName: 'Leave Approval',
              slug: 'leave-approval',
            },
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
          },
        ],
      },
    },
  })
  async getMyRequests(
    @CurrentUserId() userId: number,
    @Query() query: PendingApprovalDto,
  ) {
    return await this.approvalsService.getPendingApprovals(
      userId,
      query,
    );
  }

  /**
   * Get pending approvals for current user
   */
  @Get('pending')
  @Permissions('view_pending_approvals')
  @ApiOperation({
    summary: 'Get pending approvals',
    description:
      'Retrieves all pending approval requests where the current user is an authorized approver (via direct assignment, condition, or override)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'referenceTable',
    required: false,
    type: String,
    description:
      'Filter by reference table name (e.g., hr_leave_requests, pr_requests)',
    example: 'hr_leave_requests',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pending approvals retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            workflowId: 1,
            referenceId: 42,
            referenceTable: 'hr_leave_requests',
            currentStep: 2,
            statusId: 1,
            requestedBy: 10,
            sessionVariables: { amount: 5000 },
            remarks: 'Urgent',
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
          },
        ],
      },
    },
  })
  async getPendingApprovals(
    @CurrentUserId() userId: number,
    @Query() query: PendingApprovalDto,
  ) {
    return await this.approvalsService.getPendingApprovals(
      userId,
      query,
    );
  }

  @Get('pending/counts-by-workflow')
  @Permissions('view_pending_approval_counts')
  @ApiOperation({
    summary:
      'Get pending approval counts grouped by workflow',
    description:
      'Returns count of pending approvals for current user, grouped by workflow with workflow details (name, slug, reference table)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pending approval counts by workflow retrieved successfully',
  })
  async getPendingApprovalCountsByWorkflow(
    @CurrentUserId() userId: number,
  ) {
    return await this.approvalsService.getPendingApprovalCountsByWorkflow(
      userId,
    );
  }

  /**
   * Approve an approval request
   */
  @Post('approve')
  @Permissions('approve_request')
  @ApiOperation({
    summary: 'Approve an approval request',
    description:
      'Approve a pending approval request. Validates that user is an authorized approver and has not already acted on this request.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request approved successfully',
    schema: {
      example: {
        success: true,
        message:
          'Request approved and moved to next step',
        data: {
          id: 1,
          workflowId: 1,
          referenceId: 42,
          currentStep: 2,
          statusId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Not an approver or already acted',
  })
  @ApiResponse({
    status: 404,
    description:
      'Approval request or step not found',
  })
  async approveRequest(
    @Body() dto: ApproveRejectDto,
    @CurrentUserId() userId: number,
    @Req() req: Request,
  ) {
    return await this.approvalsService.approveRequest(
      {
        requestId: dto.requestId,
        userId: userId,
        comments: dto.comments,
        ipAddress:
          req.ip || req.socket.remoteAddress,
      },
    );
  }

  /**
   * Reject an approval request
   */
  @Post('reject')
  @Permissions('reject_request')
  @ApiOperation({
    summary: 'Reject an approval request',
    description:
      'Reject a pending approval request. One rejection will reject the entire request and update the reference table status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Request rejected successfully',
    schema: {
      example: {
        success: true,
        message: 'Request rejected',
        data: {
          id: 1,
          workflowId: 1,
          referenceId: 42,
          currentStep: 1,
          statusId: 5,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Not an approver or already acted',
  })
  @ApiResponse({
    status: 404,
    description:
      'Approval request or step not found',
  })
  async rejectRequest(
    @Body() dto: ApproveRejectDto,
    @CurrentUserId() userId: number,
    @Req() req: Request,
  ) {
    return await this.approvalsService.rejectRequest(
      {
        requestId: dto.requestId,
        userId: userId,
        comments: dto.comments,
        ipAddress:
          req.ip || req.socket.remoteAddress,
      },
    );
  }

  /**
   * Get approval history
   */
  @Get('history')
  @Permissions('view_approval_history')
  @ApiOperation({
    summary: 'Get approval history',
    description:
      'Retrieves approval history either by requestId OR by referenceTable + referenceId',
  })
  @ApiQuery({
    name: 'requestId',
    required: false,
    type: Number,
    description: 'Approval request ID',
    example: 1,
  })
  @ApiQuery({
    name: 'referenceTable',
    required: false,
    type: String,
    description:
      'Reference table name (e.g., hr_leave_requests)',
    example: 'hr_leave_requests',
  })
  @ApiQuery({
    name: 'referenceId',
    required: false,
    type: Number,
    description:
      'Reference record ID (must be used with referenceTable)',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'History retrieved successfully',
    schema: {
      example: {
        success: true,
        count: 3,
        data: [
          {
            id: 1,
            uuid: '550e8400-e29b-41d4-a716-446655440000',
            requestId: 1,
            stepId: 1,
            actionStatusId: 2,
            comments:
              '[User:5] Approved - looks good',
            ipAddress: '192.168.1.1',
            actionTimestamp:
              '2024-01-01T10:00:00Z',
            request: {
              id: 1,
              workflowId: 1,
              referenceId: 42,
              referenceTable: 'hr_leave_requests',
              currentStep: 1,
              statusId: 2,
              requestedBy: 10,
            },
            step: {
              id: 1,
              stepNumber: 1,
              stepName: 'Manager Approval',
              ruleType: 'ANY',
              isFinal: false,
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request - Missing required parameters',
  })
  async getApprovalHistory(
    @Query('requestId') requestId?: number,
    @Query('referenceTable')
    referenceTable?: string,
    @Query('referenceId') referenceId?: number,
  ) {
    return await this.approvalsService.getApprovalHistory(
      {
        requestId: requestId
          ? Number(requestId)
          : undefined,
        referenceTable: referenceTable,
        referenceId: referenceId
          ? Number(referenceId)
          : undefined,
      },
    );
  }

  @Get('pending/counts')
  @Permissions('view_pending_approval_counts')
  @ApiOperation({
    summary:
      'Get pending approval counts grouped by reference table',
    description:
      'Returns count of pending approvals for current user, grouped by reference table name',
  })
  @ApiResponse({
    status: 200,
    description:
      'Pending approval counts retrieved successfully',
    schema: {
      example: {
        success: true,
        totalCount: 15,
        data: [
          {
            referenceTable: 'hr_leave_requests',
            count: 5,
          },
          {
            referenceTable: 'pr_requests',
            count: 8,
          },
          {
            referenceTable: 'expense_claims',
            count: 2,
          },
        ],
      },
    },
  })
  async getPendingApprovalCounts(
    @CurrentUserId() userId: number,
  ) {
    return await this.approvalsService.getPendingApprovalCounts(
      userId,
    );
  }

  @Get('current-stage')
  @Permissions('view_approval_stage')
  @ApiOperation({
    summary:
      'Get current stage of an approval request',
    description:
      'Get current stage by requestId OR by referenceTable + referenceId',
  })
  @ApiQuery({
    name: 'requestId',
    required: false,
    type: Number,
    description: 'Approval request ID',
  })
  @ApiQuery({
    name: 'referenceTable',
    required: false,
    type: String,
    description: 'Reference table name',
  })
  @ApiQuery({
    name: 'referenceId',
    required: false,
    type: Number,
    description: 'Reference record ID',
  })
  async getCurrentStage(
    @Query('requestId') requestId?: string,
    @Query('referenceTable')
    referenceTable?: string,
    @Query('referenceId') referenceId?: string,
  ) {
    return await this.approvalsService.getCurrentStage(
      {
        requestId: requestId
          ? Number(requestId)
          : undefined,
        referenceTable,
        referenceId: referenceId
          ? Number(referenceId)
          : undefined,
      },
    );
  }
}
