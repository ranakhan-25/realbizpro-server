import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { CreateSysOfficeDto } from './dto/create-sys-office.dto';
import { UpdateSysOfficeDto } from './dto/update-sys-office.dto';
import { QuerySysOfficeDto } from './dto/query-sys-office.dto';
import { SlugHelper } from '../../../common/helper/slug.helper';
import { OfficeAccessScopeService } from '@/common/services/office-access-scope.service';
import { OfficeDropdownQueryDto } from './dto/query-office-type.dto';

@Injectable()
export class SysOfficeService {
  logger: any;
  constructor(
    private readonly officeAccessScopeService: OfficeAccessScopeService,
  ) {}

  private async applyReadScope(
    user?: any,
    where: any = {},
  ) {
    if (!user?.id) {
      throw new BadRequestException(
        'Invalid user',
      );
    }

    const scope =
      await this.officeAccessScopeService.getOfficeScope(
        user,
      );

    if (scope.isNational) {
      return where;
    }

    return {
      ...where,
      id: {
        [Op.in]: scope.officeIds,
      },
    };
  }

  async create(
    dto: CreateSysOfficeDto,
    createdBy?: number,
  ) {
    let {
      name,
      officeType,
      factoryId,
      showroomId,
    } = dto;

    /* ---------------- TYPE BASED VALIDATION ---------------- */

    if (
      String(officeType).toUpperCase() ===
      'FACTORY'
    ) {
      if (!factoryId)
        throw new BadRequestException(
          'factoryId is required for FACTORY office type',
        );

      const factory = await (
        this as any
      ).factoryModel.findByPk(factoryId);
      if (!factory)
        throw new BadRequestException(
          'Invalid factoryId',
        );

      name = factory.name;
      showroomId = null;
    }

    if (
      String(officeType).toUpperCase() ===
      'SHOWROOM'
    ) {
      if (!showroomId)
        throw new BadRequestException(
          'showroomId is required for SHOWROOM office type',
        );

      const showroom = await (
        this as any
      ).showroomModel.findByPk(showroomId);

      if (!showroom)
        throw new BadRequestException(
          'Invalid showroomId',
        );

      name = showroom.name;
      factoryId = null;
    }

    if (
      String(officeType).toUpperCase() !==
        'FACTORY' &&
      String(officeType).toUpperCase() !==
        'SHOWROOM'
    ) {
      factoryId = null;
      showroomId = null;
    }

    /* ---------------- SLUG LOGIC ---------------- */

    let slug = dto.slug?.trim();

    if (!slug) {
      const initSlug =
        await this.generateSlugSuggestions(name);
      slug = initSlug.slug;
    }

    /* ---------------- DUPLICATE CHECK ---------------- */

    const existingName = await (
      this as any
    ).officeModel.findOne({
      where: {
        name: {
          [Op.iLike]: name.trim(),
        },
      },
      paranoid: true,
    });

    if (existingName) {
      throw new BadRequestException(
        `Office with name '${name.trim()}' already exists`,
      );
    }

    const existingSlug = await (
      this as any
    ).officeModel.findOne({
      where: {
        slug: {
          [Op.iLike]: slug.trim(),
        },
      },
      paranoid: true,
    });

    if (existingSlug) {
      throw new BadRequestException(
        `Office with slug '${slug.trim()}' already exists`,
      );
    }

    /* ---------------- CREATE ---------------- */

    return (this as any).officeModel.create({
      ...dto,
      name,
      slug,
      factoryId,
      showroomId,
      createdBy,
    });
  }

  async update(
    uuid: string,
    dto: UpdateSysOfficeDto,
    updatedBy?: number,
    user?: any,
  ) {
    const office = await this.findOne(uuid, user);

    let {
      name = office.name,
      officeType = office.officeType,
      factoryId = office.factoryId,
      showroomId = office.showroomId,
    } = dto;

    /* ---------------- TYPE BASED VALIDATION ---------------- */

    if (
      String(officeType).toUpperCase() ===
      'FACTORY'
    ) {
      if (!factoryId)
        throw new BadRequestException(
          'factoryId is required for FACTORY office type',
        );

      const factory = await (
        this as any
      ).factoryModel.findByPk(factoryId);
      if (!factory)
        throw new BadRequestException(
          'Invalid factoryId',
        );

      name = factory.name;
      showroomId = null;
    }

    if (
      String(officeType).toUpperCase() ===
      'SHOWROOM'
    ) {
      if (!showroomId)
        throw new BadRequestException(
          'showroomId is required for SHOWROOM office type',
        );

      const showroom = await (
        this as any
      ).showroomModel.findByPk(showroomId);

      if (!showroom)
        throw new BadRequestException(
          'Invalid showroomId',
        );

      name = showroom.name;
      factoryId = null;
    }

    if (
      String(officeType).toUpperCase() !==
        'FACTORY' &&
      String(officeType).toUpperCase() !==
        'SHOWROOM'
    ) {
      factoryId = null;
      showroomId = null;
    }

    /* ---------------- SLUG LOGIC ---------------- */

    let slug = dto.slug?.trim() || office.slug;

    if (name !== office.name && !dto.slug) {
      const initSlug =
        await this.generateSlugSuggestions(
          name,
          office.id,
        );
      slug = initSlug.slug;
    }

    /* ---------------- DUPLICATE CHECK ---------------- */

    const existingNameUpdate = await (
      this as any
    ).officeModel.findOne({
      where: {
        id: { [Op.ne]: office.id },
        name: {
          [Op.iLike]: name.trim(),
        },
      },
      paranoid: true,
    });

    if (existingNameUpdate) {
      throw new BadRequestException(
        `Office with name '${name.trim()}' already exists`,
      );
    }

    const existingSlugUpdate = await (
      this as any
    ).officeModel.findOne({
      where: {
        id: { [Op.ne]: office.id },
        slug: {
          [Op.iLike]: slug.trim(),
        },
      },
      paranoid: true,
    });

    if (existingSlugUpdate) {
      throw new BadRequestException(
        `Office with slug '${slug.trim()}' already exists`,
      );
    }

    /* ---------------- UPDATE ---------------- */

    await office.update({
      ...dto,
      name,
      slug,
      factoryId,
      showroomId,
      updatedBy,
    });

    return office;
  }

  async findAndCount(
    query: QuerySysOfficeDto,
    user?: any,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      officeType,
      factoryId,
      showroomId,
    } = query;

    const offset = (page - 1) * limit;

    const where: any = {};

    // Basic Filters
    if (status) {
      where.status = status;
    }

    if (officeType) {
      where.officeType = officeType;
    }

    // Factory Filter
    if (factoryId) {
      where.factoryId = factoryId;
    }

    // Showroom Filter
    if (showroomId) {
      where.showroomId = showroomId;
    }

    // Search Filter
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const scopedWhere = await this.applyReadScope(
      user,
      where,
    );

    const { rows, count } = await (
      this as any
    ).officeModel.findAndCountAll({
      where: scopedWhere,
      offset,
      limit,
      order: [['id', 'DESC']],
      distinct: true,
      include: [
        {
          association: 'factory',
          attributes: [
            'id',
            'uuid',
            'name',
            'status',
          ],
          required: false,
          include: [
            {
              association: 'units',
              attributes: [
                'id',
                'uuid',
                'name',
                'status',
              ],
              required: false,
              include: [
                {
                  association: 'sections',
                  attributes: [
                    'id',
                    'uuid',
                    'name',
                    'status',
                  ],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          association: 'showroom',
          attributes: [
            'id',
            'uuid',
            'name',
            'code',
          ],
          required: false,
        },
      ],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findOne(uuid: string, user?: any) {
    const where = await this.applyReadScope(
      user,
      {
        uuid,
      },
    );

    const office = await (
      this as any
    ).officeModel.findOne({
      where,
      include: [
        {
          association: 'factory',
          attributes: [
            'id',
            'uuid',
            'name',
            'status',
          ],
          required: false,
          include: [
            {
              association: 'units',
              attributes: [
                'id',
                'uuid',
                'name',
                'status',
              ],
              required: false,
              include: [
                {
                  association: 'sections',
                  attributes: [
                    'id',
                    'uuid',
                    'name',
                    'status',
                  ],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          association: 'showroom',
          attributes: [
            'id',
            'uuid',
            'name',
            'code',
          ],
          required: false,
        },
      ],
    });

    if (!office) {
      throw new ForbiddenException(
        'You do not have permission to access this office',
      );
    }

    return office;
  }

  async remove(
    uuid: string,
    deletedBy?: number,
    user?: any,
  ) {
    const office = await this.findOne(uuid, user);

    await office.update({
      deletedBy,
      deletedAt: new Date(),
    });

    await office.destroy();
  }

  // DROPDOWN
  async dropdown(
    query: OfficeDropdownQueryDto,
    user?: any,
  ) {
    const {
      officeType,
      officeTypes,
      factoryId,
      showroomId,
    } = query;

    const where: any = {
      status: 'Active',
    };

    const officeTypeWhere: any = {};

    if (officeTypes?.length) {
      officeTypeWhere.name = {
        [Op.in]: officeTypes,
      };
    } else if (officeType) {
      officeTypeWhere.name = officeType;
    }

    if (factoryId) {
      where.factoryId = factoryId;
    }

    if (showroomId) {
      where.showroomId = showroomId;
    }

    const scopedWhere = await this.applyReadScope(
      user,
      where,
    );

    return (this as any).officeModel.findAll({
      where: scopedWhere,
      attributes: [
        'id',
        'uuid',
        'name',
        'officeType',
      ],
      order: [['name', 'ASC']],
      include: [
        {
          association: 'officeTypeData',
          attributes: ['id', 'name'],
          required:
            !!officeType || !!officeTypes?.length,
          ...(Object.keys(officeTypeWhere)
            .length && {
            where: officeTypeWhere,
          }),
        },
        {
          association: 'factory',
          attributes: ['id', 'name'],
          required: false,
          include: [
            {
              association: 'units',
              attributes: ['id', 'name'],
              required: false,
              include: [
                {
                  association: 'sections',
                  attributes: ['id', 'name'],
                  required: false,
                },
              ],
            },
          ],
        },
        {
          association: 'showroom',
          attributes: ['id', 'name', 'code'],
          required: false,
        },
      ],
    });
  }

  // 9. Check if slug exists
  async slugExists(
    slug: string,
    excludeId?: number,
  ): Promise<boolean> {
    try {
      const where: any = { slug };
      if (excludeId)
        where.id = { [Op.ne]: excludeId };

      const count = await (
        this as any
      ).officeModel.count({
        where,
      });
      return count > 0;
    } catch (error: any) {
      this.logger.error(
        `Failed to check section slug: ${error.message}`,
      );
      return false;
    }
  }

  // 10. Generate slug suggestions
  async generateSlugSuggestions(
    name: string,
    excludeId?: number,
  ): Promise<{
    slug: string;
    isUnique: boolean;
    suggestions: string[];
  }> {
    return await SlugHelper.generateUniqueSlug(
      name,
      (this as any).officeModel,
      'slug',
      excludeId,
    );
  }
}
