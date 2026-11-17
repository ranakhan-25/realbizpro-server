export { CreateAgreementDto } from './create-agreementview.dto';
export { QueryAgreementDto } from './query-agreementview.dto';
export { UpdateAgreementDto } from './update-agreementview.dto';
import { IsUUID } from 'class-validator';
export class RestoreAgreementDto {
  @IsUUID('4')
  uuid: string;
}
