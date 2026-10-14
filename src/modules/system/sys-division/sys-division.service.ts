import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SysDivision } from '@/database/models/system/sys_divisions.model';

// division.includes.ts
export const DIVISION_DETAIL_INCLUDES = [
  {
    association: 'districts',
    include: [
      {
        association: 'upazilas',
      },
    ],
  },
];

@Injectable()
export class DivisionService {
  private readonly logger = new Logger(
    DivisionService.name,
  );

  constructor(
    @InjectModel(SysDivision)
    private readonly divisionModel: typeof SysDivision,
  ) {}

  // =========================
  // 1. GET ALL (with District + Upazila)
  // =========================

  async findAndCount(query?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<[SysDivision[], number]> {
    try {
      // ===========================
      // Pagination
      // ===========================
      const page = Number(query?.page) || 1;
      const limit = Number(query?.limit) || 10;
      const offset = (page - 1) * limit;

      // ===========================
      // Search
      // ===========================
      const where: any = {};

      if (query?.search) {
        const term = query.search.trim();
        where[Op.or] = [
          { name: { [Op.iLike]: `%${term}%` } },
          { bnName: { [Op.iLike]: `%${term}%` } },
        ];
      }

      // ===========================
      // Query (Nested + Limited fields)
      // ===========================
      const { rows, count } =
        await this.divisionModel.findAndCountAll({
          where,
          limit,
          offset,
          distinct: true,
          order: [['id', 'ASC']],
          include: [
            {
              association: 'districts',
              required: false,
              attributes: [
                'id',
                'name',
                'bnName',
                'url',
              ],
              include: [
                {
                  association: 'upazilas',
                  required: false,
                  attributes: [
                    'id',
                    'name',
                    'bnName',
                    'url',
                  ],
                  include: [
                    {
                      association: 'unions',
                      required: false,
                      attributes: [
                        'id',
                        'name',
                        'bnName',
                        'url',
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });

      return [rows, count];
    } catch (error) {
      console.error(
        'Division nested findAndCount error:',
        error,
      );
      throw error;
    }
  }

  // =========================
  // 2. FIND ONE (with District + Upazila)
  // =========================
  async findOneByUuid(uuid: string) {
    const division =
      await this.divisionModel.findOne({
        where: { uuid },
        include: [
          {
            association: 'districts',
            include: [
              {
                association: 'upazilas',
                include: [
                  { association: 'unions' },
                ],
              },
            ],
          },
        ],
      });

    if (!division) {
      throw new NotFoundException(
        'Division not found',
      );
    }

    return division;
  }
}
