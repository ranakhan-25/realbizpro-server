import { PartialType } from '@nestjs/swagger';
import { CreateAcquisitionLeadDto } from './create-acquisition-lead.dto';

export class UpdateAcquisitionLeadDto extends PartialType(CreateAcquisitionLeadDto) {}
