import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrFinancialAdjustment } from '../../../database/models/credit-realization/cr_financial_adjustment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CreateCrAdjustmentDto } from './dto/create-cr-adjustment.dto';

@Injectable()
export class CrAdjustmentService {
  constructor(
    @InjectModel(CrFinancialAdjustment)
    private readonly adjustmentModel: typeof CrFinancialAdjustment,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
  ) {}

  async create(createDto: CreateCrAdjustmentDto, orgId?: string, userEmail?: string) {
    const agreement = await this.agreementModel.findByPk(createDto.sale_agreement_id);
    if (!agreement) {
      throw new NotFoundException(`Sale Agreement with ID ${createDto.sale_agreement_id} not found`);
    }

    let plan: CrInstallmentPlan | null = null;
    if (createDto.installment_plan_id) {
      plan = await this.planModel.findByPk(createDto.installment_plan_id);
      if (!plan) {
        throw new NotFoundException(`Installment Plan with ID ${createDto.installment_plan_id} not found`);
      }
      if (Number(plan.sale_agreement_id) !== Number(createDto.sale_agreement_id)) {
        throw new BadRequestException('Installment Plan does not belong to the specified Sale Agreement');
      }
    }

    const payload: any = {
      ...createDto,
      org_id: orgId || createDto.org_id || agreement.org_id || 'default-org-id',
      status: 'applied',
      createdBy: userEmail || createDto.createdBy,
    };

    const adjustment = await this.adjustmentModel.create(payload);

    // Apply financial effect to installment plan if targetted
    if (plan) {
      const amount = Number(createDto.amount);
      let newDue = Number(plan.due_amount);
      let newPayable = Number(plan.payable_amount);

      if (createDto.adjustment_type === 'credit_note') {
        newDue = Math.max(0, newDue - amount);
      } else if (createDto.adjustment_type === 'debit_note') {
        newDue = newDue + amount;
        newPayable = newPayable + amount;
      } else if (createDto.adjustment_type === 'rounding') {
        newDue = Math.max(0, newDue - amount);
      }

      let newStatus = plan.status;
      if (newDue <= 0) {
        newStatus = 'paid';
      } else if (Number(plan.paid_amount) > 0) {
        newStatus = 'partial';
      } else {
        newStatus = 'unpaid';
      }

      await plan.update({
        due_amount: newDue,
        payable_amount: newPayable,
        status: newStatus,
        updatedBy: userEmail,
      });
    }

    return adjustment;
  }

  async findAll(query: {
    org_id?: string;
    sale_agreement_id?: number;
    adjustment_type?: string;
    status?: string;
  }) {
    const where: any = {};
    if (query.org_id) where.org_id = query.org_id;
    if (query.sale_agreement_id) where.sale_agreement_id = query.sale_agreement_id;
    if (query.adjustment_type) where.adjustment_type = query.adjustment_type;
    if (query.status) where.status = query.status;

    return this.adjustmentModel.findAll({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
          attributes: [
            'id',
            'uuid',
            'agreement_number',
            'customer_name',
            'property_type',
            'unit_identifier',
          ],
        },
        {
          model: this.planModel,
          as: 'installment_plan',
          attributes: [
            'id',
            'uuid',
            'installment_no',
            'title',
            'due_date',
            'payable_amount',
            'due_amount',
            'status',
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(uuid: string, orgId?: string) {
    const where: any = { uuid };
    if (orgId) where.org_id = orgId;

    const adjustment = await this.adjustmentModel.findOne({
      where,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
        },
        {
          model: this.planModel,
          as: 'installment_plan',
        },
      ],
    });

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with UUID ${uuid} not found`);
    }

    return adjustment;
  }

  async reverse(uuid: string, orgId?: string, userEmail?: string, reverseReason?: string) {
    const adjustment = await this.findOne(uuid, orgId);
    if (adjustment.status === 'reversed') {
      throw new BadRequestException('Adjustment has already been reversed');
    }

    // Revert effect on installment plan if linked
    if (adjustment.installment_plan_id) {
      const plan = await this.planModel.findByPk(adjustment.installment_plan_id);
      if (plan) {
        const amount = Number(adjustment.amount);
        let newDue = Number(plan.due_amount);
        let newPayable = Number(plan.payable_amount);

        if (adjustment.adjustment_type === 'credit_note') {
          newDue = newDue + amount;
        } else if (adjustment.adjustment_type === 'debit_note') {
          newDue = Math.max(0, newDue - amount);
          newPayable = Math.max(0, newPayable - amount);
        } else if (adjustment.adjustment_type === 'rounding') {
          newDue = newDue + amount;
        }

        let newStatus = plan.status;
        if (newDue <= 0) {
          newStatus = 'paid';
        } else if (Number(plan.paid_amount) > 0) {
          newStatus = 'partial';
        } else {
          newStatus = 'unpaid';
        }

        await plan.update({
          due_amount: newDue,
          payable_amount: newPayable,
          status: newStatus,
          updatedBy: userEmail,
        });
      }
    }

    return adjustment.update({
      status: 'reversed',
      reason: reverseReason ? `${adjustment.reason} | Reversal Reason: ${reverseReason}` : adjustment.reason,
      updatedBy: userEmail,
    });
  }

  async remove(uuid: string, orgId?: string, userEmail?: string) {
    const adjustment = await this.findOne(uuid, orgId);
    if (adjustment.status === 'applied') {
      // Revert before deleting to keep ledger consistent
      await this.reverse(uuid, orgId, userEmail, 'Auto reversed on deletion');
    }
    if (userEmail) {
      adjustment.deletedBy = userEmail;
      await adjustment.save();
    }
    await adjustment.destroy();
    return { success: true, message: `Adjustment ${uuid} deleted successfully` };
  }
}
