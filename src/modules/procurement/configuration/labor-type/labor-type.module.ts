import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProcurementLaborType } from 'src/database/models/procurement/configuration/labor-type/pr_labor_type.model';
import { ProcurementLaborTypeController } from './labor-type.controller';
import { ProcurementLaborTypeService } from './labor-type.service';

@Module({ imports: [SequelizeModule.forFeature([ProcurementLaborType])], controllers: [ProcurementLaborTypeController], providers: [ProcurementLaborTypeService], exports: [ProcurementLaborTypeService] })
export class ProcurementLaborTypeModule {}
