import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Lead } from 'src/database/models/crm/lead/crm-lead.model';
import { LeadStage } from 'src/database/models/crm/configuration/crm-lead-stage.model';
import { LeadTeam, } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { Project } from 'src/database/models/projects/project/pr_project.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { QuerySalesPipelineFunnelReportDto } from './dto/query-sales-pipeline-funnel-report.dto';

@Injectable()
export class SalesPipelineFunnelReportService {
  constructor(
    @InjectModel(Lead) private readonly leads: typeof Lead,
    @InjectModel(LeadStage) private readonly stages: typeof LeadStage,
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly teamMembers: typeof LeadTeamMember,
    @InjectModel(Project) private readonly projects: typeof Project,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async dropdowns() {
    const [users, teams, projects] = await Promise.all([
      this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'userCode', 'name'], order: [['name', 'ASC']] }),
      this.teams.findAll({ attributes: ['id', 'uuid', 'name'], order: [['name', 'ASC']] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] }),
    ]);
    return { users, teams, projects };
  }

  async report(query: QuerySalesPipelineFunnelReportDto) {
    const [leads, stages, teams, members, users, projects] = await Promise.all([
      this.leads.findAll({ attributes: ['id', 'uuid', 'leadCode', 'clientName', 'status', 'leadDate', 'leadStageId', 'assignedTo', 'projectId'] }),
      this.stages.findAll({ where: { isActive: true }, attributes: ['id', 'uuid', 'name', 'sortOrder'], order: [['sortOrder', 'ASC'], ['id', 'ASC']] }),
      this.teams.findAll({ attributes: ['id', 'uuid', 'name'] }),
      this.teamMembers.findAll({ where: { isActive: true }, attributes: ['teamId', 'userId'] }),
      this.users.findAll({ attributes: ['uuid', 'userCode', 'name'] }),
      this.projects.findAll({ attributes: ['uuid', 'code', 'name'] }),
    ]);
    const userMap = new Map<string, SysUser>();
    for (const user of users) { userMap.set(user.uuid, user); if (user.userCode) userMap.set(user.userCode, user); userMap.set(user.name, user); }
    const teamMap = new Map<string, LeadTeam>();
    for (const team of teams) { teamMap.set(String(team.id), team); teamMap.set(team.uuid, team); teamMap.set(team.name, team); }
    const projectMap = new Map<string, Project>();
    for (const project of projects) { projectMap.set(project.uuid, project); projectMap.set(project.code, project); projectMap.set(project.name, project); }
    const userTeam = new Map<string, LeadTeam>();
    for (const member of members) { const team = teamMap.get(String(member.teamId)); if (team) userTeam.set(member.userId, team); }
    const selectedUser = query.userId ? userMap.get(query.userId.trim()) : undefined;
    const selectedTeam = query.teamId ? teamMap.get(query.teamId.trim()) : undefined;
    const selectedProject = query.projectId ? projectMap.get(query.projectId.trim()) : undefined;
    const filtered = leads.filter(lead => {
      const user = userMap.get(lead.assignedTo ?? '');
      const team = user ? userTeam.get(user.uuid) : undefined;
      const project = projectMap.get(lead.projectId ?? '');
      const date = String(lead.leadDate ?? '').slice(0, 10);
      return (!query.dateFrom || date >= query.dateFrom) && (!query.dateTo || date <= query.dateTo)
        && (!selectedUser || user?.uuid === selectedUser.uuid)
        && (!selectedTeam || team?.uuid === selectedTeam.uuid || String(team?.id) === String(selectedTeam.id))
        && (!selectedProject || project?.uuid === selectedProject.uuid || lead.projectId === selectedProject.code);
    });
    const stageCounts = new Map<number, number>();
    for (const lead of filtered) stageCounts.set(Number(lead.leadStageId), (stageCounts.get(Number(lead.leadStageId)) ?? 0) + 1);
    const totalLeads = filtered.length;
    const activeLeads = filtered.filter(lead => !this.isJunk(lead.status) && !this.isClosed(lead, stages)).length;
    const junkLeads = filtered.filter(lead => this.isJunk(lead.status)).length;
    const dealClosed = filtered.filter(lead => this.isClosed(lead, stages)).length;
    const funnelStages = stages.map((stage, index) => {
      const leadsCount = stageCounts.get(Number(stage.id)) ?? 0;
      const previous = index === 0 ? totalLeads : (stageCounts.get(Number(stages[index - 1].id)) ?? 0);
      const dropOff = index === 0 ? 0 : Math.max(previous - leadsCount, 0);
      const conversion = previous > 0 ? (leadsCount / previous) * 100 : 0;
      const totalConversion = totalLeads > 0 ? (leadsCount / totalLeads) * 100 : 0;
      return { sl: index + 1, stageId: stage.id, stage: stage.name, leads: leadsCount, dropOff, conversion: `${conversion.toFixed(0)}%`, totalConversion: `${totalConversion.toFixed(0)}%` };
    });
    return {
      cards: { totalLeads, activeLeads, junkLeads, dealClosed, overallConversion: `${totalLeads > 0 ? ((dealClosed / totalLeads) * 100).toFixed(0) : 0}%` },
      funnel: funnelStages.map(item => ({ stage: item.stage, leads: item.leads })),
      pipelineDetails: funnelStages,
      meta: { dateFrom: query.dateFrom ?? null, dateTo: query.dateTo ?? null, userId: query.userId ?? null, teamId: query.teamId ?? null, projectId: query.projectId ?? null, total: totalLeads },
    };
  }

  private isJunk(status?: string) { return /junk|deleted|inactive/i.test(status ?? ''); }
  private isClosed(lead: Lead, stages: LeadStage[]) {
    const stage = stages.find(item => Number(item.id) === Number(lead.leadStageId));
    return /closed|deal|booked|sold|converted/i.test(`${stage?.name ?? ''} ${lead.status ?? ''}`);
  }
}
