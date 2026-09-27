import { Injectable } from '@nestjs/common';

export interface CreateJobLogDto {
  jobCode: string;
  queueName: string;
  jobName: string;
  jobStatus: string;

  payload?: unknown;

  attempts?: number;
  progress?: number;
  startedAt?: Date;
}

export interface UpdateJobLogDto {
  jobCode: string;

  jobStatus?: string;

  progress?: number;

  attempts?: number;

  finishedAt?: Date;

  errorMessage?: string;

  stackTrace?: string;

  result?: unknown;
}

@Injectable()
export class JobLogService {
  constructor() {}

  async createJobLog(dto: CreateJobLogDto) {
    return (this as any).jobLogModel.create({
      jobCode: dto.jobCode,
      queueName: dto.queueName,
      jobName: dto.jobName,
      jobStatus: dto.jobStatus,
      payload: dto.payload,
      attempts: dto.attempts ?? 0,
      progress: dto.progress ?? 0,
      startedAt: dto.startedAt ?? new Date(),
    });
  }

  async updateJobLog(dto: UpdateJobLogDto) {
    const job = await (
      this as any
    ).jobLogModel.findOne({
      where: {
        jobCode: dto.jobCode,
      },
    });

    if (!job) {
      return null;
    }

    if (dto.jobStatus !== undefined) {
      job.jobStatus = dto.jobStatus;
    }

    if (dto.progress !== undefined) {
      job.progress = dto.progress;
    }

    if (dto.attempts !== undefined) {
      job.attempts = dto.attempts;
    }

    if (dto.errorMessage !== undefined) {
      job.errorMessage = dto.errorMessage;
    }

    if (dto.stackTrace !== undefined) {
      job.stackTrace = dto.stackTrace;
    }

    if (dto.result !== undefined) {
      job.result = dto.result;
    }

    if (dto.finishedAt) {
      job.finishedAt = dto.finishedAt;

      if (job.startedAt) {
        job.duration =
          dto.finishedAt.getTime() -
          job.startedAt.getTime();
      }
    }

    return job.save();
  }

  async findAll() {
    return (this as any).jobLogModel.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(jobCode: string) {
    return (this as any).jobLogModel.findOne({
      where: { jobCode },
    });
  }

  async remove(jobCode: string) {
    return (this as any).jobLogModel.destroy({
      where: { jobCode },
    });
  }

  async clearCompleted() {
    return (this as any).jobLogModel.destroy({
      where: {
        jobStatus: 'completed',
      },
    });
  }

  async clearFailed() {
    return (this as any).jobLogModel.destroy({
      where: {
        jobStatus: 'failed',
      },
    });
  }
}
