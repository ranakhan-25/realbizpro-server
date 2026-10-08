import { PartialType } from '@nestjs/swagger';
import { CreateInvUnitDto } from './create-inv-unit.dto';

export class UpdateInvUnitDto extends PartialType(CreateInvUnitDto) {}
