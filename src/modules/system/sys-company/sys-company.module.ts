import { Global, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyController } from './sys-company.controller';
import { CompanyService } from './sys-company.service';
import { SysCompany } from '@/database/models/system/sys_company.model';
import { AuthModule } from '@/modules/engine/user-management/auth/auth.module';
import { UsersModule } from '@/modules/engine/user-management/users/users.module';

@Global()
@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([SysCompany]),
    UsersModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
