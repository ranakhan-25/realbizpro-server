import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CrInstallmentPlan } from '../../../database/models/credit-realization/cr_installment_plan.model';
import { CrInstallmentPayment } from '../../../database/models/credit-realization/cr_installment_payment.model';
import { CrSaleAgreement } from '../../../database/models/credit-realization/cr_sale_agreement.model';
import { CrOfficerAssignment } from '../../../database/models/credit-realization/cr_officer_assignment.model';
import { CrRecoveryLog } from '../../../database/models/credit-realization/cr_recovery_log.model';

@Injectable()
export class CrReportsService {
  constructor(
    @InjectModel(CrInstallmentPlan)
    private readonly planModel: typeof CrInstallmentPlan,
    @InjectModel(CrInstallmentPayment)
    private readonly paymentModel: typeof CrInstallmentPayment,
    @InjectModel(CrSaleAgreement)
    private readonly agreementModel: typeof CrSaleAgreement,
    @InjectModel(CrOfficerAssignment)
    private readonly assignmentModel: typeof CrOfficerAssignment,
    @InjectModel(CrRecoveryLog)
    private readonly recoveryModel: typeof CrRecoveryLog,
  ) {}

  async getAgingAnalysis(orgId?: string) {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const whereClause: any = {
      due_date: { [Op.lt]: todayStr },
      due_amount: { [Op.gt]: 0 },
    };
    if (orgId) whereClause.org_id = orgId;

    const overduePlans = await this.planModel.findAll({
      where: whereClause,
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

  async getOverdueSummary(orgId?: string) {
    const whereClause: any = {};
    if (orgId) whereClause.org_id = orgId;

    const agreements = await this.agreementModel.findAll({
      where: whereClause,
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

  async getCollectionSummary(orgId?: string) {
    const whereClause: any = {};
    if (orgId) whereClause.org_id = orgId;

    const payments = await this.paymentModel.findAll({ where: whereClause });

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

  async getOfficerPerformance(orgId?: string) {
    const whereClause: any = {};
    if (orgId) whereClause.org_id = orgId;

    const assignments = await this.assignmentModel.findAll({
      where: whereClause,
      include: [{ model: this.agreementModel, as: 'sale_agreement' }],
    });

    const officerMap: Record<string, {
      officer_id: string;
      officer_name: string;
      total_target: number;
      total_collected: number;
      assigned_count: number;
      achieved_count: number;
    }> = {};

    for (const a of assignments) {
      const officerId = a.officer_id;
      if (!officerMap[officerId]) {
        officerMap[officerId] = {
          officer_id: officerId,
          officer_name: a.officer_name,
          total_target: 0,
          total_collected: 0,
          assigned_count: 0,
          achieved_count: 0,
        };
      }
      const target = Number(a.target_amount || 0);
      const collected = Number(a.collected_amount || 0);
      officerMap[officerId].total_target += target;
      officerMap[officerId].total_collected += collected;
      officerMap[officerId].assigned_count += 1;
      if (a.status === 'achieved' || (target > 0 && collected >= target)) {
        officerMap[officerId].achieved_count += 1;
      }
    }

    const leaderboard = Object.values(officerMap).map((o) => {
      const rate = o.total_target > 0 ? (o.total_collected / o.total_target) * 100 : 0;
      return {
        ...o,
        achievement_percentage: parseFloat(rate.toFixed(2)),
      };
    }).sort((a, b) => b.achievement_percentage - a.achievement_percentage);

    return {
      total_officers: leaderboard.length,
      total_assigned_target: leaderboard.reduce((sum, o) => sum + o.total_target, 0),
      total_realized_by_officers: leaderboard.reduce((sum, o) => sum + o.total_collected, 0),
      leaderboard,
    };
  }

  async getDefaultersLeaderboard(orgId?: string) {
    const whereClause: any = {
      due_date: { [Op.lt]: new Date().toISOString().split('T')[0] },
      due_amount: { [Op.gt]: 0 },
    };
    if (orgId) whereClause.org_id = orgId;

    const overduePlans = await this.planModel.findAll({
      where: whereClause,
      include: [
        {
          model: this.agreementModel,
          as: 'sale_agreement',
          include: [{ model: this.recoveryModel, as: 'recovery_logs' }],
        },
      ],
      order: [['due_amount', 'DESC']],
    });

    const defaulterMap: Record<string, any> = {};

    for (const plan of overduePlans) {
      const agreement = plan.sale_agreement;
      if (!agreement) continue;
      const key = agreement.agreement_number || String(agreement.id);

      if (!defaulterMap[key]) {
        const lastRecovery = agreement.recovery_logs && agreement.recovery_logs.length > 0
          ? agreement.recovery_logs[agreement.recovery_logs.length - 1]
          : null;

        defaulterMap[key] = {
          agreement_number: agreement.agreement_number,
          customer_name: agreement.customer_name,
          customer_phone: agreement.customer_phone,
          unit_identifier: agreement.unit_identifier,
          property_type: agreement.property_type,
          total_overdue: 0,
          total_penalty: 0,
          max_delay_days: 0,
          overdue_installments_count: 0,
          last_recovery_action: lastRecovery ? lastRecovery.action_type : 'None',
          last_recovery_note: lastRecovery ? lastRecovery.customer_response || lastRecovery.outcome : null,
          last_recovery_date: lastRecovery ? lastRecovery.action_date : null,
        };
      }

      const due = Number(plan.due_amount || 0);
      const penalty = Number(plan.penalty_amount || 0);
      const delay = Number(plan.delay_days || 0);

      defaulterMap[key].total_overdue += due;
      defaulterMap[key].total_penalty += penalty;
      defaulterMap[key].overdue_installments_count += 1;
      if (delay > defaulterMap[key].max_delay_days) {
        defaulterMap[key].max_delay_days = delay;
      }
    }

    const leaderboard = Object.values(defaulterMap)
      .sort((a: any, b: any) => b.total_overdue - a.total_overdue)
      .slice(0, 20);

    return {
      count: leaderboard.length,
      defaulters: leaderboard,
    };
  }
}
