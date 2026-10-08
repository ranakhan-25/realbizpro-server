import { PartialType } from '@nestjs/swagger';
import { CreateNegotiationProcessDto } from './create-negotiation-process.dto';

export class UpdateNegotiationProcessDto extends PartialType(CreateNegotiationProcessDto) {}
