import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';

import { Op } from 'sequelize';

import { CreateZkTecoDeviceDto } from './dto/create-zkteco-device.dto';
import { UpdateZkTecoDeviceDto } from './dto/update-zkteco-device.dto';
import { QueryZkTecoDeviceDto } from './dto/query-zkteco-device.dto';
import {
  ZkTecoDevice,
  ZkTecoDeviceStatus,
  ZkTecoDeviceType,
} from 'src/database/models/hrm/configuration/zkteco_device_model';

@Injectable()
export class ZkTecoDeviceService {
  constructor(
    @InjectModel(ZkTecoDevice)
    private readonly zkTecoDeviceModel: typeof ZkTecoDevice,
  ) {}

  // Real IP → ip + port required, ADMS → ip/port null
  private resolveConnection(
    type: ZkTecoDeviceType,
    ip?: string | null,
    port?: string | null,
  ) {
    if (type === ZkTecoDeviceType.REAL_IP) {
      if (!ip || !port) {
        throw new BadRequestException(
          'IP and port are required for Real IP device',
        );
      }

      const portNo = Number(port);
      if (portNo < 1 || portNo > 65535) {
        throw new BadRequestException(
          'Port must be between 1 and 65535',
        );
      }

      return { ip, port };
    }

    return { ip: null, port: null };
  }

  async create(
    dto: CreateZkTecoDeviceDto,
  ): Promise<ZkTecoDevice> {
    const connection = this.resolveConnection(
      dto.type,
      dto.ip,
      dto.port,
    );

    const record =
      await this.zkTecoDeviceModel.create({
        ...dto,
        ...connection,
        createdBy: dto.createdBy ?? dto.addedById,
        status:
          dto.status ?? ZkTecoDeviceStatus.ACTIVE,
      } as any);

    return this.findOne(record.uuid);
  }

  async findAll(query: QueryZkTecoDeviceDto) {
    const {
      page = 1,
      limit = 10,
      skip,
      search,
      status,
      type,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      withDeleted = false,
    } = query;

    const offset =
      skip !== undefined && skip !== null
        ? skip
        : (page - 1) * limit;

    const where: any = {};
    if (query.orgId) {
      where.orgId = query.orgId;
    }
    if ((query as any).projectId) {
      where.projectId = (query as any).projectId;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { sn: { [Op.iLike]: `%${search}%` } },
        { ip: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const { rows, count } =
      await this.zkTecoDeviceModel.findAndCountAll(
        {
          where,
          limit,
          offset,
          order: [[sortBy, sortOrder]],
          paranoid: !withDeleted,
        },
      );

    const totalPages =
      Math.ceil(count / limit) || 1;
    const currentPage =
      skip !== undefined && skip !== null
        ? Math.floor(skip / limit) + 1
        : page;

    const nextPage =
      currentPage < totalPages
        ? currentPage + 1
        : null;

    const previousPage =
      currentPage > 1 ? currentPage - 1 : null;

    return {
      data: rows,
      meta: {
        page: currentPage,
        pageNo: currentPage,
        nextPage,
        previousPage,
        limit,
        skip: offset,
        total: count,
        totalPages,
      },
    };
  }

  async findOne(
    uuid: string,
  ): Promise<ZkTecoDevice> {
    const record =
      await this.zkTecoDeviceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `ZkTeco device #${uuid} not found`,
      );
    }

    return record;
  }

  async update(
    uuid: string,
    dto: UpdateZkTecoDeviceDto,
  ): Promise<ZkTecoDevice> {
    const record =
      await this.zkTecoDeviceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `ZkTeco device #${uuid} not found`,
      );
    }

    const type = dto.type ?? record.type;
    const connection = this.resolveConnection(
      type,
      dto.ip !== undefined ? dto.ip : record.ip,
      dto.port !== undefined
        ? dto.port
        : record.port,
    );

    await record.update({
      ...dto,
      ...connection,
      updatedBy:
        dto.addedById ?? record.updatedBy,
    } as any);

    return this.findOne(uuid);
  }

  async remove(
    uuid: string,
  ): Promise<{ message: string }> {
    const record =
      await this.zkTecoDeviceModel.findOne({
        where: { uuid } as any,
      });

    if (!record) {
      throw new NotFoundException(
        `ZkTeco device #${uuid} not found`,
      );
    }

    // status → inactive + soft delete
    await record.update({
      status: ZkTecoDeviceStatus.INACTIVE,
    });

    await record.destroy();

    return {
      message: `ZkTeco device #${uuid} deleted successfully`,
    };
  }

  async restore(
    uuid: string,
  ): Promise<ZkTecoDevice> {
    const record =
      await this.zkTecoDeviceModel.findOne({
        where: { uuid } as any,
        paranoid: false,
      });

    if (!record) {
      throw new NotFoundException(
        `ZkTeco device #${uuid} not found`,
      );
    }

    if (!record.deletedAt) {
      throw new BadRequestException(
        `ZkTeco device #${uuid} is not deleted`,
      );
    }

    // status → active + restore
    await record.restore();
    await record.update({
      status: ZkTecoDeviceStatus.ACTIVE,
    });

    return this.findOne(uuid);
  }
}
