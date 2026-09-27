import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysMenu } from '../../database/models/system/sys_menu.model';
import { SysModules } from '../../database/models/system/sys_module.model';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponseDto } from './dto/response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(SysModules)
    private readonly menuModulesModel: typeof SysModules,
    @InjectModel(SysMenu)
    private readonly menuModel: typeof SysMenu,
  ) {}

  async create(
    dto: CreateModuleDto,
  ): Promise<ModuleResponseDto> {
    // Check for duplicate name
    const exists =
      await this.menuModulesModel.findOne({
        where: { name: dto.name },
      });
    if (exists)
      throw new ConflictException(
        'Module name already exists',
      );

    let module;
    try {
      module =
        await this.menuModulesModel.create(dto);
    } catch (error) {
      throw error;
    }
    return this.toResponseDto(module);
  }

  async findAll(): Promise<ModuleResponseDto[]> {
    const modules =
      await this.menuModulesModel.findAll({
        order: [['id', 'ASC']],
      });
    return modules.map((m) =>
      this.toResponseDto(m),
    );
  }

  async getDropdown(): Promise<
    Array<{
      id: number;
      name: string;
      description: string | null;
    }>
  > {
    const modules =
      await this.menuModulesModel.findAll({
        attributes: ['id', 'name', 'description'],
        order: [['name', 'ASC']],
      });

    return modules.map((module) => ({
      id: module.id,
      name: module.name,
      description: module.description,
    }));
  }

  async findOne(
    id: number,
  ): Promise<ModuleResponseDto> {
    const module =
      await this.menuModulesModel.findByPk(
        id,
        {},
      );
    if (!module)
      throw new NotFoundException(
        'Module not found',
      );
    // Recursively map children
    return this.toResponseDto(module, true);
  }

  async update(
    id: number,
    dto: UpdateModuleDto,
  ): Promise<ModuleResponseDto> {
    const module =
      await this.menuModulesModel.findByPk(id);
    if (!module)
      throw new NotFoundException(
        'Module not found',
      );

    // Check for duplicate name if updating name
    if (dto.name && dto.name !== module.name) {
      const exists =
        await this.menuModulesModel.findOne({
          where: { name: dto.name },
        });
      if (exists)
        throw new ConflictException(
          'Module name already exists',
        );
    }

    await module.update(dto);
    return this.toResponseDto(module);
  }

  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const module =
      await this.menuModulesModel.findByPk(id);
    if (!module)
      throw new NotFoundException(
        'Module not found',
      );

    // Check if any menu exists under this module
    const menuCount = await this.menuModel.count({
      where: { moduleId: id },
    });
    if (menuCount > 0) {
      throw new ConflictException(
        'Cannot delete module: menus exist under this module',
      );
    }

    await module.destroy();
    return {
      message: 'Module deleted successfully',
    };
  }

  // Update your toResponseDto method to include parent mapping:
  private toResponseDto(
    module: SysModules,
    withChildren = false,
  ): ModuleResponseDto {
    const dto: ModuleResponseDto = {
      id: module.id,
      name: module.name,
      description: module.description,
    };

    return dto;
  }
}
