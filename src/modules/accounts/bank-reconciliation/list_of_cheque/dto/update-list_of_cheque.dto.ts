import { PartialType } from '@nestjs/swagger';
import { CreateChequeDto } from './create-list_of_cheque.dto';

export class UpdateListOfChequeDto extends PartialType(CreateChequeDto) {}
