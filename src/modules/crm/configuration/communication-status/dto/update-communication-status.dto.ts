import { PartialType } from '@nestjs/swagger';
import { CreateCommunicationStatusDto } from './create-communication-status.dto';

export class UpdateCommunicationStatusDto extends PartialType(CreateCommunicationStatusDto) {}
