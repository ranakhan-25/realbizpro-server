import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyGuard } from '@/common/guards/company.guard';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, CompanyGuard],
  exports: [CompanyService, CompanyGuard],
})
export class CompanyModule {}
