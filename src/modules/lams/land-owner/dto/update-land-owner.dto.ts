import { PartialType } from '@nestjs/swagger';
import { CreateLandOwnerDto } from './create-land-owner.dto';

export class UpdateLandOwnerDto extends PartialType(CreateLandOwnerDto) {}
