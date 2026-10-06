import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ErrorHandlerHelper } from '../../../common/helper/errorMessage.helper';
import { SysApprovalHistory } from '../../../database/models/deligation/sys_approval_history.model';
import { SysApprovalRequest } from '../../../database/models/deligation/sys_approval_requests.model';
import { SysApprovalStep } from '../../../database/models/deligation/sys_approval_steps.model';
import { SysApprovalWorkflow } from '../../../database/models/deligation/sys_approval_workflows.model';
import { SysRequestAssignee } from '../../../database/models/deligation/sys_approval_request_assingees.model';
import {
  ApproverType,
  ConditionOperator,
  SysStepApprover,
} from '../../../database/models/deligation/sys_step_approvers.model';
import { PendingApprovalDto } from './dto/pendingApproval.dto';
import { NotificationService } from '../../notifications/notifications.service';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectModel(SysApprovalRequest)
    private approvalRequestModel: typeof SysApprovalRequest,
    @InjectModel(SysApprovalWorkflow)
    private workflowModel: typeof SysApprovalWorkflow,
    @InjectModel(SysApprovalStep)
    private stepModel: typeof SysApprovalStep,
    @InjectModel(SysStepApprover)
    private stepApproverModel: typeof SysStepApprover,
    @InjectModel(SysApprovalHistory)
    private historyModel: typeof SysApprovalHistory,
    @InjectModel(SysRequestAssignee)
    private requestAssigneeModel: typeof SysRequestAssignee,

    private sequelize: Sequelize,
    private notificationService: NotificationService,
  ) {}

  async startApprovalProcess(data: {
    workflowSlug: string;
    referenceId: number;
    remarks?: string;
    requestedBy: number;
  }) {
    console.log(
      '[ApprovalsService] ========================================',
    );
    console.log(
      '[ApprovalsService] Starting approval process',
    );
    console.log(
      '[ApprovalsService] Input data:',
      JSON.stringify(data, null, 2),
    );

    const transaction =
      await this.sequelize.transaction();

    try {
      // 1. Fetch workflow with steps (ordered by priority)
      console.log(
        '[ApprovalsService] Step 1: Fetching workflow with slug:',
        data.workflowSlug,
      );

      const workflow =
        await this.workflowModel.findOne({
          where: { slug: data.workflowSlug },
          include: [
            {
              model: this.stepModel,
              as: 'steps',
              required: false,
              include: [
                {
                  model: this.stepApproverModel,
                  as: 'approvers',
                  required: false,
                },
              ],
            },
          ],
          transaction,
        });

      console.log(
        '[ApprovalsService] Workflow found:',
        workflow ? 'Yes' : 'No',
      );

      if (!workflow || !workflow.isActive) {
        console.error(
          '[ApprovalsService] ❌ Workflow not found or inactive',
        );
        throw new NotFoundException(
          'Workflow not found or inactive',
        );
      }

      console.log(
        '[ApprovalsService] Workflow details:',
        {
          id: workflow.id,
          name: workflow.workflowName,
          isActive: workflow.isActive,
          stepsCount: workflow.steps?.length || 0,
        },
      );

      if (
        !workflow.steps ||
        workflow.steps.length === 0
      ) {
        console.error(
          '[ApprovalsService] ❌ Workflow has no steps configured',
        );
        throw new BadRequestException(
          'Workflow has no steps configured',
        );
      }

      // Sort steps by stepNumber (lowest = first)
      const steps = workflow.steps.sort(
        (a: any, b: any) =>
          a.stepNumber - b.stepNumber,
      );

      console.log(
        '[ApprovalsService] Steps after sorting:',
        steps.map((s) => ({
          stepNumber: s.stepNumber,
          stepName: s.stepName,
          approversCount:
            s.approvers?.length || 0,
        })),
      );

      const firstStep = steps[0];

      if (!firstStep) {
        console.error(
          '[ApprovalsService] ❌ No valid first step found',
        );
        throw new BadRequestException(
          'No valid first step found',
        );
      }
      console.log({
        totalStepFlound: workflow.steps.length,
      });

      console.log(
        '[ApprovalsService] First step:',
        {
          id: firstStep.id,
          stepNumber: firstStep.stepNumber,
          stepName: firstStep.stepName,
          approversCount:
            firstStep.approvers?.length || 0,
        },
      );

      const initialStatusId =
        workflow.initiateApproveStatusId;

      if (!initialStatusId) {
        console.error(
          '[ApprovalsService] ❌ Workflow must have initiateApproveStatusId configured',
        );
        throw new BadRequestException(
          'Workflow must have initiateApproveStatusId configured',
        );
      }

      console.log(
        '[ApprovalsService] Initial status ID:',
        initialStatusId,
      );

      // 2. Fetch reference record (for session variables)
      const referenceTable =
        workflow.refDbTableName;
      console.log(
        '[ApprovalsService] Step 2: Fetching reference record from table:',
        referenceTable,
      );
      console.log(
        '[ApprovalsService] Reference ID:',
        data.referenceId,
      );

      const referenceRecord: any[] =
        await this.sequelize.query(
          `SELECT * FROM ${referenceTable} WHERE id = :referenceId LIMIT 1`,
          {
            replacements: {
              referenceId: data.referenceId,
            },
            type: QueryTypes.SELECT,
            transaction,
          },
        );

      if (
        workflow.draftStatusId !==
        referenceRecord[0]?.[
          workflow.refStatusField || 'status_id'
        ]
      ) {
        throw new BadRequestException(
          'Reference record is not in draft status',
        );
      }

      console.log(
        '[ApprovalsService] Reference record found:',
        referenceRecord.length > 0 ? 'Yes' : 'No',
      );
      if (referenceRecord.length > 0) {
        console.log(
          '[ApprovalsService] Reference record data:',
          JSON.stringify(
            referenceRecord[0],
            null,
            2,
          ),
        );
      }

      // 3. Create approval request
      console.log(
        '[ApprovalsService] Step 3: Creating approval request',
      );

      const request =
        await this.approvalRequestModel.create(
          {
            workflowId: workflow.id,
            referenceId: data.referenceId,
            referenceTable: referenceTable,
            currentStep: firstStep.stepNumber,
            statusId: initialStatusId,
            requestedBy: data.requestedBy,
            sessionVariables:
              referenceRecord[0] || {},
            remarks: data.remarks || null,
          },
          { transaction },
        );

      console.log(
        '[ApprovalsService] ✅ Approval request created:',
        {
          requestId: request.id,
          workflowId: request.workflowId,
          currentStep: request.currentStep,
          statusId: request.statusId,
        },
      );

      // 4. Insert approvers for all steps
      console.log(
        '[ApprovalsService] Step 4: Processing approvers for all steps',
      );
      let totalApproversInserted = 0;

      for (const step of steps) {
        console.log(
          `[ApprovalsService] Processing step ${step.stepNumber}: ${step.stepName}`,
        );
        console.log(
          `[ApprovalsService] Approvers count for this step: ${step.approvers?.length || 0}`,
        );

        if (
          !step.approvers ||
          step.approvers.length === 0
        ) {
          console.warn(
            `[ApprovalsService] ⚠️ Step ${step.stepNumber} has no approvers configured`,
          );
          continue;
        }

        for (const approver of step.approvers) {
          console.log(
            `[ApprovalsService] Processing approver:`,
            {
              approverId: approver.id,
              userId: approver.userId,
              approverType: approver.approverType,
              conditionField:
                approver.conditionField,
              conditionOperator:
                approver.conditionOperator,
              conditionValue:
                approver.conditionValue,
            },
          );

          let userId: number | null = null;

          if (
            (approver.approverType ===
              ApproverType.DEFAULT ||
              approver.approverType ===
                ApproverType.OVERRIDE) &&
            approver.userId
          ) {
            userId = approver.userId;
            console.log(
              `[ApprovalsService] ${approver.approverType} approver - userId: ${userId}`,
            );
          } else if (
            approver.approverType ===
            ApproverType.CONDITIONAL
          ) {
            console.log(
              '[ApprovalsService] CONDITIONAL approver - evaluating condition',
            );

            // Check dynamic conditional (field from another table)
            if (
              approver.conditionFieldTableName &&
              approver.conditionFieldUserFieldName &&
              approver.conditionField
            ) {
              console.log(
                '[ApprovalsService] Dynamic conditional - fetching from table:',
                {
                  table:
                    approver.conditionFieldTableName,
                  userField:
                    approver.conditionFieldUserFieldName,
                  conditionField:
                    approver.conditionField,
                  referenceValue:
                    referenceRecord[0]?.[
                      approver.conditionField
                    ],
                },
              );

              const conditionValue =
                referenceRecord[0]?.[
                  approver.conditionField
                ];

              if (!conditionValue) {
                console.warn(
                  `[ApprovalsService] ⚠️ Condition field "${approver.conditionField}" not found in reference record`,
                );
                continue;
              }

              const dynamicApprover: any =
                await this.sequelize.query(
                  `SELECT ${approver.conditionFieldUserFieldName} AS userId FROM ${approver.conditionFieldTableName} WHERE id = :conditionValue LIMIT 1`,
                  {
                    replacements: {
                      conditionValue:
                        conditionValue,
                    },
                    type: QueryTypes.SELECT,
                    transaction,
                  },
                );

              console.log({
                dynamicApprover: JSON.stringify(
                  dynamicApprover,
                ),
              });

              if (dynamicApprover.length > 0) {
                userId =
                  dynamicApprover[0].userid;
                console.log(
                  `[ApprovalsService] ✅ Dynamic approver found - userId: ${userId}`,
                );
              } else {
                console.warn(
                  `[ApprovalsService] ⚠️ No dynamic approver found for condition value: ${conditionValue}`,
                );
              }
            }
            // Static conditional (field value comparison)
            else if (approver.conditionField) {
              console.log(
                '[ApprovalsService] Static conditional - comparing values:',
                {
                  conditionField:
                    approver.conditionField,
                  conditionOperator:
                    approver.conditionOperator,
                  conditionValue:
                    approver.conditionValue,
                  actualValue:
                    referenceRecord[0]?.[
                      approver.conditionField
                    ],
                },
              );

              const fieldValue =
                referenceRecord[0]?.[
                  approver.conditionField
                ];

              if (fieldValue === undefined) {
                console.warn(
                  `[ApprovalsService] ⚠️ Condition field "${approver.conditionField}" not found in reference record`,
                );
                continue;
              }

              let conditionMet = false;

              switch (
                approver.conditionOperator
              ) {
                case ConditionOperator.EQUALS:
                case '=':
                  conditionMet =
                    String(fieldValue) ===
                    String(
                      approver.conditionValue,
                    );
                  break;
                case ConditionOperator.GREATER_THAN:
                case '>':
                  conditionMet =
                    Number(fieldValue) >
                    Number(
                      approver.conditionValue,
                    );
                  break;
                case ConditionOperator.LESS_THAN:
                case '<':
                  conditionMet =
                    Number(fieldValue) <
                    Number(
                      approver.conditionValue,
                    );
                  break;
                case ConditionOperator.GREATER_THAN_OR_EQUALS:
                case '>=':
                  conditionMet =
                    Number(fieldValue) >=
                    Number(
                      approver.conditionValue,
                    );
                  break;
                case ConditionOperator.LESS_THAN_OR_EQUALS:
                case '<=':
                  conditionMet =
                    Number(fieldValue) <=
                    Number(
                      approver.conditionValue,
                    );
                  break;
              }

              console.log(
                `[ApprovalsService] Condition evaluation result: ${conditionMet}`,
              );

              if (
                conditionMet &&
                approver.userId
              ) {
                userId = approver.userId;
                console.log(
                  `[ApprovalsService] ✅ Condition met - userId: ${userId}`,
                );
              } else {
                console.log(
                  `[ApprovalsService] ❌ Condition NOT met - skipping approver`,
                );
              }
            }
          }
          if (userId) {
            const isActive =
              step.stepNumber ===
              firstStep.stepNumber;

            console.log(
              `[ApprovalsService] Inserting approver into sys_approval_request_assingees:`,
              {
                requestId: request.id,
                stepId: step.id,
                stepNumber: step.stepNumber,
                userId: userId,
                status: isActive
                  ? 'pending'
                  : 'waiting',
              },
            );

            const {
              v4: uuidv4,
            } = require('uuid');
            const assigneeUuid = uuidv4();
            await this.sequelize.query(
              `INSERT INTO sys_approval_request_assingees 
    (uuid, request_id, step_id, step_number, assigned_to, delegated_from, status, workflow_slug, reference_table, reference_id, created_at, updated_at)
    VALUES (:uuid, :requestId, :stepId, :stepNumber, :userId, :delegatedFrom, :status, :workflowSlug, :referenceTable, :referenceId, NOW(), NOW())`,
              {
                replacements: {
                  uuid: assigneeUuid,
                  requestId: request.id,
                  stepId: step.id,
                  stepNumber: step.stepNumber,
                  userId,
                  delegatedFrom: null, // Set to null initially, can be updated later for delegation
                  status: isActive
                    ? 'pending'
                    : 'waiting',
                  workflowSlug: data.workflowSlug,
                  referenceTable: referenceTable,
                  referenceId: data.referenceId,
                },
                type: QueryTypes.INSERT,
                transaction,
              },
            );

            totalApproversInserted++;
            console.log(
              `[ApprovalsService] ✅ Approver inserted successfully`,
            );
          } else {
            console.warn(
              `[ApprovalsService] ⚠️ Approver skipped - no userId determined`,
            );
          }
        }
      }

      console.log(
        `[ApprovalsService] Total approvers inserted: ${totalApproversInserted}`,
      );

      // 5. Insert initial history for first step
      console.log(
        '[ApprovalsService] Step 5: Creating initial history entry',
      );

      const historyEntry =
        await this.historyModel.create(
          {
            requestId: request.id,
            stepId: firstStep.id,
            actionStatusId: initialStatusId,
            comments:
              data.remarks ||
              'Approval request initiated',
            actionTimestamp: new Date(),
            createdBy: data.requestedBy,
          },
          { transaction },
        );

      console.log(
        '[ApprovalsService] ✅ History entry created:',
        {
          historyId: historyEntry.id,
          requestId: historyEntry.requestId,
          stepId: historyEntry.stepId,
        },
      );

      // 6. Update reference table status
      if (
        request.referenceTable &&
        request.referenceId
      ) {
        console.log(
          '[ApprovalsService] Step 6: Updating reference table status',
        );
        console.log(
          `[ApprovalsService] UPDATE ${request.referenceTable} SET status_id = ${initialStatusId} WHERE id = ${request.referenceId}`,
        );

        await this.sequelize.query(
          `UPDATE ${request.referenceTable} SET status_id = :statusId, updated_at = NOW() WHERE id = :referenceId`,
          {
            replacements: {
              statusId: initialStatusId,
              referenceId: request.referenceId,
            },
            type: QueryTypes.UPDATE,
            transaction,
          },
        );

        console.log(
          '[ApprovalsService] ✅ Reference table updated',
        );
      }

      await transaction.commit();
      console.log(
        '[ApprovalsService] ✅ Transaction committed successfully',
      );

      // 7. Send notifications to first step approvers (after transaction commits)
      this.notifyPendingAssignees(
        request.id,
        firstStep.stepNumber,
      ).catch((error) => {
        console.error(
          '[ApprovalsService] Failed to send initial notifications:',
          error,
        );
      });

      // 8. Return the created request
      const finalRequest =
        await this.approvalRequestModel.findByPk(
          request.id,
          {
            include: [
              {
                model: this.workflowModel,
                as: 'workflow',
              },
            ],
          },
        );

      console.log(
        '[ApprovalsService] ✅ Approval process started successfully',
      );
      console.log(
        '[ApprovalsService] ========================================',
      );

      return {
        success: true,
        message:
          'Approval request started successfully',
        data: finalRequest,
      };
    } catch (error) {
      await transaction.rollback();
      console.error(
        '[ApprovalsService] ❌ Error in startApprovalProcess - transaction rolled back',
      );
      console.error(
        '[ApprovalsService] Error details:',
        error,
      );
      console.error(
        '[ApprovalsService] ========================================',
      );
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get approval requests initiated by the user
   */
  async getMyRequests(userId: number) {
    try {
      const requests =
        await this.approvalRequestModel.findAll({
          where: {
            requestedBy: userId,
          },
          include: [
            {
              model: this.workflowModel,
              as: 'workflow',
              attributes: [
                'id',
                'workflowName',
                'slug',
              ],
            },
          ],
          order: [['createdAt', 'DESC']],
        });

      return {
        success: true,
        count: requests.length,
        data: requests,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get pending approval requests for a user.
   * This is now optimized to directly query for requests assigned to the user.
   */
  async getPendingApprovals(
    userId: number,
    query: PendingApprovalDto,
  ) {
    try {
      const {
        referenceTable,
        workflowSlug,
        status,
        requestId,
        page = 1,
        limit = 10,
      } = query;

      const offset = (page - 1) * limit;

      // Build the main where clause for the approval request
      const requestWhereClause: any = {};
      if (referenceTable) {
        requestWhereClause.referenceTable =
          referenceTable;
      }
      if (requestId) {
        requestWhereClause.id = requestId;
      }

      // Build the where clause for the workflow
      const workflowWhereClause: any = {};
      if (workflowSlug) {
        workflowWhereClause.slug = workflowSlug;
      }

      // Build assignee where clause (default to 'pending' if not provided)
      const assigneeWhere: any = {
        assignedTo: userId,
        status: status ?? 'pending',
      };

      // Find all requests where the user is an assignee for the current step
      const { rows: requests, count } =
        await this.approvalRequestModel.findAndCountAll(
          {
            where: requestWhereClause,
            include: [
              {
                association: 'workflow',
                attributes: [
                  'id',
                  'workflowName',
                  'slug',
                ],
                required: true,
                where: workflowWhereClause,
              },
              {
                association: 'assignees',
                required: true,
                where: assigneeWhere,
              },
              {
                association: 'status',
                attributes: ['id', 'label'],
              },
              {
                association: 'requester',
                attributes: [
                  'id',
                  'firstName',
                  'lastName',
                  'email',
                ],
              },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
          },
        );

      return {
        success: true,
        count,
        data: requests,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Approve an approval request
   */
  async approveRequest(data: {
    requestId: number;
    userId: number;
    comments?: string;
    ipAddress?: string;
  }) {
    const transaction =
      await this.sequelize.transaction();

    try {
      // 1. Get the approval request with workflow and current step
      const request =
        await this.approvalRequestModel.findByPk(
          data.requestId,
          {
            transaction,
            include: [
              {
                association: 'workflow',
                required: true,
              },
            ],
          },
        );

      if (!request) {
        throw new NotFoundException(
          'Approval request not found',
        );
      }

      // 2. Check if request is already in final status by comparing with workflow's final status IDs
      const workflow = request.workflow;
      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }

      const finalStatusIds = [
        workflow.afterApproveStatusId,
        workflow.afterDeclineStatusId,
        workflow.afterRejectStatusId,
      ].filter(
        (id) => id !== null && id !== undefined,
      );

      if (
        finalStatusIds.includes(request.statusId)
      ) {
        throw new BadRequestException(
          'Request is already finalized',
        );
      }

      // 3. Get current step with approvers
      const currentStep =
        await this.stepModel.findOne({
          where: {
            workflowId: request.workflowId,
            stepNumber: request.currentStep,
            isActive: true,
          },
          include: [
            {
              model: this.stepApproverModel,
              as: 'approvers',
              where: { isActive: true },
              required: false,
            },
          ],
          transaction,
        });

      if (!currentStep) {
        throw new NotFoundException(
          'Current step not found',
        );
      }

      // 4. Check if user is an approver for this step
      const approverCheck =
        this.checkUserApproverWithDebug(
          data.userId,
          currentStep.approvers || [],
          request.sessionVariables as Record<
            string,
            any
          > | null,
        );

      if (!approverCheck.isApprover) {
        throw new BadRequestException(
          'You are not an approver for this step',
        );
      }

      // 5. Check if user has already approved/rejected this request at this step
      const existingActions: any[] =
        await this.sequelize.query(
          'SELECT * FROM sys_approval_history WHERE request_id = :requestId AND step_id = :stepId AND created_by = :userId LIMIT 1',
          {
            replacements: {
              requestId: data.requestId,
              stepId: currentStep.id,
              userId: data.userId,
            },
            type: QueryTypes.SELECT,
            transaction,
          },
        );
      const workFlowDetails = request.workflow;
      console.log({
        workFlowDetails,
        existingActions,
      });

      if (
        existingActions &&
        existingActions.length > 0 &&
        workFlowDetails
      ) {
        const isInitialEntry =
          existingActions[0].action_status_id ===
            workFlowDetails.initiateApproveStatusId &&
          existingActions[0].created_by ===
            request.requestedBy.toString();

        if (!isInitialEntry) {
          throw new BadRequestException(
            'You have already acted on this request at this step',
          );
        }
      }

      // 6. Create approval status ID (assuming there's an "approved" status)
      // For now, keep the current status until we determine if step is complete
      const approvalStatusId =
        request.workflow.initiateApproveStatusId;

      // 7. Create history entry (userId tracked in comments as [User:X] prefix)
      const historyComment = `[User:${data.userId}] ${data.comments || 'Approved'}`;
      const { v4: uuidv4 } = require('uuid');
      const historyUuid = uuidv4();

      await this.sequelize.query(
        'INSERT INTO sys_approval_history (uuid, request_id, step_id, action_status_id, comments, ip_address, action_timestamp, created_by, created_at, updated_at) VALUES (:uuid, :requestId, :stepId, :actionStatusId, :comments, :ipAddress, NOW(), :createdBy, NOW(), NOW())',
        {
          replacements: {
            uuid: historyUuid,
            requestId: data.requestId,
            stepId: currentStep.id,
            actionStatusId: approvalStatusId,
            comments: historyComment,
            ipAddress: data.ipAddress,
            createdBy: data.userId,
          },
          type: QueryTypes.INSERT,
          transaction,
        },
      );

      // Update assignee status to approved
      await this.requestAssigneeModel.update(
        { status: 'approved' },
        {
          where: {
            requestId: data.requestId,
            stepId: currentStep.id,
            assignedTo: data.userId,
          },
          transaction,
        },
      );

      // 8. Check if step requirements are met
      const stepComplete =
        await this.checkStepComplete(
          data.requestId,
          currentStep,
          transaction,
        );

      if (stepComplete) {
        // System auto-approve remaining pending approvers
        const totalAssignees =
          await this.requestAssigneeModel.count({
            where: {
              requestId: data.requestId,
              stepId: currentStep.id,
            },
            transaction,
          });

        const approvedCount =
          await this.requestAssigneeModel.count({
            where: {
              requestId: data.requestId,
              stepId: currentStep.id,
              status: 'approved',
            },
            transaction,
          });

        await this.systemAutoCompleteRemainingApprovers(
          {
            requestId: data.requestId,
            stepId: currentStep.id,
            action: 'approved',
            ruleType: currentStep.ruleType,
            approvedCount,
            rejectedCount: 0,
            totalAssignees,
            requiredCount:
              currentStep.requiredCount,
            transaction,
          },
        );
        // Move to next step or finalize
        if (currentStep.isFinal) {
          // Final step - update to afterApproveStatusId
          const finalStatusId =
            request.workflow.afterApproveStatusId;

          await request.update(
            { statusId: finalStatusId },
            { transaction },
          );

          // Update reference table
          if (
            request.referenceTable &&
            request.referenceId
          ) {
            await this.sequelize.query(
              `UPDATE ${request.referenceTable} SET status_id = :statusId, updated_at = NOW() WHERE id = :referenceId`,
              {
                replacements: {
                  statusId: finalStatusId,
                  referenceId:
                    request.referenceId,
                },
                type: QueryTypes.UPDATE,
                transaction,
              },
            );
          }
        } else {
          // Move to next step
          const nextStep =
            await this.stepModel.findOne({
              where: {
                workflowId: request.workflowId,
                stepNumber: {
                  [Op.gt]: currentStep.stepNumber, // Greater than current step number
                },
                isActive: true,
              },
              order: [['stepNumber', 'ASC']], // Get the next step in order
              transaction,
            });

          if (nextStep) {
            await request.update(
              {
                currentStep: nextStep.stepNumber,
              },
              { transaction },
            );

            // Activate next step assignees
            await this.requestAssigneeModel.update(
              { status: 'pending' },
              {
                where: {
                  requestId: data.requestId,
                  stepNumber: nextStep.stepNumber,
                  status: 'waiting',
                },
                transaction,
              },
            );

            // Store nextStep number for notification after commit
            var nextStepNumber =
              nextStep.stepNumber;
          } else {
            await request.update(
              {
                statusId:
                  request.workflow
                    .afterApproveStatusId,
              },
              { transaction },
            );
          }
        }
      }

      await transaction.commit();

      // Send notifications to next step approvers if moved to next step
      if (
        stepComplete &&
        !currentStep.isFinal &&
        nextStepNumber
      ) {
        this.notifyPendingAssignees(
          data.requestId,
          nextStepNumber,
        ).catch((error) => {
          console.error(
            '[ApprovalsService] Failed to send next step notifications:',
            error,
          );
        });
      }

      return {
        success: true,
        message: stepComplete
          ? currentStep.isFinal
            ? 'Request approved and finalized'
            : 'Request approved and moved to next step'
          : 'Approval recorded, waiting for more approvals',
        data: await this.approvalRequestModel.findByPk(
          data.requestId,
          {
            include: [
              {
                model: this.workflowModel,
                as: 'workflow',
              },
            ],
          },
        ),
      };
    } catch (error) {
      await transaction.rollback();
      throw ErrorHandlerHelper.handleError(error);
    }
  }
  /**
   * Reject an approval request
   */
  async rejectRequest(data: {
    requestId: number;
    userId: number;
    comments?: string;
    ipAddress?: string;
  }) {
    const transaction =
      await this.sequelize.transaction();

    try {
      // 1. Get the approval request with workflow
      const request =
        await this.approvalRequestModel.findByPk(
          data.requestId,
          {
            transaction,
            include: [
              {
                association: 'workflow',
                required: true,
              },
            ],
          },
        );

      if (!request) {
        throw new NotFoundException(
          'Approval request not found',
        );
      }

      // 2. Check if request is already in final status by comparing with workflow's final status IDs
      const workflow = request.workflow;
      if (!workflow) {
        throw new NotFoundException(
          'Workflow not found',
        );
      }

      const finalStatusIds = [
        workflow.afterApproveStatusId,
        workflow.afterDeclineStatusId,
        workflow.afterRejectStatusId,
      ].filter(
        (id) => id !== null && id !== undefined,
      );

      if (
        finalStatusIds.includes(request.statusId)
      ) {
        throw new BadRequestException(
          'Request is already finalized',
        );
      }

      // 3. Get current step
      const currentStep =
        await this.stepModel.findOne({
          where: {
            workflowId: request.workflowId,
            stepNumber: request.currentStep,
            isActive: true,
          },
          include: [
            {
              model: this.stepApproverModel,
              as: 'approvers',
              where: { isActive: true },
              required: false,
            },
          ],
          transaction,
        });

      if (!currentStep) {
        throw new NotFoundException(
          'Current step not found',
        );
      }

      // 4. Check if user is an approver
      const approverCheck =
        this.checkUserApproverWithDebug(
          data.userId,
          currentStep.approvers || [],
          request.sessionVariables as Record<
            string,
            any
          > | null,
        );

      console.log({
        user: data.userId,
        ffgvgtfvc: approverCheck,
      });

      if (!approverCheck.isApprover) {
        throw new BadRequestException(
          'You are not an approver for this step',
        );
      }

      // 5. Check if user has already acted on this request at this step
      const existingActions: any[] =
        await this.sequelize.query(
          'SELECT * FROM sys_approval_history WHERE request_id = :requestId AND step_id = :stepId AND created_by = :userId LIMIT 1',
          {
            replacements: {
              requestId: data.requestId,
              stepId: currentStep.id,
              userId: data.userId,
            },
            type: QueryTypes.SELECT,
            transaction,
          },
        );

      const workFlowDetails = request.workflow;

      if (
        existingActions &&
        existingActions.length > 0 &&
        workFlowDetails
      ) {
        const isInitialEntry =
          existingActions[0].action_status_id ===
            workFlowDetails.initiateApproveStatusId &&
          existingActions[0].created_by ===
            request.requestedBy.toString();

        if (!isInitialEntry) {
          throw new BadRequestException(
            'You have already acted on this request at this step',
          );
        }
      }

      // 6. Get decline status ID
      const declineStatusId =
        request.workflow.afterDeclineStatusId;

      if (!declineStatusId) {
        throw new BadRequestException(
          'Decline status not configured for this workflow',
        );
      }

      // 7. Create history entry (userId tracked in comments as [User:X] prefix)
      const historyComment = `[User:${data.userId}] ${data.comments || 'Rejected'}`;
      const { v4: uuidv4 } = require('uuid');
      const historyUuid = uuidv4();

      await this.sequelize.query(
        'INSERT INTO sys_approval_history (uuid, request_id, step_id, action_status_id, comments, ip_address, action_timestamp, created_by, created_at, updated_at) VALUES (:uuid, :requestId, :stepId, :actionStatusId, :comments, :ipAddress, NOW(), :createdBy, NOW(), NOW())',
        {
          replacements: {
            uuid: historyUuid,
            requestId: data.requestId,
            stepId: currentStep.id,
            actionStatusId: declineStatusId,
            comments: historyComment,
            ipAddress: data.ipAddress,
            createdBy: data.userId,
          },
          type: QueryTypes.INSERT,
          transaction,
        },
      );

      // Update assignee status to rejected
      await this.requestAssigneeModel.update(
        { status: 'rejected' },
        {
          where: {
            requestId: data.requestId,
            stepId: currentStep.id,
            assignedTo: data.userId,
          },
          transaction,
        },
      );

      // 8. Check if step is definitively rejected based on rules
      const stepRejected =
        await this.checkStepRejected(
          data.requestId,
          currentStep,
          transaction,
        );

      if (stepRejected) {
        // System auto-approve remaining pending approvers
        const totalAssignees =
          await this.requestAssigneeModel.count({
            where: {
              requestId: data.requestId,
              stepId: currentStep.id,
            },
            transaction,
          });

        const approvedCount =
          await this.requestAssigneeModel.count({
            where: {
              requestId: data.requestId,
              stepId: currentStep.id,
              status: 'approved',
            },
            transaction,
          });

        await this.systemAutoCompleteRemainingApprovers(
          {
            requestId: data.requestId,
            stepId: currentStep.id,
            action: 'approved',
            ruleType: currentStep.ruleType,
            approvedCount,
            rejectedCount: 0,
            totalAssignees,
            requiredCount:
              currentStep.requiredCount,
            transaction,
          },
        );
        // Update request status to declined
        await request.update(
          { statusId: declineStatusId },
          { transaction },
        );

        // Update reference table
        if (
          request.referenceTable &&
          request.referenceId
        ) {
          await this.sequelize.query(
            `UPDATE ${request.referenceTable} SET status_id = :statusId, updated_at = NOW() WHERE id = :referenceId`,
            {
              replacements: {
                statusId: declineStatusId,
                referenceId: request.referenceId,
              },
              type: QueryTypes.UPDATE,
              transaction,
            },
          );
        }
      }

      await transaction.commit();

      return {
        success: true,
        message: stepRejected
          ? 'Request rejected'
          : 'Rejection recorded. Waiting for other approvers.',
        data: await this.approvalRequestModel.findByPk(
          data.requestId,
          {
            include: [
              {
                model: this.workflowModel,
                as: 'workflow',
              },
            ],
          },
        ),
      };
    } catch (error) {
      await transaction.rollback();
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Check if step is rejected based on rules
   */
  private async checkStepRejected(
    requestId: number,
    step: SysApprovalStep,
    transaction: any,
  ): Promise<boolean> {
    // Get total ACTUAL assignees for this step (from the assignees table, not config)
    const totalAssignees =
      await this.requestAssigneeModel.count({
        where: {
          requestId: requestId,
          stepId: step.id,
        },
        transaction,
      });

    // Get rejection count
    const rejections =
      await this.requestAssigneeModel.count({
        where: {
          requestId: requestId,
          stepId: step.id,
          status: 'rejected',
        },
        transaction,
      });

    console.log('--- Step Rejection Logic ---');
    console.log('Rule Type:', step.ruleType);
    console.log('Rejections Count:', rejections);
    console.log(
      'Total Assignees:',
      totalAssignees,
    );

    if (totalAssignees === 0) return true; // Should not happen, but fail safe

    switch (step.ruleType.toUpperCase()) {
      case 'ANY':
        // ANY: Only fails if EVERYONE rejects
        return rejections === totalAssignees;

      case 'ALL':
        // ALL: Fails if ANYONE rejects
        return rejections >= 1;

      case 'MAJORITY':
        // MAJORITY: Fails if we can no longer reach > 50%
        // Example: 5 approvers. Majority is 3.
        // If 3 reject, remaining is 2. 2 < 3. Rejected.
        const majorityCount = Math.ceil(
          totalAssignees / 2,
        );
        const remainingPotential =
          totalAssignees - rejections;
        return remainingPotential < majorityCount;

      case 'CONDITIONAL':
        // CONDITIONAL: Fails if we can no longer reach required count
        const requiredCount = Math.min(
          step.requiredCount || 1,
          totalAssignees,
        );
        const potential =
          totalAssignees - rejections;
        return potential < requiredCount;

      default:
        return rejections >= 1;
    }
  }

  /**
   * Check if step completion requirements are met
   * Rules:
   * - ANY: 1 approval needed
   * - ALL: All approvers must approve
   * - MAJORITY: >50% approvals needed
   * - CONDITIONAL: requiredCount approvals needed (if requiredCount > total approvers, use total approvers)
   */
  private async checkStepComplete(
    requestId: number,
    step: SysApprovalStep,
    transaction: any,
  ): Promise<boolean> {
    // Get all approvals for this step
    const approvals =
      await this.historyModel.count({
        where: {
          requestId: requestId,
          stepId: step.id,
        },
        transaction,
      });

    // Get total eligible approvers (matched approvers only)
    const totalApprovers =
      step.approvers?.length || 0;

    console.log('--- Step Completion Logic ---');
    console.log('Rule Type:', step.ruleType);
    console.log('Approvals Count:', approvals);
    console.log(
      'Total Approvers:',
      totalApprovers,
    );
    console.log(
      'Required Count:',
      step.requiredCount,
    );

    switch (step.ruleType.toUpperCase()) {
      case 'ANY':
        // ANY: Just 1 approval needed
        return approvals >= 1;

      case 'ALL':
        // ALL: Need all approvers to approve
        return approvals >= totalApprovers;

      case 'MAJORITY':
        // MAJORITY: Need more than 50%
        const majorityCount = Math.ceil(
          totalApprovers / 2,
        );
        return approvals >= majorityCount;

      case 'CONDITIONAL':
        // CONDITIONAL: Need requiredCount (or total if requiredCount > total)
        const requiredCount = Math.min(
          step.requiredCount || 1,
          totalApprovers,
        );
        return approvals >= requiredCount;

      default:
        // Default to ANY
        return approvals >= 1;
    }
  }

  /**
   * Get approval history
   * Can fetch by requestId OR by referenceTable + referenceId
   */
  async getApprovalHistory(data: {
    requestId?: number;
    referenceTable?: string;
    referenceId?: number;
  }) {
    try {
      let requestIds: number[] = [];

      if (data.requestId) {
        // Direct request ID lookup - ensure it's a number
        requestIds = [Number(data.requestId)];
      } else if (
        data.referenceTable &&
        data.referenceId
      ) {
        // Find request by reference table and ID - USE RAW QUERY
        try {
          const requests: any[] =
            await this.sequelize.query(
              'SELECT id FROM sys_approval_requests WHERE reference_table = :referenceTable AND reference_id = :referenceId',
              {
                replacements: {
                  referenceTable:
                    data.referenceTable,
                  referenceId: Number(
                    data.referenceId,
                  ),
                },
                type: QueryTypes.SELECT,
              },
            );

          requestIds = requests.map((r) => r.id);

          if (requestIds.length === 0) {
            return {
              success: true,
              message:
                'No approval requests found',
              count: 0,
              data: [],
            };
          }
        } catch (err) {
          console.error(
            'Error finding approval requests:',
            err,
          );
          throw new BadRequestException(
            `Failed to find approval requests: ${err.message}`,
          );
        }
      } else {
        throw new BadRequestException(
          'Either requestId OR (referenceTable + referenceId) must be provided',
        );
      }

      // Get history for the request(s) - Use raw query to avoid date parsing issues
      try {
        const history: any[] =
          await this.sequelize.query(
            `SELECT 
        h.id,
        h.uuid,
        h.request_id,
        h.step_id,
        h.action_status_id,
        h.comments,
        h.ip_address,
        h.action_timestamp::text as action_timestamp,
        h.created_at::text as created_at,
        h.updated_at::text as updated_at,
        h.created_by,
        s.step_number,
        s.step_name,
        s.rule_type,
        s.is_final,
        st.id as status_id,
        st.label as status_label,
        st.color as status_color,
        st.description as status_description,
        st.is_final as status_is_final,
        a.id as assignee_id,
        a.assigned_to,
        a.status as assignee_status,
        a.action_at as assignee_action_at,
        a.action_comment as assignee_action_comment,
        u.id as user_id,
        u.first_name as first_name,
        u.last_name as last_name,
        u.email as user_email
      FROM sys_approval_history h
      LEFT JOIN sys_approval_steps s ON h.step_id = s.id
      LEFT JOIN sys_delegation_statuses st ON h.action_status_id = st.id
      LEFT JOIN sys_approval_request_assingees a ON a.request_id = h.request_id 
        AND a.step_id = h.step_id 
        AND a.assigned_to = h.created_by
      LEFT JOIN sys_users u ON u.id = h.created_by
      WHERE h.request_id IN (:requestIds)
            ORDER BY h.action_timestamp ASC`,
            {
              replacements: { requestIds },
              type: QueryTypes.SELECT,
            },
          );

        return {
          success: true,
          count: history.length,
          data: history,
        };
      } catch (err) {
        console.error(
          'Error fetching history:',
          err,
        );
        throw new BadRequestException(
          `Failed to fetch history: ${err.message}`,
        );
      }
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Check if user is an approver with debug information
   */
  private checkUserApproverWithDebug(
    userId: number,
    approvers: SysStepApprover[],
    sessionVariables:
      | Record<string, any>
      | null
      | undefined,
  ): {
    isApprover: boolean;
    debug: {
      userId: number;
      totalApprovers: number;
      matchedApprovers: any[];
      rejectedApprovers: any[];
      reason: string;
    };
  } {
    const matchedApprovers: any[] = [];
    const rejectedApprovers: any[] = [];

    for (const approver of approvers) {
      const approverInfo = {
        approverId: approver.id,
        userId: approver.userId,
        approverType: approver.approverType,
        conditionField: approver.conditionField,
        conditionOperator:
          approver.conditionOperator,
        conditionValue: approver.conditionValue,
      };

      // Check if this approver is for the current user
      if (approver.userId !== userId) {
        rejectedApprovers.push({
          ...approverInfo,
          reason: `User ID mismatch (approver userId: ${approver.userId}, current userId: ${userId})`,
        });
        continue;
      }

      // DEFAULT approver - always active
      if (
        approver.approverType ===
        ApproverType.DEFAULT
      ) {
        matchedApprovers.push({
          ...approverInfo,
          reason:
            'DEFAULT approver - always active',
        });
        continue;
      }

      // OVERRIDE approver - always active
      if (
        approver.approverType ===
        ApproverType.OVERRIDE
      ) {
        matchedApprovers.push({
          ...approverInfo,
          reason:
            'OVERRIDE approver - always active',
        });
        continue;
      }

      // CONDITIONAL approver - check condition
      if (
        approver.approverType ===
        ApproverType.CONDITIONAL
      ) {
        if (!approver.conditionField) {
          rejectedApprovers.push({
            ...approverInfo,
            reason:
              'CONDITIONAL approver but conditionField is missing',
          });
          continue;
        }

        if (!sessionVariables) {
          rejectedApprovers.push({
            ...approverInfo,
            reason:
              'CONDITIONAL approver but sessionVariables is null/undefined',
          });
          continue;
        }

        const fieldValue =
          sessionVariables[
            approver.conditionField
          ];

        if (fieldValue === undefined) {
          rejectedApprovers.push({
            ...approverInfo,
            reason: `CONDITIONAL approver but field "${approver.conditionField}" not found in sessionVariables`,
            sessionVariables,
          });
          continue;
        }

        const conditionValue =
          approver.conditionValue;

        // Evaluate condition
        let conditionMet = false;
        let evaluationDetail = '';

        switch (approver.conditionOperator) {
          case ConditionOperator.GREATER_THAN:
          case '>':
            conditionMet =
              Number(fieldValue) >
              Number(conditionValue);
            evaluationDetail = `${fieldValue} > ${conditionValue} = ${conditionMet}`;
            break;
          case ConditionOperator.LESS_THAN:
          case '<':
            conditionMet =
              Number(fieldValue) <
              Number(conditionValue);
            evaluationDetail = `${fieldValue} < ${conditionValue} = ${conditionMet}`;
            break;
          case ConditionOperator.EQUALS:
          case '=':
            conditionMet =
              String(fieldValue) ===
              String(conditionValue);
            evaluationDetail = `${fieldValue} == ${conditionValue} = ${conditionMet}`;
            break;
          case ConditionOperator.GREATER_THAN_OR_EQUALS:
          case '>=':
            conditionMet =
              Number(fieldValue) >=
              Number(conditionValue);
            evaluationDetail = `${fieldValue} >= ${conditionValue} = ${conditionMet}`;
            break;
          case ConditionOperator.LESS_THAN_OR_EQUALS:
          case '<=':
            conditionMet =
              Number(fieldValue) <=
              Number(conditionValue);
            evaluationDetail = `${fieldValue} <= ${conditionValue} = ${conditionMet}`;
            break;
          default:
            evaluationDetail = `Unknown operator: ${approver.conditionOperator}`;
        }

        if (conditionMet) {
          matchedApprovers.push({
            ...approverInfo,
            reason: `CONDITIONAL approver - condition met: ${evaluationDetail}`,
            fieldValue,
          });
        } else {
          rejectedApprovers.push({
            ...approverInfo,
            reason: `CONDITIONAL approver - condition NOT met: ${evaluationDetail}`,
            fieldValue,
          });
        }
      }
    }

    const isApprover =
      matchedApprovers.length > 0;

    return {
      isApprover,
      debug: {
        userId,
        totalApprovers: approvers.length,
        matchedApprovers,
        rejectedApprovers,
        reason: isApprover
          ? `User IS an approver (${matchedApprovers.length} match(es) found)`
          : rejectedApprovers.length > 0
            ? `User is NOT an approver - ${rejectedApprovers[0].reason}`
            : 'No approvers configured for this step',
      },
    };
  }

  /**
   * Get pending approval counts grouped by reference table
   */
  async getPendingApprovalCounts(userId: number) {
    try {
      // Use the same optimized approach as getPendingApprovals
      // Query directly from assignees table where user is assigned with 'pending' status
      const counts: any[] =
        await this.sequelize.query(
          `SELECT 
          r.reference_table,
          COUNT(DISTINCT r.id) as count
        FROM sys_approval_requests r
        INNER JOIN sys_approval_request_assingees a ON a.request_id = r.id
        INNER JOIN sys_approval_workflows w ON w.id = r.workflow_id
        INNER JOIN sys_delegation_statuses s ON s.id = r.status_id
        WHERE a.assigned_to = :userId
          AND a.status = 'pending'
          AND w.is_active = true
          AND s.is_final = false
        GROUP BY r.reference_table
        ORDER BY r.reference_table`,
          {
            replacements: { userId },
            type: QueryTypes.SELECT,
          },
        );

      const data = counts.map((row) => ({
        referenceTable:
          row.reference_table || 'unknown',
        count: parseInt(row.count, 10),
      }));

      return {
        success: true,
        totalCount: data.reduce(
          (sum, item) => sum + item.count,
          0,
        ),
        data,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get current stage of an approval request
   * Can fetch by requestId OR by referenceTable + referenceId
   */
  async getCurrentStage(data: {
    requestId?: number;
    referenceTable?: string;
    referenceId?: number;
  }) {
    try {
      let request: SysApprovalRequest | null =
        null;

      if (data.requestId) {
        // Direct request ID lookup
        request =
          await this.approvalRequestModel.findByPk(
            Number(data.requestId),
            {
              include: [
                {
                  model: this.workflowModel,
                  as: 'workflow',
                  attributes: [
                    'id',
                    'workflowName',
                    'slug',
                  ],
                },
              ],
            },
          );
      } else if (
        data.referenceTable &&
        data.referenceId
      ) {
        // Find by reference table and ID
        request =
          await this.approvalRequestModel.findOne(
            {
              where: {
                referenceTable:
                  data.referenceTable,
                referenceId: Number(
                  data.referenceId,
                ),
              },
              include: [
                {
                  model: this.workflowModel,
                  as: 'workflow',
                  attributes: [
                    'id',
                    'workflowName',
                    'slug',
                  ],
                },
              ],
              order: [['createdAt', 'DESC']], // Get the latest request
            },
          );
      } else {
        throw new BadRequestException(
          'Either requestId OR (referenceTable + referenceId) must be provided',
        );
      }

      if (!request) {
        throw new NotFoundException(
          'Approval request not found',
        );
      }

      // Get current step details
      const currentStep =
        await this.stepModel.findOne({
          where: {
            workflowId: request.workflowId,
            stepNumber: request.currentStep,
            isActive: true,
          },
        });

      // Get status details
      const statusDetails: any =
        await this.sequelize.query(
          'SELECT id, label, color, description, is_final FROM sys_delegation_statuses WHERE id = :statusId LIMIT 1',
          {
            replacements: {
              statusId: request.statusId,
            },
            type: QueryTypes.SELECT,
          },
        );

      return {
        success: true,
        data: {
          requestId: request.id,
          workflowId: request.workflowId,
          workflowName:
            request.workflow?.workflowName,
          currentStep: request.currentStep,
          currentStepDetails: currentStep
            ? {
                stepNumber:
                  currentStep.stepNumber,
                stepName: currentStep.stepName,
                ruleType: currentStep.ruleType,
                requiredCount:
                  currentStep.requiredCount,
                isFinal: currentStep.isFinal,
              }
            : null,
          status:
            statusDetails && statusDetails[0]
              ? statusDetails[0]
              : null,
          referenceTable: request.referenceTable,
          referenceId: request.referenceId,
          requestedBy: request.requestedBy,
          createdAt: request.createdAt,
        },
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * Get pending approval counts grouped by workflow with workflow details
   */
  async getPendingApprovalCountsByWorkflow(
    userId: number,
  ) {
    try {
      const counts: any[] =
        await this.sequelize.query(
          `SELECT 
        w.id as workflow_id,
        w.workflow_name,
        w.slug as workflow_slug,
        w.ref_db_table_name as reference_table,
        COUNT(DISTINCT r.id) as pending_count
      FROM sys_approval_requests r
      INNER JOIN sys_approval_request_assingees a ON a.request_id = r.id
      INNER JOIN sys_approval_workflows w ON w.id = r.workflow_id
      WHERE a.assigned_to = :userId
        AND a.status = 'pending'
        AND w.is_active = true
        AND r.status_id NOT IN (
          SELECT COALESCE(w2.after_approve_status_id, 0)
          FROM sys_approval_workflows w2 
          WHERE w2.id = w.id
          UNION
          SELECT COALESCE(w2.after_decline_status_id, 0)
          FROM sys_approval_workflows w2 
          WHERE w2.id = w.id
          UNION
          SELECT COALESCE(w2.after_reject_status_id, 0)
          FROM sys_approval_workflows w2 
          WHERE w2.id = w.id
        )
      GROUP BY w.id, w.workflow_name, w.slug, w.ref_db_table_name
      ORDER BY w.workflow_name`,
          {
            replacements: { userId },
            type: QueryTypes.SELECT,
          },
        );

      const data = counts.map((row) => ({
        workflowId: row.workflow_id,
        workflowName: row.workflow_name,
        workflowSlug: row.workflow_slug,
        referenceTable: row.reference_table,
        pendingCount: parseInt(
          row.pending_count,
          10,
        ),
      }));

      return {
        success: true,
        totalCount: data.reduce(
          (sum, item) => sum + item.pendingCount,
          0,
        ),
        data,
      };
    } catch (error) {
      throw ErrorHandlerHelper.handleError(error);
    }
  }

  /**
   * System auto-approve/reject remaining pending approvers when step criteria is met
   * @param requestId - The approval request ID
   * @param stepId - The current step ID
   * @param action - 'approved' or 'rejected'
   * @param ruleType - The step's rule type (ANY, ALL, MAJORITY, CONDITIONAL)
   * @param approvedCount - Number of approved actions
   * @param rejectedCount - Number of rejected actions
   * @param totalAssignees - Total number of assignees for this step
   * @param requiredCount - Required count for CONDITIONAL rule (optional)
   * @param transaction - Database transaction
   */
  private async systemAutoCompleteRemainingApprovers(data: {
    requestId: number;
    stepId: number;
    action: 'approved' | 'rejected';
    ruleType: string;
    approvedCount: number;
    rejectedCount: number;
    totalAssignees: number;
    requiredCount?: number;
    transaction: any;
  }): Promise<void> {
    const {
      requestId,
      stepId,
      action,
      ruleType,
      approvedCount,
      rejectedCount,
      totalAssignees,
      requiredCount,
      transaction,
    } = data;

    // Find all pending approvers for this step
    const pendingApprovers: any[] =
      await this.sequelize.query(
        'SELECT id, assigned_to, uuid FROM sys_approval_request_assingees WHERE request_id = :requestId AND step_id = :stepId AND status = :status',
        {
          replacements: {
            requestId,
            stepId,
            status: 'pending',
          },
          type: QueryTypes.SELECT,
          transaction,
        },
      );

    if (pendingApprovers.length === 0) {
      // No pending approvers to auto-complete
      return;
    }

    // Generate system remark based on rule type
    let systemRemark = '';
    const systemStatus =
      action === 'approved'
        ? 'system_approved'
        : 'system_rejected';
    const actionVerb =
      action === 'approved'
        ? 'approved'
        : 'rejected';
    const actionPastTense =
      action === 'approved'
        ? 'approvals'
        : 'rejections';

    switch (ruleType.toUpperCase()) {
      case 'ANY':
        if (action === 'approved') {
          systemRemark = `System auto-approved: Step requirement met (ANY rule - at least 1 approval required, got ${approvedCount}/${totalAssignees}). This approver's action is no longer needed.`;
        } else {
          systemRemark = `System auto-rejected: Step failed (ANY rule - all ${totalAssignees} approvers rejected). Request cannot proceed.`;
        }
        break;

      case 'ALL':
        if (action === 'approved') {
          systemRemark = `System auto-approved: Step requirement met (ALL rule - all approvers must approve, got ${approvedCount}/${totalAssignees}). Remaining approvers auto-approved.`;
        } else {
          systemRemark = `System auto-rejected: Step failed (ALL rule - requires unanimous approval, but ${rejectedCount}/${totalAssignees} rejected). Request cannot proceed.`;
        }
        break;

      case 'MAJORITY':
        const majorityCount = Math.ceil(
          totalAssignees / 2,
        );
        if (action === 'approved') {
          systemRemark = `System auto-approved: Step requirement met (MAJORITY rule - ${majorityCount}/${totalAssignees} approvals required, got ${approvedCount}). This approver's action is no longer needed.`;
        } else {
          const remainingPotential =
            totalAssignees - rejectedCount;
          systemRemark = `System auto-rejected: Step failed (MAJORITY rule - requires ${majorityCount}/${totalAssignees} approvals, but ${rejectedCount} rejected leaving only ${remainingPotential} potential approvals). Request cannot proceed.`;
        }
        break;

      case 'CONDITIONAL':
        const required = Math.min(
          requiredCount || 1,
          totalAssignees,
        );
        if (action === 'approved') {
          systemRemark = `System auto-approved: Step requirement met (CONDITIONAL rule - ${required}/${totalAssignees} approvals required, got ${approvedCount}). This approver's action is no longer needed.`;
        } else {
          const potential =
            totalAssignees - rejectedCount;
          systemRemark = `System auto-rejected: Step failed (CONDITIONAL rule - requires ${required}/${totalAssignees} approvals, but ${rejectedCount} rejected leaving only ${potential} potential approvals). Request cannot proceed.`;
        }
        break;

      default:
        systemRemark = `System auto-${actionVerb}: Step completion criteria met. This approver's action is no longer needed.`;
    }

    // Update all pending approvers
    for (const approver of pendingApprovers) {
      const userId = approver.assigned_to;

      // Update assignee record with system status and comment
      await this.sequelize.query(
        `UPDATE sys_approval_request_assingees 
       SET status = :status, 
           action_comment = :comment,
           action_at = NOW(),
           updated_at = NOW()
       WHERE id = :id`,
        {
          replacements: {
            id: approver.id,
            status: systemStatus,
            comment: systemRemark,
          },
          type: QueryTypes.UPDATE,
          transaction,
        },
      );

      // Create history entry for system action
      const { v4: uuidv4 } = require('uuid');
      const historyUuid = uuidv4();
      const historyComment = `[System Auto-${action === 'approved' ? 'Approved' : 'Rejected'} for User:${userId}] ${systemRemark}`;

      // Get the appropriate status ID from workflow
      const request =
        await this.approvalRequestModel.findByPk(
          requestId,
          {
            include: [
              {
                association: 'workflow',
                required: true,
              },
            ],
            transaction,
          },
        );

      const actionStatusId =
        action === 'approved'
          ? request.workflow
              .initiateApproveStatusId
          : request.workflow.afterDeclineStatusId;

      await this.sequelize.query(
        `INSERT INTO sys_approval_history 
       (uuid, request_id, step_id, action_status_id, comments, ip_address, action_timestamp, created_by, created_at, updated_at)
       VALUES (:uuid, :requestId, :stepId, :actionStatusId, :comments, :ipAddress, NOW(), :createdBy, NOW(), NOW())`,
        {
          replacements: {
            uuid: historyUuid,
            requestId,
            stepId,
            actionStatusId,
            comments: historyComment,
            ipAddress: 'SYSTEM',
            createdBy: userId, // Track which user this was auto-completed for
          },
          type: QueryTypes.INSERT,
          transaction,
        },
      );
    }

    console.log(
      `[ApprovalsService] System auto-${actionVerb} ${pendingApprovers.length} pending approvers for request ${requestId}, step ${stepId}`,
    );
  }

  /**
   * Send notification to approvers when it's their turn to approve
   * @private
   */
  private async sendApprovalNotification(
    userId: number,
    requestId: number,
    workflowName: string,
    workflowSlug: string,
    sessionVariables: Record<string, any>,
  ): Promise<void> {
    try {
      // Prepare notification data
      const notificationData = {
        type: 'delegation',
        requestId: requestId.toString(),
        workflowSlug: workflowSlug,
        sessionVariables: sessionVariables || {},
      };

      // Send notification
      await this.notificationService.sendToToken(
        userId,
        'Approval Required',
        `You have a new approval request in ${workflowName}`,
        notificationData,
      );

      console.log(
        `[ApprovalsService] Notification sent to user ${userId} for request ${requestId}`,
      );
    } catch (error) {
      // Log error but don't throw - notification failure shouldn't break the approval flow
      console.error(
        `[ApprovalsService] Failed to send notification to user ${userId}:`,
        error,
      );
    }
  }

  /**
   * Notify pending assignees for a specific step
   * @private
   */
  private async notifyPendingAssignees(
    requestId: number,
    stepNumber: number,
    transaction?: any,
  ): Promise<void> {
    try {
      // Get request details
      const request =
        await this.approvalRequestModel.findByPk(
          requestId,
          {
            include: [
              {
                association: 'workflow',
                required: true,
              },
            ],
            transaction,
          },
        );

      if (!request || !request.workflow) {
        console.warn(
          `[ApprovalsService] Request or workflow not found for notification: ${requestId}`,
        );
        return;
      }

      // Get all pending assignees for this step
      const pendingAssignees: any[] =
        await this.sequelize.query(
          `SELECT assigned_to 
           FROM sys_approval_request_assingees 
           WHERE request_id = :requestId 
           AND step_number = :stepNumber 
           AND status = 'pending'
           AND deleted_at IS NULL`,
          {
            replacements: {
              requestId,
              stepNumber,
            },
            type: QueryTypes.SELECT,
            transaction,
          },
        );

      if (pendingAssignees.length === 0) {
        console.log(
          `[ApprovalsService] No pending assignees found for step ${stepNumber}`,
        );
        return;
      }

      // Send notification to each pending assignee
      const notificationPromises =
        pendingAssignees.map((assignee) =>
          this.sendApprovalNotification(
            Number(assignee.assigned_to),
            requestId,
            request.workflow.workflowName,
            request.workflow.slug,
            request.sessionVariables as Record<
              string,
              any
            >,
          ),
        );

      // Send all notifications in parallel (don't await to avoid blocking)
      Promise.all(notificationPromises).catch(
        (error) => {
          console.error(
            '[ApprovalsService] Error sending batch notifications:',
            error,
          );
        },
      );

      console.log(
        `[ApprovalsService] Initiated notifications for ${pendingAssignees.length} approvers in step ${stepNumber}`,
      );
    } catch (error) {
      console.error(
        '[ApprovalsService] Error in notifyPendingAssignees:',
        error,
      );
    }
  }
}
