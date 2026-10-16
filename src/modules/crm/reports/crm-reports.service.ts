import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CrmLead } from '../../../database/models/crm/crm_lead.model';
import { CrmLeadStage } from '../../../database/models/crm/crm_lead_stage.model';
import { CrmLeadSource } from '../../../database/models/crm/crm_lead_source.model';
import { CrmLeadActivity } from '../../../database/models/crm/crm_lead_activity.model';
import { CrmDealNegotiation } from '../../../database/models/crm/crm_deal_negotiation.model';

@Injectable()
export class CrmReportsService {
  constructor(
    @InjectModel(CrmLead)
    private readonly leadModel: typeof CrmLead,
    @InjectModel(CrmLeadStage)
    private readonly stageModel: typeof CrmLeadStage,
    @InjectModel(CrmLeadSource)
    private readonly sourceModel: typeof CrmLeadSource,
    @InjectModel(CrmLeadActivity)
    private readonly activityModel: typeof CrmLeadActivity,
    @InjectModel(CrmDealNegotiation)
    private readonly dealNegotiationModel: typeof CrmDealNegotiation,
  ) {}

  async getLeadFunnel() {
    const stages = await this.stageModel.findAll({ order: [['order', 'ASC']] });
    const leads = await this.leadModel.findAll();

    const stageCounts = stages.map((stage) => {
      const count = leads.filter(
        (l) => Number(l.lead_stage_id) === Number(stage.id),
      ).length;
      return {
        stage_id: stage.id,
        stage_name: stage.name,
        count,
        color: stage.color,
      };
    });

    const totalLeads = leads.length;
    const closedWonCount = leads.filter(
      (l) =>
        l.status === 'won' ||
        Number(l.lead_stage_id) === Number(stages[stages.length - 1]?.id),
    ).length;

    return {
      total_leads: totalLeads,
      funnel_stages: stageCounts,
      conversion_rate:
        totalLeads > 0
          ? ((closedWonCount / totalLeads) * 100).toFixed(2) + '%'
          : '0%',
    };
  }

  async getSourcePerformance() {
    const sources = await this.sourceModel.findAll();
    const leads = await this.leadModel.findAll();

    return sources.map((src) => {
      const count = leads.filter(
        (l) => Number(l.lead_source_id) === Number(src.id),
      ).length;
      return {
        source_id: src.id,
        source_name: src.name,
        lead_count: count,
      };
    });
  }

  async getTeamProductivity() {
    const activities = await this.activityModel.findAll();
    const negotiations = await this.dealNegotiationModel.findAll();

    return {
      total_activities_logged: activities.length,
      calls_completed: activities.filter((a) => a.activity_type === 'call').length,
      site_visits: activities.filter((a) => a.activity_type === 'visit').length,
      total_deals_negotiating: negotiations.length,
      deals_approved: negotiations.filter((n) => n.approval_status === 'approved').length,
    };
  }
}
