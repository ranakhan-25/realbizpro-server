import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Project, ProjectStatus } from 'src/database/models/projects/project/pr_project.model';
import { ProjectType } from 'src/database/models/projects/project-type/pr_project_type.model';
import { LeadArea } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { ProjectService } from 'src/modules/projects/project/project.service';

@Injectable()
export class CrmProjectService {
  constructor(
    private readonly projects: ProjectService,
    @InjectModel(ProjectType) private readonly projectTypes: typeof ProjectType,
    @InjectModel(LeadArea) private readonly areas: typeof LeadArea,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
    @InjectModel(Project) private readonly projectModel: typeof Project,
  ) {}

  async dropdown() {
    const [projectTypes, areas, users, storeys] = await Promise.all([
      this.projectTypeDropdown(), this.areaDropdown(), this.userDropdown(), this.storeyDropdown(),
    ]);
    return {
      projectTypes,
      projectManagers: users,
      users,
      areas,
      statuses: Object.values(ProjectStatus)
        .map(value => ({ value, label: value.replaceAll('_', ' ') })),
      numberOfStoreys: storeys,
    };
  }

  async projectTypeDropdown() {
    const rows = await this.projectTypes.findAll({ attributes: ['uuid', 'code', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => { const item = row.toJSON() as unknown as Record<string, unknown>; delete item.id; return item; });
  }

  async areaDropdown() {
    const rows = await this.areas.findAll({ attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
    return rows.map(row => { const item = row.toJSON() as unknown as Record<string, unknown>; delete item.id; return item; });
  }

  async userDropdown() {
    const rows = await this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name', 'email'], order: [['name', 'ASC']] });
    return rows.map(row => { const item = row.toJSON() as unknown as Record<string, unknown>; delete item.id; return item; });
  }

  async storeyDropdown() {
    const rows = await this.projectModel.findAll({ attributes: ['numberOfStoreys'], where: { numberOfStoreys: { [Op.ne]: null } }, group: ['numberOfStoreys'], order: [['numberOfStoreys', 'ASC']] });
    return rows.map(row => row.numberOfStoreys);
  }

  async create(dto: any, userId?: number) {
    await this.validateRelations(dto);
    return this.toPublicProject(await this.projects.create(dto, userId));
  }
  async findAll(query: any) {
    const result = await this.projects.findAll(query);
    return { ...result, data: result.data.map(project => this.toPublicProject(project)) };
  }
  async findOne(uuid: string) { return this.toPublicProject(await this.projects.findOne(uuid)); }
  async update(uuid: string, dto: any, userId?: number) {
    await this.validateRelations(dto);
    return this.toPublicProject(await this.projects.update(uuid, dto, userId));
  }
  remove(uuid: string, userId?: number) { return this.projects.remove(uuid, userId); }
  async restore(uuid: string) { return this.toPublicProject(await this.projects.restore(uuid)); }

  private toPublicProject(project: Project) {
    const data = project.toJSON() as unknown as Record<string, unknown>;
    delete data.id;
    return data;
  }

  private async validateRelations(dto: { projectType?: string | null; areaCategory?: string | null; projectManager?: string | null }) {
    if (dto.projectType) {
      const row = await this.projectTypes.findOne({ where: { uuid: dto.projectType } as WhereOptions<ProjectType> });
      if (!row) throw new NotFoundException(`Project type UUID "${dto.projectType}" not found`);
    }
    if (dto.areaCategory) {
      const row = await this.areas.findOne({ where: { uuid: dto.areaCategory } as WhereOptions<LeadArea> });
      if (!row) throw new NotFoundException(`CRM area UUID "${dto.areaCategory}" not found`);
    }
    if (dto.projectManager) {
      const row = await this.users.findOne({ where: { uuid: dto.projectManager, isActive: true } as WhereOptions<SysUser> });
      if (!row) throw new NotFoundException(`Active user UUID "${dto.projectManager}" not found`);
    }
  }
}
