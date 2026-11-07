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

      // Upsert nested features with bulk preloading to eliminate N+1 network latency
      if (dto.features && dto.features.length > 0) {
        // 1. Preload all existing features for this module in ONE fast query
        const existingFeatures = await this.featureModel.findAll({
          where: { moduleId: module.id },
          transaction: tx,
        });

        const featById = new Map<number, SysFeatures>();
        const featByUuid = new Map<string, SysFeatures>();
        const featByCode = new Map<string, SysFeatures>();
        const featByName = new Map<string, SysFeatures>();

        for (const f of existingFeatures) {
          if (f.id) featById.set(Number(f.id), f);
          if (f.uuid) featByUuid.set(f.uuid, f);
          if (f.code) featByCode.set(f.code.trim().toUpperCase(), f);
          if (f.name) featByName.set(f.name.trim().toLowerCase(), f);
        }

        // 2. Preload all existing menus for this module in ONE fast query
        const existingMenus = await this.menuModel.findAll({
          where: { moduleId: module.id },
          transaction: tx,
        });

        const menuByUrl = new Map<string, SysMenu>();
        const menuByTitle = new Map<string, SysMenu>();

        for (const m of existingMenus) {
          if (m.url) menuByUrl.set(m.url.trim().toLowerCase(), m);
          if (m.title) menuByTitle.set(m.title.trim().toLowerCase(), m);
        }

        // 3. Process features using in-memory lookups
        const featuresToCreate: any[] = [];
        const featuresToUpdate: { feature: SysFeatures; payload: any }[] = [];
        const menusToCreate: any[] = [];
        const menusToUpdate: { menu: SysMenu; payload: any }[] = [];

        const normStr = (v: any) =>
          v === null || v === undefined ? '' : String(v).trim();
        const normNum = (v: any) =>
          v === null || v === undefined ? 0 : Number(v);
        const normBool = (v: any) => Boolean(v);

        for (let i = 0; i < dto.features.length; i++) {
          const featDto = dto.features[i];
          const cleanName = featDto.name.trim();
          const cleanCode = (featDto.code || `FEAT_${i + 1}`).trim().toUpperCase();

          let feature: SysFeatures | null = null;
          if (featDto.id && featById.has(Number(featDto.id))) {
            feature = featById.get(Number(featDto.id))!;
          } else if (featDto.uuid && featByUuid.has(featDto.uuid)) {
            feature = featByUuid.get(featDto.uuid)!;
          } else if (cleanCode && featByCode.has(cleanCode)) {
            feature = featByCode.get(cleanCode)!;
          } else if (cleanName && featByName.has(cleanName.toLowerCase())) {
            feature = featByName.get(cleanName.toLowerCase())!;
          }

          const featPayload = {
            moduleId: module.id,
            name: cleanName,
            code: cleanCode,
            routePath: featDto.routePath?.trim() || null,
            actionType: featDto.actionType || 'read',
            description: featDto.description?.trim() || null,
            displayOrder: featDto.displayOrder ?? i + 1,
            isActive: featDto.isActive ?? true,
          };

          if (feature) {
            let changed = false;
            if (normStr(feature.name) !== normStr(featPayload.name)) changed = true;
            if (normStr(feature.code) !== normStr(featPayload.code)) changed = true;
            if (normStr(feature.routePath) !== normStr(featPayload.routePath)) changed = true;
            if (normStr(feature.description) !== normStr(featPayload.description)) changed = true;
            if (normNum(feature.displayOrder) !== normNum(featPayload.displayOrder)) changed = true;
            if (normBool(feature.isActive) !== normBool(featPayload.isActive)) changed = true;
            if (changed) {
              featuresToUpdate.push({ feature, payload: featPayload });
            }
          } else {
            featuresToCreate.push(featPayload);
          }

          // In-memory matching for sys_menus
          if (featPayload.routePath) {
            const trimmedUrl = featPayload.routePath.toLowerCase();
            const trimmedTitle = featPayload.name.toLowerCase();
            const existingMenu =
              menuByUrl.get(trimmedUrl) || menuByTitle.get(trimmedTitle);

            const menuPayload = {
              moduleId: module.id,
              title: featPayload.name,
              url: featPayload.routePath,
              target: '_self',
              location: [SysMenuLocation.SIDEBAR],
              icon: module.icon || 'LayoutDashboard',
              order: featPayload.displayOrder,
              isVisible: featPayload.isActive,
              elementClass: 'all',
            };

            if (existingMenu && existingMenu.id) {
              let menuChanged = false;
              if (normStr(existingMenu.title) !== normStr(menuPayload.title)) menuChanged = true;
              if (normStr(existingMenu.url) !== normStr(menuPayload.url)) menuChanged = true;
              if (normBool(existingMenu.isVisible) !== normBool(menuPayload.isVisible))
                menuChanged = true;
              if (menuChanged) {
                menusToUpdate.push({ menu: existingMenu, payload: menuPayload });
              }
            } else if (!existingMenu) {
              menusToCreate.push(menuPayload);
              menuByUrl.set(trimmedUrl, {} as any);
              menuByTitle.set(trimmedTitle, {} as any);
            }
          }
        }

        // 4. Batch updates and bulk creates in single queries
        if (featuresToCreate.length > 0) {
          await this.featureModel.bulkCreate(featuresToCreate as any, {
            transaction: tx,
          });
        }

        if (featuresToUpdate.length > 0) {
          if (featuresToUpdate.length <= 2) {
            for (const { feature, payload } of featuresToUpdate) {
              await feature.update(payload, { transaction: tx });
            }
          } else {
            const placeholders: string[] = [];
            const replacements: Record<string, any> = {};
            featuresToUpdate.forEach(({ feature, payload }, idx) => {
              placeholders.push(
                `(:id_${idx}::bigint, :name_${idx}::varchar, :code_${idx}::varchar, :routePath_${idx}::varchar, :desc_${idx}::text, :order_${idx}::int, :isActive_${idx}::boolean)`
              );
              replacements[`id_${idx}`] = feature.id;
              replacements[`name_${idx}`] = payload.name;
              replacements[`code_${idx}`] = payload.code;
              replacements[`routePath_${idx}`] = payload.routePath;
              replacements[`desc_${idx}`] = payload.description;
              replacements[`order_${idx}`] = payload.displayOrder;
              replacements[`isActive_${idx}`] = payload.isActive;
            });

            const sql = `
              UPDATE sys_features AS f
              SET
                name = v.name,
                code = v.code,
                route_path = v.route_path,
                description = v.description,
                display_order = v.display_order,
                is_active = v.is_active,
                updated_at = NOW()
              FROM (VALUES ${placeholders.join(', ')}) AS v(id, name, code, route_path, description, display_order, is_active)
              WHERE f.id = v.id
            `;
            await this.featureModel.sequelize!.query(sql, {
              replacements,
              transaction: tx,
            });
          }
        }

        if (menusToCreate.length > 0) {
          await this.menuModel.bulkCreate(menusToCreate as any, {
            transaction: tx,
          });
        }

        if (menusToUpdate.length > 0) {
          if (menusToUpdate.length <= 2) {
            for (const { menu, payload } of menusToUpdate) {
              await menu.update(payload, { transaction: tx });
            }
          } else {
            const placeholders: string[] = [];
            const replacements: Record<string, any> = {};
            menusToUpdate.forEach(({ menu, payload }, idx) => {
              placeholders.push(
                `(:id_${idx}::bigint, :title_${idx}::varchar, :url_${idx}::varchar, :order_${idx}::int, :isVisible_${idx}::boolean)`
              );
              replacements[`id_${idx}`] = menu.id;
              replacements[`title_${idx}`] = payload.title;
              replacements[`url_${idx}`] = payload.url || null;
              replacements[`order_${idx}`] = payload.order ?? 0;
              replacements[`isVisible_${idx}`] = payload.isVisible ?? true;
            });

            const sql = `
              UPDATE sys_menus AS m
              SET
                title = v.title,
                url = v.url,
                "order" = v.order,
                is_visible = v.is_visible,
                updated_at = NOW()
              FROM (VALUES ${placeholders.join(', ')}) AS v(id, title, url, "order", is_visible)
              WHERE m.id = v.id
            `;
            await this.menuModel.sequelize!.query(sql, {
              replacements,
              transaction: tx,
            });
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
