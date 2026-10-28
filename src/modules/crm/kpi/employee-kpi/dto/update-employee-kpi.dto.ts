import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeKpiDto } from './create-employee-kpi.dto';

export class UpdateEmployeeKpiDto extends PartialType(CreateEmployeeKpiDto) {}
