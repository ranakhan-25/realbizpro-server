import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { LeadTeamMember } from 'src/database/models/crm/lead/crm-lead-team-member.model';
import { LeadTeam } from 'src/database/models/crm/lead/crm-lead-master-data.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateTeamDto } from './dto/create-team.dto';
import { QueryTeamDto } from './dto/query-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(LeadTeam) private readonly teams: typeof LeadTeam,
    @InjectModel(LeadTeamMember) private readonly members: typeof LeadTeamMember,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  async create(dto: CreateTeamDto) {
    return this.teams.sequelize!.transaction(async transaction => {
      await this.ensureActiveUsers([dto.leaderUuid, ...dto.memberUuids]);
      const team = await this.teams.create({
        name: dto.name.trim(), leaderId: dto.leaderUuid,
        createdBy: dto.createdBy, isActive: true,
      } as any, { transaction });
      await this.replaceMembers(team.id, dto.memberUuids, dto.createdBy, transaction);
      return this.findOne(team.uuid, transaction);
    });
  }

  async findAll(query: QueryTeamDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    const search = query.search?.trim();
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (query.leaderUuid) where.leaderId = query.leaderUuid;
    const { rows, count } = await this.teams.findAndCountAll({
      where, limit, offset: (page - 1) * limit, paranoid: !query.withDeleted,
      include: [{ association: 'members', required: false }],
      order: [['createdAt', 'DESC']], distinct: true,
    });
    return {
      data: await this.toPublicTeams(rows),
      meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 },
    };
  }

  async findOne(uuid: string, transaction?: Transaction) {
    const team = await this.teams.findOne({ where: { uuid }, transaction,
      include: [{ association: 'members', required: false }],
    });
    if (!team) throw new NotFoundException(`Team ${uuid} not found`);
    return (await this.toPublicTeams([team]))[0];
  }

  async update(uuid: string, dto: UpdateTeamDto) {
    return this.teams.sequelize!.transaction(async transaction => {
      const team = await this.getActive(uuid, transaction);
      if (dto.leaderUuid || dto.memberUuids) await this.ensureActiveUsers([...(dto.leaderUuid ? [dto.leaderUuid] : []), ...(dto.memberUuids ?? [])]);
      const { leaderUuid, memberUuids, ...fields } = dto;
      await team.update({ ...fields, ...(dto.name ? { name: dto.name.trim() } : {}), ...(leaderUuid ? { leaderId: leaderUuid } : {}) } as any, { transaction });
      if (memberUuids) await this.replaceMembers(team.id, memberUuids, dto.createdBy ?? team.createdBy, transaction);
      return this.findOne(uuid, transaction);
    });
  }

  async remove(uuid: string) {
    const team = await this.getActive(uuid);
    await team.destroy({ force: false });
    return { message: `Team ${uuid} deleted successfully` };
  }

  async restore(uuid: string) {
    const team = await this.teams.findOne({ where: { uuid }, paranoid: false });
    if (!team) throw new NotFoundException(`Team ${uuid} not found`);
    if (!team.deletedAt) throw new BadRequestException(`Team ${uuid} is not deleted`);
    await team.restore();
    return this.findOne(uuid);
  }

  async dropdown() {
    const teams = await this.teams.findAll({
      where: { isActive: true }, attributes: ['uuid', 'name', 'leaderId'],
      include: [{ association: 'members', attributes: ['uuid', 'userId'], required: false }],
      order: [['name', 'ASC']],
    });
    return this.toPublicTeams(teams);
  }

  async userDropdown() {
    return this.users.findAll({ where: { isActive: true }, attributes: ['uuid', 'name'], order: [['name', 'ASC']] });
  }

  private async getActive(uuid: string, transaction?: Transaction) {
    const team = await this.teams.findOne({ where: { uuid }, transaction });
    if (!team) throw new NotFoundException(`Team ${uuid} not found`);
    return team;
  }

  private async toPublicTeams(teams: LeadTeam[]) {
    const records = teams.map(team => team.toJSON() as Record<string, any>);
    const userIds = records.flatMap(record => [
      record.createdBy,
      record.leaderId,
      ...(Array.isArray(record.members) ? record.members.map((member: Record<string, any>) => member.userId) : []),
    ]).filter((id): id is string =>
      typeof id === 'string' &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id),
    );
    const users = await this.userMap(userIds);

    return records.map(data => {
      delete data.id;
      data.leaderUuid = typeof data.leaderId === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.leaderId)
        ? data.leaderId
        : null;
      data.leader = users.get(data.leaderUuid) ?? null;
      delete data.leaderId;
      data.created_at = data.created_at ?? data.createdAt;
      data.updated_at = data.updated_at ?? data.updatedAt;
      data.deleted_at = data.deleted_at ?? data.deletedAt ?? null;
      delete data.createdAt;
      delete data.updatedAt;
      delete data.deletedAt;
      data.created_by = data.createdBy ?? data.created_by ?? null;
      data.updated_by = data.updatedBy ?? data.updated_by ?? null;
      data.deleted_by = data.deletedBy ?? data.deleted_by ?? null;
      delete data.addedBy;
      delete data.createdBy;
      delete data.updatedBy;
      delete data.deletedBy;
      if (Array.isArray(data.members)) {
        data.members = data.members.map((member: Record<string, any>) => {
          delete member.id;
          delete member.teamId;
          member.userUuid = typeof member.userId === 'string' &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(member.userId)
            ? member.userId
            : null;
          member.user = users.get(member.userUuid) ?? null;
          delete member.userId;
          return member;
        });
      }
      return data;
    });
  }

  private async ensureActiveUsers(ids: string[]) {
    const uniqueIds = [...new Set(ids.filter(Boolean))];
    if (!uniqueIds.length) throw new BadRequestException('A team leader and at least one member are required');
    const found = await this.users.findAll({ where: { uuid: { [Op.in]: uniqueIds }, isActive: true }, attributes: ['uuid'] });
    if (found.length !== uniqueIds.length) throw new BadRequestException('One or more selected users are missing or inactive');
  }

  private async replaceMembers(teamId: number, ids: string[], createdBy: string | undefined, transaction: Transaction) {
    const uniqueIds = [...new Set(ids)];
    const existing = await this.members.findAll({ where: { teamId }, paranoid: false, transaction });
    const byUserId = new Map(existing.map(member => [member.userId, member]));
    for (const member of existing) {
      if (!uniqueIds.includes(member.userId) && !member.deletedAt) await member.destroy({ transaction });
    }
    for (const userId of uniqueIds) {
      const member = byUserId.get(userId);
      if (member?.deletedAt) await member.restore({ transaction });
      else if (!member) await this.members.create({ teamId, userId, isActive: true, createdBy } as any, { transaction });
    }
  }

  private async userMap(ids: Array<string | undefined>) {
    const uniqueIds = [...new Set(ids.filter((id): id is string => !!id))];
    if (!uniqueIds.length) return new Map<string, { uuid: string; name: string }>();
    const users = await this.users.findAll({ where: { uuid: { [Op.in]: uniqueIds } }, attributes: ['uuid', 'name'], paranoid: false });
    return new Map(users.map(user => [user.uuid, { uuid: user.uuid, name: user.name }]));
  }
}
