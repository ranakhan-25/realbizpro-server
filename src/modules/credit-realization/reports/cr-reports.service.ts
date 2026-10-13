import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';

@Injectable()
export class CrReportsService {
  constructor(
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
    @InjectModel(CrInstallmentPayment)
    private readonly paymentModel: typeof CrInstallmentPayment,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
  ) {}

  async getAgingAnalysis() {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const overduePlans = await this.planModel.findAll({
      where: {
        due_date: { [Op.lt]: todayStr },
        due_amount: { [Op.gt]: 0 },
      },
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
    });

    const buckets = {
      '0_30_days': { count: 0, total_due: 0, total_penalty: 0, items: [] as any[] },
      '31_60_days': { count: 0, total_due: 0, total_penalty: 0, items: [] as any[] },
      '61_90_days': { count: 0, total_due: 0, total_penalty: 0, items: [] as any[] },
      '91_120_days': { count: 0, total_due: 0, total_penalty: 0, items: [] as any[] },
      'over_120_days': { count: 0, total_due: 0, total_penalty: 0, items: [] as any[] },
    };

    for (const plan of overduePlans) {
      const dueDate = new Date(plan.due_date);
      const diffMs = today.getTime() - dueDate.getTime();
      const delayDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      const due = Number(plan.due_amount);
      const penalty = Number(plan.penalty_amount || 0);

      const itemSummary = {
        plan_uuid: plan.uuid,
        installment_no: plan.installment_no,
        title: plan.title,
        customer_name: plan.sale_agreement?.customer_name,
        due_date: plan.due_date,
        due_amount: due,
        penalty_amount: penalty,
        delay_days: delayDays,
      };

      if (delayDays <= 30) {
        buckets['0_30_days'].count++;
        buckets['0_30_days'].total_due += due;
        buckets['0_30_days'].total_penalty += penalty;
        buckets['0_30_days'].items.push(itemSummary);
      } else if (delayDays <= 60) {
        buckets['31_60_days'].count++;
        buckets['31_60_days'].total_due += due;
        buckets['31_60_days'].total_penalty += penalty;
        buckets['31_60_days'].items.push(itemSummary);
      } else if (delayDays <= 90) {
        buckets['61_90_days'].count++;
        buckets['61_90_days'].total_due += due;
        buckets['61_90_days'].total_penalty += penalty;
        buckets['61_90_days'].items.push(itemSummary);
      } else if (delayDays <= 120) {
        buckets['91_120_days'].count++;
        buckets['91_120_days'].total_due += due;
        buckets['91_120_days'].total_penalty += penalty;
        buckets['91_120_days'].items.push(itemSummary);
      } else {
        buckets['over_120_days'].count++;
        buckets['over_120_days'].total_due += due;
        buckets['over_120_days'].total_penalty += penalty;
        buckets['over_120_days'].items.push(itemSummary);
      }
    }

    return {
      as_of_date: todayStr,
      total_overdue_accounts: overduePlans.length,
      buckets,
    };
  }

  async getOverdueSummary() {
    const agreements = await this.agreementModel.findAll({
      include: [{ model: this.planModel, as: 'installment_plans' }],
    });

    let totalContractValue = 0;
    let totalCollected = 0;
    let totalOverdue = 0;
    let totalPenalty = 0;

    for (const ag of agreements) {
      totalContractValue += Number(ag.total_price || 0);
      for (const p of ag.installment_plans || []) {
        totalCollected += Number(p.paid_amount || 0);
        if (p.status === 'overdue' || (p.due_amount > 0 && new Date(p.due_date) < new Date())) {
          totalOverdue += Number(p.due_amount || 0);
          totalPenalty += Number(p.penalty_amount || 0);
        }
      }
    }

    return {
      total_sale_agreements: agreements.length,
      total_contract_value: totalContractValue,
      total_collected: totalCollected,
      total_overdue_principal: totalOverdue,
      total_accrued_penalty: totalPenalty,
      recovery_rate:
        totalContractValue > 0
          ? ((totalCollected / totalContractValue) * 100).toFixed(2) + '%'
          : '0%',
    };
  }

  async getCollectionSummary() {
    const payments = await this.paymentModel.findAll();

    let totalPaid = 0;
    let totalPenaltyPaid = 0;
    const byMethod: Record<string, number> = {};

    for (const pm of payments) {
      const amount = Number(pm.paid_amount || 0);
      totalPaid += amount;
      const method = pm.payment_method || (pm as any).paymentMethod || (pm as any).dataValues?.payment_method || 'other';
      byMethod[method] = (byMethod[method] || 0) + amount;
    }

    return {
      total_transactions: payments.length,
      total_collected_principal: totalPaid,
      total_penalty_collected: totalPenaltyPaid,
      total_realized: totalPaid + totalPenaltyPaid,
      breakdown_by_payment_method: byMethod,
    };
  }
}
