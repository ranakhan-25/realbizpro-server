import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';

import { DeductionRuleController } from './deduction-rule.controller';

import { DeductionRuleService } from './deduction-rule.service';
import { DeductionRule } from 'src/database/models/hrm/configuration/deduction_rule_model';

@Module({
  imports: [
    SequelizeModule.forFeature([DeductionRule]),
  ],

  controllers: [DeductionRuleController],

  providers: [DeductionRuleService],

  exports: [DeductionRuleService],
})
export class DeductionRuleModule {}
