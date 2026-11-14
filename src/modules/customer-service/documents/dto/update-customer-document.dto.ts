import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDocumentDto } from './create-customer-document.dto';

export class UpdateCustomerDocumentDto extends PartialType(CreateCustomerDocumentDto) {}
