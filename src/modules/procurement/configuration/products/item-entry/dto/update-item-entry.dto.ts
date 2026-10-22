import { PartialType } from '@nestjs/swagger';
import { CreateProcurementItemEntryDto } from './create-item-entry.dto';

export class UpdateProcurementItemEntryDto extends PartialType(CreateProcurementItemEntryDto) {}
