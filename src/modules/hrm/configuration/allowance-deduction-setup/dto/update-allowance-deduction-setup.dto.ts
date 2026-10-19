import { PartialType } from '@nestjs/swagger';
import { CreateAllowanceDeductionSetupDto } from './create-allowance-deduction-setup.dto';

export class UpdateAllowanceDeductionSetupDto extends PartialType(
  CreateAllowanceDeductionSetupDto,
) {}
