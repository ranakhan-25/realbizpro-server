import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { CrmParty, CrmPartyStatus } from 'src/database/models/crm/lead/crm-party.model';
import { CrmPartyAssignment } from 'src/database/models/crm/lead/crm-party-assignment.model';
import { CrmPartyCommunication } from 'src/database/models/crm/lead/crm-party-communication.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { AssignCrmPartyDto } from './dto/assign-crm-party.dto';
import { CreateCrmPartyCommunicationDto } from './dto/create-crm-party-communication.dto';
import { CreateCrmPartyDto } from './dto/create-crm-party.dto';
import { QueryCrmPartyDto } from './dto/query-crm-party.dto';
import { UpdateCrmPartyDto } from './dto/update-crm-party.dto';

const userAttributes = ['uuid', 'firstName', 'lastName', 'username'] as const;

@Injectable()
export class CrmPartiesService {
  constructor(
    @InjectModel(CrmParty) private readonly parties: typeof CrmParty,
    @InjectModel(CrmPartyAssignment) private readonly assignments: typeof CrmPartyAssignment,
    @InjectModel(CrmPartyCommunication) private readonly communications: typeof CrmPartyCommunication,
    @InjectModel(SysUser) private readonly users: typeof SysUser,
  ) {}

  dropdowns() {
    return {
      partyTypes: ['Customer', 'Investor', 'Other'],
      statuses: Object.values(CrmPartyStatus),
    };
  }

  async assigneeDropdown() {
    const rows = await this.users.findAll({ where: { isActive: true } as any, attributes: [...userAttributes], order: [['firstName', 'ASC'], ['lastName', 'ASC']] });
    return rows.map(user => ({ uuid: user.uuid, name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || user.uuid, username: user.username }));
  }

  async findAll(query: QueryCrmPartyDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (query.partyType) where.partyType = query.partyType;
    if (query.status) where.status = query.status;
    const search = query.search?.trim();
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { phone: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
      { nidNumber: { [Op.iLike]: `%${search}%` } },
    ];
    const { rows, count } = await this.parties.findAndCountAll({
      where,
      include: [{ association: 'assignee', attributes: [...userAttributes], required: false }],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });
    return { data: rows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async create(dto: CreateCrmPartyDto, actorUuid?: string) {
    return this.parties.create({ ...dto, status: dto.status ?? CrmPartyStatus.ACTIVE, createdByUuid: actorUuid } as any);
  }

  async findOne(uuid: string) {
    const party = await this.parties.findOne({
      where: { uuid },
      include: [
        { association: 'assignee', attributes: [...userAttributes], required: false },
        { association: 'assignments', include: [{ association: 'assignee', attributes: [...userAttributes] }, { association: 'assignedBy', attributes: [...userAttributes] }], required: false },
        { association: 'communications', include: [{ association: 'loggedBy', attributes: [...userAttributes] }], required: false },
      ],
      order: [[{ model: CrmPartyAssignment, as: 'assignments' }, 'createdAt', 'DESC'], [{ model: CrmPartyCommunication, as: 'communications' }, 'occurredAt', 'DESC']],
    });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    return party;
  }

  async update(uuid: string, dto: UpdateCrmPartyDto, actorUuid?: string) {
    const party = await this.getParty(uuid);
    await party.update({ ...dto, updatedByUuid: actorUuid });
    return this.findOne(uuid);
  }

  async remove(uuid: string, actorUuid?: string) {
    const party = await this.getParty(uuid);
    await party.update({ deletedByUuid: actorUuid });
    await party.destroy();
    return { message: `CRM party ${uuid} soft-deleted successfully` };
  }

  async restore(uuid: string) {
    const party = await this.parties.findOne({ where: { uuid }, paranoid: false });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    if (!party.deletedAt) throw new BadRequestException(`CRM party ${uuid} is not deleted`);
    await party.restore();
    await party.update({ deletedByUuid: null });
    return this.findOne(uuid);
  }

  async assign(uuid: string, dto: AssignCrmPartyDto, actorUuid?: string) {
    const party = await this.getParty(uuid);
    const assignee = await this.users.findOne({ where: { uuid: dto.assigneeUuid, isActive: true } as any });
    if (!assignee) throw new NotFoundException(`Active user ${dto.assigneeUuid} not found`);
    const transaction = await this.parties.sequelize!.transaction();
    try {
      await this.assignments.create({ partyUuid: party.uuid, assigneeUuid: assignee.uuid, assignedByUuid: actorUuid, note: dto.note } as any, { transaction });
      await party.update({ assignedToUuid: assignee.uuid, updatedByUuid: actorUuid }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return this.findOne(uuid);
  }

  async findAssignments(uuid: string) {
    await this.getParty(uuid);
    return this.assignments.findAll({ where: { partyUuid: uuid }, include: [{ association: 'assignee', attributes: [...userAttributes] }, { association: 'assignedBy', attributes: [...userAttributes] }], order: [['createdAt', 'DESC']] });
  }

  async logCommunication(uuid: string, dto: CreateCrmPartyCommunicationDto, actorUuid?: string) {
    const party = await this.getParty(uuid);
    const event = await this.communications.create({ partyUuid: party.uuid, ...dto, loggedByUuid: actorUuid } as any);
    return this.communications.findByPk(event.id, { include: [{ association: 'party' }, { association: 'loggedBy', attributes: [...userAttributes] }] });
  }

  async findCommunications(uuid: string) {
    await this.getParty(uuid);
    return this.communications.findAll({ where: { partyUuid: uuid }, include: [{ association: 'loggedBy', attributes: [...userAttributes] }], order: [['occurredAt', 'DESC']] });
  }

  private async getParty(uuid: string, transaction?: Transaction) {
    const party = await this.parties.findOne({ where: { uuid }, transaction });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    return party;
  }
}
