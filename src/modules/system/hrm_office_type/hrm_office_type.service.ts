import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { SlugHelper } from '@/common/helper/slug.helper';
import { QuerySysOfficeTypeDto } from './dto/query-sys-office-type.dto';
import {
  CreateSysOfficeTypeDto,
  StatusEnum,
} from './dto/create-hrm_office_type.dto';
import { UpdateSysOfficeTypeDto } from './dto/update-hrm_office_type.dto';
import { OfficeAccessScopeService } from '@/common/services/office-access-scope.service';

@Injectable()
export class SysOfficeTypeService {
  logger: any;

  constructor(
    private readonly officeAccessScopeService: OfficeAccessScopeService,
  ) {}

  async create(
    dto: CreateSysOfficeTypeDto,
    createdBy?: number,
  ) {
    let slug = dto.slug?.trim();

    if (!slug) {
      const initSlug =
        await this.generateSlugSuggestions(
          dto.name,
        );
      slug = initSlug.slug;
    }

    // Release slug from old soft-deleted rows so insert is not blocked.
    await this.releaseSlugFromDeletedRecords(
      slug,
    );

    try {
      const conflicts = await (
        this as any
      ).officeTypeModel.findAll({
        where: {
          [Op.or]: [{ name: dto.name }, { slug }],
        },
        attributes: ['id', 'name', 'slug'],
      });

      let nameExists = false;
      let slugExists = false;

      for (const item of conflicts) {
        if (item.name === dto.name)
          nameExists = true;
        if (item.slug === slug) slugExists = true;
      }

      if (nameExists && slugExists) {
        throw new BadRequestException(
          'Office type name and slug already exist',
        );
      }

      if (nameExists) {
        throw new BadRequestException(
          'Office type name already exists',
        );
      }

      if (slugExists) {
        throw new BadRequestException(
          'Office type slug already exists',
        );
      }

      return await (
        this as any
      ).officeTypeModel.create({
        name: dto.name,
        details: dto.details,
        slug,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? StatusEnum.ACTIVE,
        createdBy,
      });
    } catch (error: any) {
      console.log(
        'SYS OFFICE TYPE CREATE ERROR:',
        {
          dto,
          finalPayload: {
            name: dto.name,
            details: dto.details,
            slug,
            sortOrder: dto.sortOrder ?? 0,
            status:
              dto.status ?? StatusEnum.ACTIVE,
            createdBy,
          },
          name: error?.name,
          message: error?.message,
          errors: error?.errors?.map(
            (e: any) => ({
              message: e.message,
              path: e.path,
              value: e.value,
              type: e.type,
              validatorKey: e.validatorKey,
            }),
          ),
          parent: {
            code: error?.parent?.code,
            detail: error?.parent?.detail,
            constraint: error?.parent?.constraint,
            table: error?.parent?.table,
            column: error?.parent?.column,
            routine: error?.parent?.routine,
          },
          original: {
            code: error?.original?.code,
            detail: error?.original?.detail,
            constraint:
              error?.original?.constraint,
            table: error?.original?.table,
            column: error?.original?.column,
          },
        },
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error?.parent?.code === '23505') {
        throw new BadRequestException(
          error?.parent?.detail ||
            'Duplicate unique value',
        );
      }

      if (error?.parent?.code === '22P02') {
        throw new BadRequestException(
          error?.parent?.detail ||
            'Invalid enum value',
        );
      }

      throw new BadRequestException(
        error?.parent?.detail ||
          error?.errors?.[0]?.message ||
          error?.message ||
          'Office type create failed',
      );
    }
  }

  async update(
    uuid: string,
    dto: UpdateSysOfficeTypeDto,
    updatedBy?: number,
  ) {
    const officeType = await (
      this as any
    ).officeTypeModel.findOne({
      where: { uuid },
    });

    if (!officeType) {
      throw new NotFoundException(
        'Office type not found',
      );
    }

    const updateData: any = {
      ...dto,
      updatedBy,
    };

    if (dto.name && !dto.slug) {
      const initSlug =
        await this.generateSlugSuggestions(
          dto.name,
          officeType.id,
        );
      updateData.slug = initSlug.slug;
    } else if (dto.slug) {
      updateData.slug = dto.slug.trim();
    }

    if (updateData.slug) {
      await this.releaseSlugFromDeletedRecords(
        updateData.slug,
        officeType.id,
      );
    }

    if (dto.name || updateData.slug) {
      const existingOfficeType = await (
        this as any
      ).officeTypeModel.findOne({
        where: {
          id: { [Op.ne]: officeType.id },
          [Op.or]: [
            dto.name
              ? { name: dto.name }
              : undefined,
            updateData.slug
              ? { slug: updateData.slug }
              : undefined,
          ].filter(Boolean),
        },
      });

      if (existingOfficeType) {
        if (
          updateData.slug &&
          existingOfficeType.slug ===
            updateData.slug
        ) {
          throw new BadRequestException(
            `Office type slug '${updateData.slug}' already exists`,
          );
        }

        if (
          dto.name &&
          existingOfficeType.name === dto.name
        ) {
          throw new BadRequestException(
            `Office type name '${dto.name}' already exists`,
          );
        }

        throw new BadRequestException(
          'Office type with this name or slug already exists',
        );
      }
    }

    await officeType.update(updateData);

    return officeType;
  }

  async findAndCount(
    query: QuerySysOfficeTypeDto,
    user: any,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortOrder,
    } = query as any;

    const offset = (page - 1) * limit;

    const where: any = {};

    const scope =
      await this.officeAccessScopeService.getOfficeTypeScope(
        user,
      );

    if (!scope.isNational) {
      where.id = {
        [Op.in]: scope.officeTypeIds,
      };
    }

    if (status) where.status = status;

    if (sortOrder !== undefined) {
      where.sortOrder = sortOrder;
    }

    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          slug: {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          details: {
            [Op.iLike]: `%${search}%`,
          },
        },
      ];
    }

    return (
      this as any
    ).officeTypeModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'DESC'],
      ],
      include: [
        {
          association: 'createdByUser',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'uuid',
          ],
          required: false,
        },
        {
          association: 'updatedByUser',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'uuid',
          ],
          required: false,
        },
      ],
    });
  }

  findOne(uuid: string) {
    return (this as any).officeTypeModel.findOne({
      where: { uuid },
      include: [
        {
          association: 'createdByUser',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'uuid',
          ],
          required: false,
        },
        {
          association: 'updatedByUser',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'uuid',
          ],
          required: false,
        },
        {
          association: 'deletedByUser',
          attributes: [
            'id',
            'firstName',
            'lastName',
            'uuid',
          ],
          required: false,
        },
      ],
    });
  }

  async remove(uuid: string, deletedBy?: number) {
    const officeType = await (
      this as any
    ).officeTypeModel.findOne({
      where: { uuid },
    });

    if (!officeType) {
      throw new NotFoundException(
        'Office type not found',
      );
    }

    await officeType.update({
      deletedBy,
      slug: this.buildArchivedSlug(
        officeType.slug,
        officeType.id,
      ),
    });

    await officeType.destroy();
  }

  async dropdown(
    status?: StatusEnum,
    user?: any,
  ) {
    const where: any = {
      status: status || StatusEnum.ACTIVE,
    };

    const scope =
      await this.officeAccessScopeService.getOfficeTypeScope(
        user,
      );

    if (!scope.isNational) {
      where.id = {
        [Op.in]: scope.officeTypeIds,
      };
    }

    return (this as any).officeTypeModel.findAll({
      where,
      attributes: ['id', 'uuid', 'name', 'slug'],
      order: [
        ['sortOrder', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  async slugExists(
    slug: string,
    excludeId?: number,
  ): Promise<boolean> {
    try {
      const where: any = { slug };

      if (excludeId) {
        where.id = { [Op.ne]: excludeId };
      }

      const count = await (
        this as any
      ).officeTypeModel.count({
        where,
      });

      return count > 0;
    } catch (error: any) {
      this.logger?.error?.(
        `Failed to check office type slug: ${error.message}`,
      );
      return false;
    }
  }

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
      (this as any).officeTypeModel,
      'slug',
      excludeId,
    );
  }

  private buildArchivedSlug(
    slug: string,
    id: number,
  ): string {
    const suffix = `-deleted-${id}`;
    const maxBaseLength = Math.max(
      1,
      255 - suffix.length,
    );
    const base = slug.slice(0, maxBaseLength);
    return `${base}${suffix}`;
  }

  private async releaseSlugFromDeletedRecords(
    slug: string,
    excludeId?: number,
  ) {
    const where: any = {
      slug,
      deletedAt: { [Op.not]: null },
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const deletedConflicts = await (
      this as any
    ).officeTypeModel.findAll({
      where,
      paranoid: false,
      attributes: ['id', 'slug'],
    });

    for (const item of deletedConflicts) {
      const archivedSlug = this.buildArchivedSlug(
        item.slug,
        item.id,
      );

      if (archivedSlug === item.slug) continue;

      await (this as any).officeTypeModel.update(
        { slug: archivedSlug },
        {
          where: { id: item.id },
          paranoid: false,
        },
      );
    }
  }
}
