import { Module } from '@nestjs/common';
import { JobLogService } from './job-log.service';
import { JobLogController } from './job-log.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [JobLogController],
  providers: [JobLogService],
  exports: [JobLogService],
})
export class JobLogModule {}
