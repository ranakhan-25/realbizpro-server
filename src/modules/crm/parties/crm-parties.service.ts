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

  async findAll(query: QueryCrmPartyDto, currentUser?: any) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where: any = {};
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
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
    const mappedRows = rows.map(r => this.toPublic(r));
    return { data: mappedRows, meta: { page, limit, total: count, totalPages: Math.ceil(count / limit) || 1 } };
  }

  async create(dto: CreateCrmPartyDto, userId?: number, currentUser?: any) {
    const orgId = dto.orgId ?? currentUser?.orgId ?? null;
    const actor = userId ? String(userId) : null;
    const party = await this.parties.create({
      ...dto,
      status: dto.status ?? CrmPartyStatus.ACTIVE,
      orgId,
      createdBy: actor,
      createdByUuid: currentUser?.uuid ?? null,
    } as any);
    return this.findOne(party.uuid, currentUser);
  }

  async findOne(uuid: string, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const party = await this.parties.findOne({
      where,
      include: [
        { association: 'assignee', attributes: [...userAttributes], required: false },
        { association: 'assignments', include: [{ association: 'assignee', attributes: [...userAttributes] }, { association: 'assignedBy', attributes: [...userAttributes] }], required: false },
        { association: 'communications', include: [{ association: 'loggedBy', attributes: [...userAttributes] }], required: false },
      ],
      order: [[{ model: CrmPartyAssignment, as: 'assignments' }, 'createdAt', 'DESC'], [{ model: CrmPartyCommunication, as: 'communications' }, 'occurredAt', 'DESC']],
    });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    return this.toPublic(party);
  }

  async update(uuid: string, dto: UpdateCrmPartyDto, userId?: number, currentUser?: any) {
    const party = await this.getParty(uuid, currentUser);
    const actor = userId ? String(userId) : null;
    await party.update({
      ...dto,
      ...(userId ? { updatedBy: actor } : {}),
      ...(currentUser?.uuid ? { updatedByUuid: currentUser.uuid } : {}),
    } as any);
    return this.findOne(uuid, currentUser);
  }

  async remove(uuid: string, userId?: number, currentUser?: any) {
    const party = await this.getParty(uuid, currentUser);
    const actor = userId ? String(userId) : null;
    await party.update({
      ...(userId ? { deletedBy: actor } : {}),
      ...(currentUser?.uuid ? { deletedByUuid: currentUser.uuid } : {}),
    } as any);
    await party.destroy();
    return { message: `CRM party ${uuid} soft-deleted successfully` };
  }

  async restore(uuid: string, userId?: number, currentUser?: any) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const party = await this.parties.findOne({ where, paranoid: false });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    if (!party.deletedAt) throw new BadRequestException(`CRM party ${uuid} is not deleted`);
    await party.restore();
    const actor = userId ? String(userId) : null;
    await party.update({
      deletedByUuid: null,
      deletedBy: null,
      ...(userId ? { updatedBy: actor } : {}),
    } as any);
    return this.findOne(uuid, currentUser);
  }

  async assign(uuid: string, dto: AssignCrmPartyDto, userId?: number, currentUser?: any) {
    const party = await this.getParty(uuid, currentUser);
    const assignee = await this.users.findOne({ where: { uuid: dto.assigneeUuid, isActive: true } as any });
    if (!assignee) throw new NotFoundException(`Active user ${dto.assigneeUuid} not found`);
    const actor = userId ? String(userId) : null;
    const actorUuid = currentUser?.uuid ?? null;
    const orgId = party.orgId ?? currentUser?.orgId ?? null;
    const transaction = await this.parties.sequelize!.transaction();
    try {
      await this.assignments.create({
        partyUuid: party.uuid,
        assigneeUuid: assignee.uuid,
        assignedByUuid: actorUuid,
        note: dto.note,
        orgId,
        createdBy: actor,
      } as any, { transaction });
      await party.update({
        assignedToUuid: assignee.uuid,
        updatedByUuid: actorUuid,
        updatedBy: actor,
      } as any, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return this.findOne(uuid, currentUser);
  }

  async findAssignments(uuid: string, currentUser?: any) {
    await this.getParty(uuid, currentUser);
    return this.assignments.findAll({ where: { partyUuid: uuid }, include: [{ association: 'assignee', attributes: [...userAttributes] }, { association: 'assignedBy', attributes: [...userAttributes] }], order: [['createdAt', 'DESC']] });
  }

  async logCommunication(uuid: string, dto: CreateCrmPartyCommunicationDto, userId?: number, currentUser?: any) {
    const party = await this.getParty(uuid, currentUser);
    const actor = userId ? String(userId) : null;
    const actorUuid = currentUser?.uuid ?? null;
    const orgId = party.orgId ?? currentUser?.orgId ?? null;
    const event = await this.communications.create({
      partyUuid: party.uuid,
      ...dto,
      loggedByUuid: actorUuid,
      orgId,
      createdBy: actor,
    } as any);
    return this.communications.findByPk(event.id, { include: [{ association: 'party' }, { association: 'loggedBy', attributes: [...userAttributes] }] });
  }

  async findCommunications(uuid: string, currentUser?: any) {
    await this.getParty(uuid, currentUser);
    return this.communications.findAll({ where: { partyUuid: uuid }, include: [{ association: 'loggedBy', attributes: [...userAttributes] }], order: [['occurredAt', 'DESC']] });
  }

  private async getParty(uuid: string, currentUser?: any, transaction?: Transaction) {
    const where: any = { uuid };
    if (currentUser?.orgId) {
      where.orgId = currentUser.orgId;
    }
    const party = await this.parties.findOne({ where, transaction });
    if (!party) throw new NotFoundException(`CRM party ${uuid} not found`);
    return party;
  }

  private toPublic(party: CrmParty) {
    const item = party.toJSON() as any;
    item.created_at = item.created_at ?? item.createdAt;
    item.updated_at = item.updated_at ?? item.updatedAt;
    item.deleted_at = item.deleted_at ?? item.deletedAt ?? null;
    delete item.createdAt;
    delete item.updatedAt;
    delete item.deletedAt;
    item.orgId = item.org_id ?? item.orgId ?? null;
    item.org_id = item.org_id ?? item.orgId ?? null;
    item.created_by = item.created_by ?? item.createdBy ?? item.createdByUuid ?? null;
    item.updated_by = item.updated_by ?? item.updatedBy ?? item.updatedByUuid ?? null;
    item.deleted_by = item.deleted_by ?? item.deletedBy ?? item.deletedByUuid ?? null;
    return item;
  }
}
