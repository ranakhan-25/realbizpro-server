import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUserId } from '../../../common/decorators/auth.decorators';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { CreateStepDto } from './dto/create-step.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { WorkflowsService } from './workflows.service';

@Controller('approvals/workflows')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
@ApiTags('System | Approval Workflows')
export class WorkflowsController {
  constructor(
    private workflowsService: WorkflowsService,
  ) {}

  // ========================================
  // WORKFLOW ENDPOINTS
  // ========================================

  /**
   * Create new approval workflow
   */
  @Post()
  @Permissions('create_workflow')
  @ApiOperation({
    summary: 'Create approval workflow',
    description:
      'Creates a new approval workflow definition',
  })
  @ApiResponse({
    status: 201,
    description: 'Workflow created successfully',
    schema: {
      example: {
        success: true,
        message: 'Workflow created successfully',
        data: {
          id: 1,
          uuid: '550e8400-e29b-41d4-a716-446655440000',
          workflowName: 'Leave Request Approval',
          slug: 'leave_request_workflow',
          sessionVariable: 'dept_id,amount,grade',
          delegationVersion: 'v1',
          draftStatusId: 1,
          initiateApproveStatusId: 2,
          afterApproveStatusId: 3,
          afterDeclineStatusId: 4,
          isActive: true,
          createdAt: '2024-01-01T10:00:00Z',
        },
      },
    },
  })
  async createWorkflow(
    @Body() dto: CreateWorkflowDto,
    @CurrentUserId() userId: number,
  ) {
    return this.workflowsService.createWorkflow(
      dto,
      userId,
    );
  }

  /**
   * List all workflows
   */
  @Get()
  @Permissions('view_workflows')
  @ApiOperation({
    summary: 'List all workflows',
    description:
      'Retrieves all approval workflows with their steps and approvers',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description:
      'Workflows retrieved successfully',
    schema: {
      example: {
        success: true,
        count: 5,
        data: [
          {
            id: 1,
            workflowName:
              'Leave Request Approval',
            slug: 'leave_request_workflow',
            isActive: true,
            steps: [
              {
                id: 1,
                stepNumber: 1,
                stepName: 'Department Manager',
                ruleType: 'ANY',
                approvers: [
                  {
                    id: 1,
                    approverId: 5,
                    approverType: 'USER',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  })
  async listWorkflows(
    @Query('isActive') isActive?: boolean,
  ) {
    return this.workflowsService.listWorkflows(
      isActive,
    );
  }

  //get by slug
  @Get('slug/:slug')
  @Permissions('view_workflow')
  @ApiOperation({
    summary: 'Get workflow by slug',
    description:
      'Retrieves a specific workflow by its unique slug identifier',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Workflow slug',
    example: 'leave_request_workflow',
  })
  @ApiResponse({
    status: 200,
    description:
      'Workflow retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
  })
  async getWorkflowBySlug(
    @Param('slug') slug: string,
  ) {
    return this.workflowsService.getWorkflowBySlug(
      slug,
    );
  }

  /**
   * Get workflow with steps and approvers
   */
  @Get(':id')
  @Permissions('view_workflow')
  @ApiOperation({
    summary: 'Get workflow details',
    description:
      'Retrieves a specific workflow with all steps and approvers',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Workflow ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description:
      'Workflow retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
  })
  async getWorkflow(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workflowsService.getWorkflow(id);
  }

  /**
   * Update workflow
   */
  @Put(':id')
  @Permissions('update_workflow')
  @ApiOperation({
    summary: 'Update workflow',
    description:
      'Updates workflow details (name, slug, status IDs, etc.)',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Workflow ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Workflow updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
  })
  async updateWorkflow(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateWorkflowDto,
    @CurrentUserId() userId: number,
  ) {
    return this.workflowsService.updateWorkflow(
      id,
      dto,
      userId,
    );
  }

  //get all steps by workflow id
  @Get(':workflowId/steps')
  @Permissions('view_workflow_steps')
  @ApiOperation({
    summary: 'Get all steps by workflow ID',
    description:
      'Retrieves all steps associated with a specific workflow ID',
  })
  @ApiParam({
    name: 'workflowId',
    type: Number,
    description: 'Workflow ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Steps retrieved successfully',
  })
  async getStepsByWorkflowId(
    @Param('workflowId', ParseIntPipe)
    workflowId: number,
  ) {
    return this.workflowsService.getStepsByWorkflowId(
      workflowId,
    );
  }

  // ========================================
  // STEP ENDPOINTS
  // ========================================

  /**
   * Add step to workflow with approvers
   */
  @Post(':workflowId/steps')
  @Permissions('create_workflow_step')
  @ApiOperation({
    summary: 'Add step to workflow',
    description:
      'Adds a new approval step to a workflow with its approvers in a single transaction',
  })
  @ApiParam({
    name: 'workflowId',
    type: Number,
    description: 'Workflow ID',
    example: 1,
  })
  @ApiResponse({
    status: 201,
    description:
      'Step and approvers added successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Workflow not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Step number already exists',
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error (approvers required, rule type mismatch, etc.)',
  })
  async addStep(
    @Param('workflowId', ParseIntPipe)
    workflowId: number,
    @Body() dto: CreateStepDto,
    @CurrentUserId() userId: number,
  ) {
    return this.workflowsService.addStep(
      workflowId,
      dto,
      userId,
    );
  }

  /**
   * Get step details with approvers
   */
  @Get('steps/:stepId')
  @Permissions('view_workflow_step')
  @ApiOperation({
    summary: 'Get step details',
    description:
      'Retrieves a specific step with all approvers',
  })
  @ApiParam({
    name: 'stepId',
    type: Number,
    description: 'Step ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Step retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          stepNumber: 1,
          stepName: 'Department Manager',
          ruleType: 'ANY',
          approvers: [
            {
              id: 1,
              approverId: 5,
              approverType: 'USER',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Step not found',
  })
  async getStep(
    @Param('stepId', ParseIntPipe) stepId: number,
  ) {
    return this.workflowsService.getStep(stepId);
  }

  /**
   * Update step and replace approvers
   */
  @Put('steps/:stepId')
  @Permissions('update_workflow_step')
  @ApiOperation({
    summary: 'Update step',
    description:
      'Updates step details and optionally replaces all approvers (existing approvers are deleted if new ones provided)',
  })
  @ApiParam({
    name: 'stepId',
    type: Number,
    description: 'Step ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Step updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Step not found',
  })
  async updateStep(
    @Param('stepId', ParseIntPipe) stepId: number,
    @Body() dto: UpdateStepDto,
    @CurrentUserId() userId: number,
  ) {
    return this.workflowsService.updateStep(
      stepId,
      dto,
      userId,
    );
  }

  /**
   * Delete step (soft delete)
   */
  @Delete('steps/:stepId')
  @HttpCode(HttpStatus.OK)
  @Permissions('delete_workflow_step')
  @ApiOperation({
    summary: 'Delete step',
    description:
      'Soft deletes a step and all its approvers',
  })
  @ApiParam({
    name: 'stepId',
    type: Number,
    description: 'Step ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Step deleted successfully',
    schema: {
      example: {
        success: true,
        message: 'Step deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Step not found',
  })
  async deleteStep(
    @Param('stepId', ParseIntPipe) stepId: number,
    @CurrentUserId() userId: number,
  ) {
    return this.workflowsService.deleteStep(
      stepId,
      userId,
    );
  }
}
