import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Party, PartyBusinessType, PartyStatus, PartyType } from 'src/database/models/procurement/parties/party.model';
import { PartyDocument } from 'src/database/models/procurement/parties/party-document.model';
import { CreatePartyDto, PartyQueryDto, UpdatePartyDto } from './dto/party.dto';

@Injectable()
export class PartyService {
  constructor(@InjectModel(Party) private readonly parties: typeof Party, @InjectModel(PartyDocument) private readonly documents: typeof PartyDocument) {}

  async create(dto: CreatePartyDto) {
    const { documents = [], ...data } = dto;
    const transaction = await this.parties.sequelize!.transaction();
    try {
      const code = await this.nextCode(transaction);
      const party = await this.parties.create({ ...data, code, status: data.status ?? PartyStatus.ACTIVE }, { transaction });
      if (documents.length) await this.documents.bulkCreate(documents.map((doc) => ({ ...doc, partyId: party.uuid })), { transaction });
      await transaction.commit();
      return this.findOne(party.uuid);
    } catch (error) { await transaction.rollback(); throw error; }
  }

  async findAll(query: PartyQueryDto) {
    const page = Math.max(1, Number(query.page) || 1); const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const where: any = {};
    if ((query as any)?.orgId) where.orgId = (query as any).orgId;
    if ((query as any)?.projectId) where.projectId = (query as any).projectId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.startDate || query.endDate) where.createdAt = { ...(query.startDate ? { [Op.gte]: new Date(query.startDate) } : {}), ...(query.endDate ? { [Op.lte]: new Date(`${query.endDate}T23:59:59.999Z`) } : {}) };
    if (query.search) where[Op.or] = ['code', 'name', 'phone', 'tradeLicenseNo', 'nidNo'].map((field) => ({ [field]: { [Op.iLike]: `%${query.search}%` } }));
    const result = await this.parties.findAndCountAll({ where, include: [{ association: 'documents', required: false }], limit, offset: (page - 1) * limit, order: [['createdAt', query.sortOrder ?? 'DESC']], distinct: true });
    return { data: result.rows, meta: { page, limit, total: result.count, totalPages: Math.ceil(result.count / limit) } };
  }

  async findOne(uuid: string, includeDeleted = false) {
    const party = await this.parties.findOne({ where: { uuid }, paranoid: !includeDeleted, include: [{ association: 'documents', required: false, paranoid: !includeDeleted }] });
    if (!party) throw new NotFoundException(`Party ${uuid} not found`);
    return party;
  }

  async update(uuid: string, dto: UpdatePartyDto) {
    const party = await this.findOne(uuid); const { documents, ...data } = dto;
    const transaction = await this.parties.sequelize!.transaction();
    try {
      await party.update(data, { transaction });
      if (documents) {
        await this.documents.destroy({ where: { partyId: uuid }, transaction });
        if (documents.length) await this.documents.bulkCreate(documents.map((doc) => ({ ...doc, partyId: uuid })), { transaction });
      }
      await transaction.commit(); return this.findOne(uuid);
    } catch (error) { await transaction.rollback(); throw error; }
  }

  async remove(uuid: string) { const party = await this.findOne(uuid); await party.destroy(); return { message: 'Party deleted', uuid }; }
  async restore(uuid: string) { const party = await this.findOne(uuid, true); if (!party.deletedAt) throw new BadRequestException('Party is not deleted'); await party.restore(); return this.findOne(uuid); }
  async dropdowns() {
    const [groups, accounts] = await Promise.all([
      this.parties.findAll({ attributes: ['accountingGroup'], where: { accountingGroup: { [Op.ne]: null } }, group: ['accountingGroup'], order: [['accountingGroup', 'ASC']] }),
      this.parties.findAll({ attributes: ['payableAccount'], where: { payableAccount: { [Op.ne]: null } }, group: ['payableAccount'], order: [['payableAccount', 'ASC']] }),
    ]);
    return {
      types: Object.values(PartyType),
      businessTypes: Object.values(PartyBusinessType),
      statuses: Object.values(PartyStatus),
      accountingGroups: groups.map((row) => row.accountingGroup).filter(Boolean),
      payableAccounts: accounts.map((row) => row.payableAccount).filter(Boolean),
    };
  }

  private async nextCode(transaction: any) {
    const prefix = `P-${new Date().getFullYear()}`;
    const latest = await this.parties.findOne({ where: { code: { [Op.like]: `${prefix}%` } }, order: [['createdAt', 'DESC']], transaction, paranoid: false });
    const sequence = latest ? Number(latest.code.slice(prefix.length)) + 1 : 1;
    return `${prefix}${String(sequence).padStart(5, '0')}`;
  }
}
