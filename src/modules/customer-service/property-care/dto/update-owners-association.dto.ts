import { PartialType } from '@nestjs/swagger';
import { CreateOwnersAssociationDto } from './create-owners-association.dto';

export class UpdateOwnersAssociationDto extends PartialType(CreateOwnersAssociationDto) {}
