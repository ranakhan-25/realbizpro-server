import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';

import { SysMenu, SysMenuLocation } from '../../database/models/system/sys_menu.model';
import { SysModules } from '../../database/models/system/sys_module.model';
import { SysFeatures } from '../../database/models/system/sys_features.model';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponseDto } from './dto/response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import {
  CreateModuleTreeDto,
  FeatureNodeDto,
  FeatureNodeResponseDto,
  ModuleTreeNodeResponseDto,
} from './dto/module-tree.dto';

@Injectable()
export class ModulesService {
  private treeCache: { data: ModuleTreeNodeResponseDto[]; expiresAt: number } | null = null;
  private modulesListCache: { data: ModuleResponseDto[]; expiresAt: number } | null = null;

  constructor(
    @InjectModel(SysModules)
    private readonly menuModulesModel: typeof SysModules,
    @InjectModel(SysMenu)
    private readonly menuModel: typeof SysMenu,
    @InjectModel(SysFeatures)
    private readonly featureModel: typeof SysFeatures,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  private clearCache(): void {
    this.treeCache = null;
    this.modulesListCache = null;
  }

  async create(dto: CreateModuleDto): Promise<ModuleResponseDto> {
    this.clearCache();
    const exists = await this.menuModulesModel.findOne({
      where: { name: dto.name },
    });
    if (exists) {
      throw new ConflictException('Module name already exists');
    }

    const module = await this.menuModulesModel.create(dto as any);
    return this.toResponseDto(module);
  }

  async findAll(): Promise<ModuleResponseDto[]> {
    if (this.modulesListCache && Date.now() < this.modulesListCache.expiresAt) {
      return this.modulesListCache.data;
    }

    const modules = await this.menuModulesModel.findAll({
      order: [['id', 'ASC']],
    });
    const result = modules.map((m) => this.toResponseDto(m));
    this.modulesListCache = {
      data: result,
      expiresAt: Date.now() + 300000,
    };
    return result;
  }

  async getDropdown(): Promise<
    Array<{
      id: number;
      name: string;
      description: string | null;
    }>
  > {
    const modules = await this.menuModulesModel.findAll({
      attributes: ['id', 'name', 'description'],
      order: [['name', 'ASC']],
    });

    return modules.map((module) => ({
      id: module.id,
      name: module.name,
      description: module.description,
    }));
  }

  async findOne(id: number): Promise<ModuleResponseDto> {
    const module = await this.menuModulesModel.findByPk(id);
    if (!module) throw new NotFoundException('Module not found');
    return this.toResponseDto(module, true);
  }

  async update(id: number, dto: UpdateModuleDto): Promise<ModuleResponseDto> {
    this.clearCache();
    const module = await this.menuModulesModel.findByPk(id);
    if (!module) throw new NotFoundException('Module not found');

    if (dto.name && dto.name !== module.name) {
      const exists = await this.menuModulesModel.findOne({
        where: { name: dto.name },
      });
      if (exists) {
        throw new ConflictException('Module name already exists');
      }
    }

    await module.update(dto as any);
    return this.toResponseDto(module);
  }

  async remove(id: number): Promise<{ message: string }> {
    this.clearCache();
    const module = await this.menuModulesModel.findByPk(id);
    if (!module) throw new NotFoundException('Module not found');

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

  // ==========================================
  // Dynamic Module & Nested Feature Tree Methods
  // ==========================================

  private mapFeatureNode(f: any): FeatureNodeResponseDto {
    const raw = typeof f?.get === 'function' ? f.get({ plain: true }) : f || {};
    return {
      id: raw.id,
      uuid: raw.uuid,
      moduleId: raw.moduleId,
      name: raw.name,
      code: raw.code || `FEAT_${raw.id}`,
      routePath: raw.routePath,
      actions: raw.actions ?? ['read','write','update','delete'],
      displayOrder: raw.displayOrder || 0,
      isActive: raw.isActive ?? true,
    };
  }

  private mapModuleTreeNode(m: any): ModuleTreeNodeResponseDto {
    const raw = typeof m?.get === 'function' ? m.get({ plain: true }) : m || {};
    return {
      id: raw.id,
      uuid: raw.uuid,
      name: raw.name,
      code: raw.code || `MOD_${raw.id}`,
      pathRoute: raw.pathRoute,
      icon: raw.icon,
      description: raw.description,
      displayOrder: raw.displayOrder || 0,
      isActive: raw.isActive ?? true,
      features: (raw.features || []).map((f: any) =>
        this.mapFeatureNode(f),
      ),
    };
  }

  async getTree(): Promise<ModuleTreeNodeResponseDto[]> {
    if (this.treeCache && Date.now() < this.treeCache.expiresAt) {
      return this.treeCache.data;
    }

    const modules = await this.menuModulesModel.findAll({
      include: [
        {
          model: this.featureModel,
          as: 'features',
          required: false,
        },
      ],
      order: [
        ['displayOrder', 'ASC'],
        ['id', 'ASC'],
        [{ model: this.featureModel, as: 'features' }, 'displayOrder', 'ASC'],
        [{ model: this.featureModel, as: 'features' }, 'id', 'ASC'],
      ],
    });

    const result = modules.map((m) => this.mapModuleTreeNode(m));
    this.treeCache = {
      data: result,
      expiresAt: Date.now() + 300000,
    };
    return result;
  }

  async saveTree(dto: CreateModuleTreeDto): Promise<ModuleTreeNodeResponseDto> {
    this.clearCache();
    return this.sequelize.transaction(async (tx) => {
      let module: SysModules | null = null;

      if (dto.id) {
        module = await this.menuModulesModel.findByPk(dto.id, { transaction: tx });
      }

      if (!module && dto.code) {
        module = await this.menuModulesModel.findOne({
          where: { code: dto.code },
          transaction: tx,
        });
      }

      const modulePayload = {
        name: dto.name,
        code: dto.code,
        pathRoute: dto.pathRoute,
        icon: dto.icon,
        description: dto.description,
        displayOrder: dto.displayOrder ?? 0,
        isActive: dto.isActive ?? true,
      };

      if (module) {
        if (dto.name && dto.name !== module.name) {
          const duplicateName = await this.menuModulesModel.findOne({
            where: {
              name: dto.name,
              id: { [Op.ne]: module.id },
            },
            transaction: tx,
          });
          if (duplicateName) {
            throw new ConflictException(
              `Module name "${dto.name}" is already taken by another module.`,
            );
          }
        }
        if (dto.code && dto.code !== module.code) {
          const duplicateCode = await this.menuModulesModel.findOne({
            where: {
              code: dto.code,
              id: { [Op.ne]: module.id },
            },
            transaction: tx,
          });
          if (duplicateCode) {
            throw new ConflictException(
              `Module code "${dto.code}" is already taken by another module.`,
            );
          }
        }
        await module.update(modulePayload, { transaction: tx });
      } else {
        // Ensure name uniqueness before creating a new module
        const nameExists = await this.menuModulesModel.findOne({
          where: { name: dto.name },
          transaction: tx,
        });
        if (nameExists) {
          throw new ConflictException('Module name already exists');
        }
        module = await this.menuModulesModel.create(modulePayload as any, {
          transaction: tx,
        });
      }

      // Upsert nested features
      if (dto.features && dto.features.length > 0) {
        for (let i = 0; i < dto.features.length; i++) {
          const featDto = dto.features[i];
          let feature: SysFeatures | null = null;

          if (featDto.id) {
            feature = await this.featureModel.findByPk(featDto.id, {
              transaction: tx,
            });
          }

          if (!feature && featDto.uuid) {
            feature = await this.featureModel.findOne({
              where: { uuid: featDto.uuid },
              transaction: tx,
            });
          }

          if (!feature && featDto.code) {
            feature = await this.featureModel.findOne({
              where: {
                moduleId: module.id,
                code: featDto.code,
              },
              transaction: tx,
            });
          }

          if (!feature && featDto.name) {
            feature = await this.featureModel.findOne({
              where: {
                moduleId: module.id,
                name: featDto.name,
              },
              transaction: tx,
            });
          }

          const featPayload = {
            moduleId: module.id,
            name: featDto.name,
            code: featDto.code,
            routePath: featDto.routePath,
            actionType: featDto.actionType || 'read',
            description: featDto.description,
            displayOrder: featDto.displayOrder ?? i + 1,
            isActive: featDto.isActive ?? true,
          };

          if (feature) {
            await feature.update(featPayload, { transaction: tx });
          } else {
            const nameConflict = await this.featureModel.findOne({
              where: { name: featPayload.name },
              transaction: tx,
            });

            if (nameConflict) {
              if (Number(nameConflict.moduleId) === Number(module.id)) {
                await nameConflict.update(featPayload, { transaction: tx });
                feature = nameConflict;
              } else {
                throw new ConflictException(
                  `Feature "${featPayload.name}" is already registered under another module.`,
                );
              }
            } else {
              feature = await this.featureModel.create(featPayload as any, {
                transaction: tx,
              });
            }
          }

          // Auto-sync feature into sys_menus for seamless sidebar navigation
          if (featPayload.routePath && featPayload.routePath.trim()) {
            const trimmedUrl = featPayload.routePath.trim();
            const existingMenu = await this.menuModel.findOne({
              where: {
                moduleId: module.id,
                [Op.or]: [
                  { url: trimmedUrl },
                  { title: featPayload.name },
                ],
              },
              transaction: tx,
            });

            if (existingMenu) {
              await existingMenu.update(
                {
                  title: featPayload.name,
                  url: trimmedUrl,
                  order: featPayload.displayOrder,
                  isVisible: featPayload.isActive,
                },
                { transaction: tx },
              );
            } else {
              await this.menuModel.create(
                {
                  moduleId: module.id,
                  title: featPayload.name,
                  url: trimmedUrl,
                  target: '_self',
                  location: [SysMenuLocation.SIDEBAR],
                  icon: module.icon || 'LayoutDashboard',
                  order: featPayload.displayOrder,
                  isVisible: featPayload.isActive,
                  elementClass: 'all',
                } as any,
                { transaction: tx },
              );
            }
          }
        }
      }

      const reloaded = await this.menuModulesModel.findByPk(module.id, {
        include: [{ model: this.featureModel, as: 'features' }],
        transaction: tx,
      });

      return this.mapModuleTreeNode(reloaded!);
    });
  }

  async addFeature(
    moduleId: number,
    dto: FeatureNodeDto,
  ): Promise<FeatureNodeResponseDto> {
    const module = await this.menuModulesModel.findByPk(moduleId);
    if (!module) throw new NotFoundException('Module not found');

    const existing = await this.featureModel.findOne({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Feature code "${dto.code}" already exists`);
    }

    const created = await this.featureModel.create({
      moduleId: module.id,
      name: dto.name,
      code: dto.code,
      routePath: dto.routePath,
      actionType: dto.actionType || 'read',
      description: dto.description,
      displayOrder: dto.displayOrder ?? 0,
      isActive: dto.isActive ?? true,
    } as any);

    // Auto-sync created feature into sys_menus
    if (dto.routePath && dto.routePath.trim()) {
      const trimmedUrl = dto.routePath.trim();
      const existingMenu = await this.menuModel.findOne({
        where: {
          moduleId: module.id,
          [Op.or]: [
            { url: trimmedUrl },
            { title: dto.name },
          ],
        },
      });

      if (existingMenu) {
        await existingMenu.update({
          title: dto.name,
          url: trimmedUrl,
          order: dto.displayOrder ?? existingMenu.order,
          isVisible: dto.isActive ?? true,
        });
      } else {
        await this.menuModel.create({
          moduleId: module.id,
          title: dto.name,
          url: trimmedUrl,
          target: '_self',
          location: [SysMenuLocation.SIDEBAR],
          icon: module.icon || 'LayoutDashboard',
          order: dto.displayOrder ?? 99,
          isVisible: dto.isActive ?? true,
          elementClass: 'all',
        } as any);
      }
    }

    return this.mapFeatureNode(created);
  }

  async deleteFeature(featureId: number): Promise<{ message: string; id: number }> {
    const feature = await this.featureModel.findByPk(featureId);
    if (!feature) throw new NotFoundException('Feature not found');

    // Auto-remove corresponding menu link from sys_menus
    if (feature.routePath) {
      await this.menuModel.destroy({
        where: {
          moduleId: feature.moduleId,
          url: feature.routePath.trim(),
        },
      });
    }

    await feature.destroy();
    return {
      message: `Feature "${feature.name}" deleted successfully`,
      id: featureId,
    };
  }

  private toResponseDto(
    module: SysModules,
    withChildren = false,
  ): ModuleResponseDto {
    return {
      id: module.id,
      name: module.name,
      description: module.description,
    };
  }
}
