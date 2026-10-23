import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementSubcontractPackage } from 'src/database/models/procurement/configuration/subcontract-package/pr_subcontract_package.model';
import { ProcurementSubcontractPackageController } from './subcontract-package.controller';
import { ProcurementSubcontractPackageService } from './subcontract-package.service';

@Module({ imports: [SequelizeModule.forFeature([ProcurementSubcontractPackage])], controllers: [ProcurementSubcontractPackageController], providers: [ProcurementSubcontractPackageService], exports: [ProcurementSubcontractPackageService] })
export class ProcurementSubcontractPackageModule {}
