import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PaginateParams } from 'src/common/decorators/paginate.decorator';
import { SysModules } from 'src/database/models/system/sys_module.model';
import { SysUser } from 'src/database/models/system/sys_user.model';
import { CreateModuleUserDto } from './dto/create-module-user.dto';
import { UpdateModuleUserDto } from './dto/update-module-user.dto';
import { SysModuleToUser } from '../../database/models/system/sys_module_to_user.model';

@Injectable()
export class ModuleUserService {
  constructor(
    @InjectModel(SysUser)
    private readonly userModel: typeof SysUser,
    @InjectModel(SysModules)
    private readonly moduleModel: typeof SysModules,
    @InjectModel(SysModuleToUser)
    private readonly moduleToUserModel: typeof SysModuleToUser,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Assigns a set of modules to a user, replacing any existing assignments.
   */
  async assignModulesToUser(
    dto: CreateModuleUserDto,
  ): Promise<{
    message: string;
    assignedCount: number;
  }> {
    const { userId, moduleIds } = dto;

    // 1. Validate that the user exists
    const user = await this.userModel.findByPk(
      userId,
      { attributes: ['id'] },
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found.`,
      );
    }

    // 2. Validate that all provided module IDs exist
    if (moduleIds.length > 0) {
      const foundModules =
        await this.moduleModel.count({
          where: { id: moduleIds },
        });
      if (foundModules !== moduleIds.length) {
        throw new BadRequestException(
          'One or more module IDs are invalid.',
        );
      }
    }

    // 3. Use a transaction to ensure atomicity
    try {
      await this.sequelize.transaction(
        async (transaction) => {
          // Step A: Remove all existing module assignments for this user
          await this.moduleToUserModel.destroy({
            where: { userId },
            transaction,
          });

          // Step B: If new modules are provided, bulk create the new assignments
          if (moduleIds.length > 0) {
            const newAssignments = moduleIds.map(
              (moduleId) => ({
                userId,
                moduleId,
              }),
            );
            await this.moduleToUserModel.bulkCreate(
              newAssignments,
              {
                transaction,
              },
            );
          }
        },
      );

      return {
        message: `Successfully assigned ${moduleIds.length} modules to user ID ${userId}.`,
        assignedCount: moduleIds.length,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to assign modules to user.',
        error.message,
      );
    }
  }

  /**
   * Finds all users with pagination and includes their assigned modules.
   */
  async findAndCountAll({
    skip,
    limit,
    search,
  }: PaginateParams): Promise<
    [SysUser[], number]
  > {
    const whereClause = search
      ? {
          [Op.or]: [
            {
              firstName: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              lastName: {
                [Op.like]: `%${search}%`,
              },
            },
            {
              email: { [Op.like]: `%${search}%` },
            },
          ],
        }
      : {};

    const { rows, count } =
      await this.userModel.findAndCountAll({
        where: whereClause,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
        ],
        include: [
          {
            association: 'modules',
            attributes: ['id', 'name'],
            through: { attributes: [] }, // Exclude junction table attributes
          },
        ],
        order: [['id', 'ASC']],
        offset: skip,
        limit: limit,
        distinct: true, // Important for correct count with includes
      });

    return [rows, count];
  }

  /**
   * Finds a single user and their assigned modules by user ID.
   */
  async findModulesForUser(userId: number) {
    const user = await this.userModel.findByPk(
      userId,
      {
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
        ],
        include: [
          {
            association: 'modules',
            attributes: [
              'id',
              'name',
              'description',
            ],
          },
        ],
      },
    );

    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found.`,
      );
    }

    return user;
  }

  //find by user only module ids
  async findModuleIdsForUser(
    userId: number,
  ): Promise<number[]> {
    const assignments =
      await this.moduleToUserModel.findAll({
        where: { userId },
        attributes: ['moduleId'],
      });
    return assignments.map(
      (assignment) => assignment.moduleId,
    );
  }

  /**
   * Updates a user's module assignments. This is an alias for assignModulesToUser.
   */
  async update(
    updateDto: UpdateModuleUserDto,
  ): Promise<{
    message: string;
    assignedCount: number;
  }> {
    return this.assignModulesToUser(updateDto);
  }

  /**
   * Removes all module assignments from a specific user.
   */
  async removeAllModulesFromUser(
    userId: number,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findByPk(
      userId,
      { attributes: ['id'] },
    );
    if (!user) {
      throw new NotFoundException(
        `User with ID ${userId} not found.`,
      );
    }

    await this.moduleToUserModel.destroy({
      where: { userId },
    });

    return {
      message: `All modules removed from user ID ${userId}.`,
    };
  }
}
