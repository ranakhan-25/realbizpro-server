// Auto-generated types for Task
// Source: src/database/models/projects/task/pr_task.model.ts

import { TaskPriority } from '../models/projects/task/pr_task.model';
import { TaskStatus } from '../models/projects/task/pr_task.model';

export interface TaskAttributes {
  id: number;
  uuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  uid?: string | null;
  taskName: string;
  progress: number;
  priority: TaskPriority;
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: string | null;
  status: TaskStatus;
  completeDate?: Date | null;
  budget?: number | null;
  cost?: number | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface TaskCreationAttributes {
  uid?: string | null;
  taskName: string;
  progress?: number; // Has default value
  priority?: TaskPriority; // Has default value
  startDate?: Date | null;
  endDate?: Date | null;
  duration?: string | null;
  status?: TaskStatus; // Has default value
  completeDate?: Date | null;
  budget?: number | null;
  cost?: number | null;
  addedById?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export type TaskUpdateAttributes = Partial<TaskCreationAttributes>;

// Helper type for including relations
export interface TaskWithRelations extends TaskAttributes {
  // No relations defined
}
