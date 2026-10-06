import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ErrorHandlerHelper } from '../../../common/helper/errorMessage.helper';
import { SysApprovalHistory } from '../../../database/models/deligation/sys_approval_history.model';
import { SysApprovalStep } from '../../../database/models/deligation/sys_approval_steps.model';
import { SysApprovalWorkflow } from '../../../database/models/deligation/sys_approval_workflows.model';
import { SysRequestAssignee } from '../../../database/models/deligation/sys_approval_request_assingees.model';
import {
  ApproverType,
  SysStepApprover,
} from '../../../database/models/deligation/sys_step_approvers.model';
import { CreateStepDto } from './dto/create-step.dto';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectModel(SysApprovalWorkflow)
    private workflowModel: typeof SysApprovalWorkflow,
    @InjectModel(SysApprovalStep)
    private stepModel: typeof SysApprovalStep,
    @InjectModel(SysStepApprover)
    private stepApproverModel: typeof SysStepApprover,
    @InjectModel(SysRequestAssignee)
    private requestAssigneeModel: typeof SysRequestAssignee,
    @InjectModel(SysApprovalHistory)
    private approverHistoryModel: typeof SysApprovalHistory,
    private sequelize: Sequelize,
  ) {}

  /**
   * Create a new approval workflow
   */
  async createWorkflow(
    dto: CreateWorkflowDto,
    userId: number,
  ) {
    try {
      const workflow =
        await this.workflowModel.create(
          {
            ...dto,
            createdBy: userId,
          } as any,
          {
            returning: true,
          },
        );

      return {
        success: true,
        message: 'Workflow created successfully',
        data: workflow,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get all workflows
   */
  async listWorkflows(isActive?: boolean) {
    try {
      const where: any = {};
      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const workflows =
        await this.workflowModel.findAll({
          where,
          include: [
            {
              model: this.stepModel,
              as: 'steps',
              include: [
                {
                  model: this.stepApproverModel,
                  as: 'approvers',
                },
              ],
            },
          ],
          order: [['workflowName', 'ASC']],
        });

      return {
        success: true,
        count: workflows.length,
        data: workflows,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get single workflow with steps and approvers
   */
  async getWorkflow(id: number) {
    try {
      const workflow =
        await this.workflowModel.findByPk(id, {
          include: [
            {
              model: this.stepModel,
              as: 'steps',
              order: [['stepNumber', 'ASC']],
              include: [
                {
                  model: this.stepApproverModel,
                  as: 'approvers',
                },
              ],
            },
          ],
        });

      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }

      return {
        success: true,
        data: workflow,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  //get workflow by slug
  async getWorkflowBySlug(slug: string) {
    try {
      const workflow =
        await this.workflowModel.findOne({
          where: { slug },
          include: [
            {
              association: 'steps',
              order: [['stepNumber', 'ASC']],
              include: [
                {
                  association: 'approvers',
                  include: [
                    {
                      association: 'user',
                      attributes: [
                        'id',
                        'firstName',
                        'lastName',
                        'email',
                        'userType',
                      ],
                    },
                  ],
                },
              ],
            },
            {
              association: 'draftStatus',
            },
            {
              association:
                'initiateApproveStatus',
            },
            {
              association: 'afterApproveStatus',
            },
            {
              association: 'afterDeclineStatus',
            },
          ],
        });
      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }
      return {
        success: true,
        data: workflow,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Update workflow
   */
  async updateWorkflow(
    id: number,
    dto: UpdateWorkflowDto,
    userId: number,
  ) {
    try {
      const workflow =
        await this.workflowModel.findByPk(id);

      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }

      await workflow.update({
        ...dto,
        updatedBy: userId,
      } as any);

      return {
        success: true,
        message: 'Workflow updated successfully',
        data: workflow,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  async addStep(
    workflowId: number,
    dto: CreateStepDto,
    userId: number,
  ) {
    const transaction =
      await this.sequelize.transaction();

    try {
      // 1. Verify workflow exists
      const workflow =
        await this.workflowModel.findByPk(
          workflowId,
          { transaction },
        );
      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }

      // 2. Check if step number already exists
      const where: any = { workflowId };
      if (dto.stepNumber != null) {
        where.stepNumber = dto.stepNumber;
      }

      let step = await this.stepModel.findOne({
        where,
        order: [['stepNumber', 'DESC']],
        transaction,
      });

      // If step exists, update it instead of throwing error
      if (dto.stepNumber && step) {
        await step.update(
          {
            stepName: dto.stepName,
            ruleType: dto.ruleType,
            requiredCount: dto.requiredCount,
            isFinal: dto.isFinal || false,
            isActive:
              dto.isActive !== undefined
                ? dto.isActive
                : true,
            updatedBy: userId,
          } as any,
          { transaction },
        );

        // Delete existing approvers
        await this.stepApproverModel.destroy({
          where: { stepId: step.id },
          force: true,
          transaction,
        });
      } else {
        // Create the step if it does not exist
        step = await this.stepModel.create(
          {
            workflowId,
            stepNumber: step
              ? Number(step.stepNumber) + 1
              : 9999,
            stepName: dto.stepName,
            ruleType: dto.ruleType,
            requiredCount: dto.requiredCount,
            isFinal: dto.isFinal || false,
            isActive:
              dto.isActive !== undefined
                ? dto.isActive
                : true,
            createdBy: userId,
          } as any,
          { transaction, returning: true },
        );
      }

      // Create approvers for this step
      await Promise.all(
        dto.approvers.map((approver) => {
          if (
            approver.conditionField &&
            approver.conditionFieldTableName &&
            approver.conditionFieldUserFieldName
          ) {
            approver.approverType =
              ApproverType.CONDITIONAL;
          } else if (
            approver.conditionField &&
            approver.conditionOperator &&
            approver.conditionValue
          ) {
            approver.approverType =
              ApproverType.CONDITIONAL;
          } else {
            approver.approverType =
              ApproverType.DEFAULT;
          }

          return this.stepApproverModel.create(
            {
              stepId: step.id,
              userId: approver.userId,
              approverType: approver.approverType,
              conditionField:
                approver.conditionField,
              conditionOperator:
                approver.conditionOperator,
              conditionValue:
                approver.conditionValue,
              conditionFieldTableName:
                approver.conditionFieldTableName,
              conditionFieldUserFieldName:
                approver.conditionFieldUserFieldName,
              createdBy: userId,
            } as any,
            { transaction },
          );
        }),
      );

      // Before transaction.commit()
      await this.setLastStepAsFinal(
        workflowId,
        transaction,
      );

      await transaction.commit();

      // Return step with approvers
      const stepWithApprovers =
        await this.stepModel.findByPk(step.id, {
          include: [
            {
              model: this.stepApproverModel,
              as: 'approvers',
            },
          ],
        });

      return {
        success: true,
        message: step
          ? 'Step updated successfully'
          : 'Step and approvers added successfully',
        data: stepWithApprovers,
      };
    } catch (error) {
      await transaction.rollback();
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  //get all step by workflow id
  async getStepsByWorkflowId(workflowId: number) {
    try {
      const steps = await this.stepModel.findAll({
        where: { workflowId },
        order: [['stepNumber', 'ASC']],
      });
      return {
        success: true,
        count: steps.length,
        data: steps,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get step with approvers
   */
  async getStep(stepId: number) {
    try {
      const step = await this.stepModel.findByPk(
        stepId,
        {
          include: [
            {
              model: this.stepApproverModel,
              as: 'approvers',
              order: [
                ['priority', 'ASC'],
                ['sequence', 'ASC'],
              ],
            },
          ],
        },
      );

      if (!step) {
        throw new NotFoundException(
          'Step not found',
        );
      }

      return {
        success: true,
        data: step,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * ✅ FIXED: Update step WITH approvers
   */
  async updateStep(
    stepId: number,
    dto: Partial<CreateStepDto>,
    userId: number,
  ) {
    const transaction =
      await this.sequelize.transaction();

    try {
      const step = await this.stepModel.findByPk(
        stepId,
        { transaction },
      );

      if (!step) {
        throw new NotFoundException(
          'Step not found',
        );
      }

      // 1. Update step details
      await step.update(
        {
          stepName: dto.stepName,
          ruleType: dto.ruleType,
          requiredCount: dto.requiredCount,
          isFinal: dto.isFinal,
          isActive: dto.isActive,
          updatedBy: userId,
        } as any,
        { transaction },
      );

      // 2. If approvers are provided, replace existing approvers
      if (
        dto.approvers &&
        dto.approvers.length > 0
      ) {
        // Delete existing approvers
        await this.stepApproverModel.destroy({
          where: { stepId },
          force: true,
          transaction,
        });

        // Create new approvers
        await Promise.all(
          dto.approvers.map((approver) => {
            if (
              approver.conditionField &&
              approver.conditionFieldTableName &&
              approver.conditionFieldUserFieldName
            ) {
              approver.approverType =
                ApproverType.CONDITIONAL;
            } else if (
              approver.conditionField &&
              approver.conditionOperator &&
              approver.conditionValue
            ) {
              approver.approverType =
                ApproverType.CONDITIONAL;
            } else {
              approver.approverType =
                ApproverType.DEFAULT;
            }

            return this.stepApproverModel.create(
              {
                stepId: step.id,
                userId: approver.userId,
                approverType:
                  approver.approverType,
                conditionField:
                  approver.conditionField,
                conditionOperator:
                  approver.conditionOperator,
                conditionValue:
                  approver.conditionValue,
                conditionFieldTableName:
                  approver.conditionFieldTableName,
                conditionFieldUserFieldName:
                  approver.conditionFieldUserFieldName,
                createdBy: userId,
              } as any,
              { transaction },
            );
          }),
        );
      }

      await transaction.commit();

      // Return updated step with approvers
      const updatedStep =
        await this.stepModel.findByPk(stepId, {
          include: [
            {
              model: this.stepApproverModel,
              as: 'approvers',
              order: [
                ['priority', 'ASC'],
                ['sequence', 'ASC'],
              ],
            },
          ],
        });

      return {
        success: true,
        message: 'Step updated successfully',
        data: updatedStep,
      };
    } catch (error) {
      await transaction.rollback();
      throw ErrorHandlerHelper.handleError(error);
    }
  }
  /**
   * ✅ NEW: Delete step (soft delete)
   */
  async deleteStep(
    stepId: number,
    userId: number,
  ) {
    const transaction =
      await this.sequelize.transaction();

    try {
      const step = await this.stepModel.findByPk(
        stepId,
        { transaction },
      );

      if (!step) {
        throw new NotFoundException(
          'Step not found',
        );
      }

      // 1. Delete all request assignees referencing this step
      await this.requestAssigneeModel.destroy({
        where: { stepId },
        force: true,
        transaction,
      });

      // 2. Delete all step approvers
      await this.stepApproverModel.destroy({
        where: { stepId },
        force: true,
        transaction,
      });

      await this.approverHistoryModel.destroy({
        where: { stepId },
        force: true,
        transaction,
      });

      // 3. Soft delete step
      await step.update(
        {
          deletedBy: userId,
        } as any,
        { transaction },
      );

      await step.destroy({
        transaction,
        force: true,
      });
      const workflowId = step.workflowId;

      await this.setLastStepAsFinal(
        workflowId,
        transaction,
      );

      await transaction.commit();

      return {
        success: true,
        message: 'Step deleted successfully',
      };
    } catch (error) {
      await transaction.rollback();
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Private: Automatically set the last step as final and all others as non-final
   */
  private async setLastStepAsFinal(
    workflowId: number,
    transaction: any,
  ) {
    try {
      // Get all steps for this workflow ordered by stepNumber
      const steps = await this.stepModel.findAll({
        where: { workflowId },
        order: [['stepNumber', 'ASC']],
        transaction,
      });

      if (steps.length === 0) {
        return;
      }

      // Set all steps to non-final
      await this.stepModel.update(
        { isFinal: false },
        {
          where: { workflowId },
          transaction,
        },
      );

      // Set only the last step as final
      const lastStep = steps[steps.length - 1];
      await lastStep.update(
        { isFinal: true },
        { transaction },
      );

      console.log(
        `[WorkflowsService] Auto-set step ${lastStep.stepNumber} as final for workflow ${workflowId}`,
      );
    } catch (error) {
      console.error(
        '[WorkflowsService] Error setting last step as final:',
        error,
      );
      throw error;
    }
  }
}
