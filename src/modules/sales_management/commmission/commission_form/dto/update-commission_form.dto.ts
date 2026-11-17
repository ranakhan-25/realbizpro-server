import { PartialType } from '@nestjs/swagger';
import { CreateCommissionDto } from './create-commission_form.dto';

export class UpdateCommissionDto extends PartialType(CreateCommissionDto) {}
