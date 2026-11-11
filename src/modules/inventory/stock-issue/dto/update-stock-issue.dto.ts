import { PartialType } from '@nestjs/swagger';
import { CreateStockIssueDto } from './create-stock-issue.dto';

export class UpdateStockIssueDto extends PartialType(CreateStockIssueDto) {}
