import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrmInternalTask } from '../../../database/models/crm/crm_internal_task.model';
import { CrmInternalTaskAssignee } from '../../../database/models/crm/crm_internal_task_assignee.model';
import { CreateCrmTaskDto, UpdateCrmTaskDto } from './dto/create-crm-task.dto';

@Injectable()
export class CrmTasksService {
  constructor(
    @InjectModel(CrmInternalTask)
    private readonly taskModel: typeof CrmInternalTask,
    @InjectModel(CrmInternalTaskAssignee)
    private readonly assigneeModel: typeof CrmInternalTaskAssignee,
  ) {}

  async create(createDto: CreateCrmTaskDto) {
    const { assignee_ids, ...taskData } = createDto;
    const task = await this.taskModel.create(taskData as any);

    if (assignee_ids && assignee_ids.length > 0) {
      for (const userId of assignee_ids) {
        await this.assigneeModel.create({
          task_id: task.id,
          user_id: userId,
          status: 'assigned',
        } as any);
      }
    }

    return this.findOne(task.uuid);
  }

  async findAll() {
    return await this.taskModel.findAll({
      include: [{ model: this.assigneeModel, as: 'assignees' }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(uuid: string) {
    const task = await this.taskModel.findOne({
      where: { uuid },
      include: [{ model: this.assigneeModel, as: 'assignees' }],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(uuid: string, updateDto: UpdateCrmTaskDto) {
    const task = await this.findOne(uuid);
    const { assignee_ids, ...taskData } = updateDto;
    await task.update(taskData as any);

    if (assignee_ids && assignee_ids.length > 0) {
      await this.assigneeModel.destroy({ where: { task_id: task.id } });
      for (const userId of assignee_ids) {
        await this.assigneeModel.create({
          task_id: task.id,
          user_id: userId,
          status: 'assigned',
        } as any);
      }
    }

    return this.findOne(uuid);
  }

  async remove(uuid: string) {
    const task = await this.findOne(uuid);
    await this.assigneeModel.destroy({ where: { task_id: task.id } });
    await task.destroy();
    return { success: true, message: 'Task deleted successfully' };
  }
}
