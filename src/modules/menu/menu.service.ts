import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PaginateParams } from '../../common/decorators/paginate.decorator';
import { ErrorHandlerHelper } from '../../common/helper/errorMessage.helper';
import {
  SysMenu,
  SysMenuLocation,
} from '../../database/models/system/sys_menu.model';
import { SysMenuPermission } from '../../database/models/system/sys_menu_permission.model';
import { SysModules } from '../../database/models/system/sys_module.model';
import { ModuleUserService } from '../module-user/module-user.service';
import { AuthService } from '../user-management/auth/auth.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import {
  MenuResponseDto,
  ModuleWithMenuTreeResponseDto,
} from './dto/response.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import {
  MenuTreeNodeDto,
  UpdateMenuTreeDto,
} from './dto/update-position.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(SysMenu)
    private readonly menuModel: typeof SysMenu,
    @InjectModel(SysModules)
    private readonly menuModulesModel: typeof SysModules,
    @InjectModel(SysMenuPermission)
    private readonly menuPermissionModel: typeof SysMenuPermission,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(forwardRef(() => ModuleUserService))
    private readonly moduleUserService: ModuleUserService,
  ) {}

  async create(
    dto: CreateMenuDto,
  ): Promise<MenuResponseDto> {
    if (dto.moduleId) {
      const module =
        await this.menuModulesModel.findByPk(
          dto.moduleId,
        );
      if (!module)
        throw new NotFoundException(
          'Menu module not found',
        );
    }

    if (dto.parentId) {
      const parent =
        await this.menuModel.findByPk(
          dto.parentId,
        );
      if (!parent)
        throw new NotFoundException(
          'Parent menu not found',
        );
    }
    // Create the menu first
    let menu;
    try {
      menu = await this.menuModel.create({
        title: dto.title,
        url: dto.url,
        target: dto.target,
        location: dto.location,
        icon: dto.icon,
        isVisible: dto.isVisible ?? true,
        order: dto.order ?? 0,
        elementClass: dto.elementClass,
        elementId: dto.elementId,
        description: dto.description,
        parentId: dto.parentId ?? null,
        moduleId: dto.moduleId ?? null,
      });
    } catch (error) {
      console.log({
        error,
      });

      throw new ConflictException(
        'Failed to create menu',
      );
    }

    // Assign permissions if provided
    if (
      dto.permissionIds &&
      dto.permissionIds.length > 0
    ) {
      const menuPermissions =
        dto.permissionIds.map((permissionId) => ({
          menuId: menu.id,
          permissionId,
        }));

      await this.menuPermissionModel.bulkCreate(
        menuPermissions,
      );
    }

    // Return menu with permissions
    return this.findOne(menu.id);
  }

  async findAll(): Promise<MenuResponseDto[]> {
    const menus = await this.menuModel.findAll({
      include: [
        {
          association: 'module',
          attributes: [
            'id',
            'name',
            'description',
          ],
        },
        {
          association: 'parent',
          attributes: ['id', 'title', 'url'],
        },
      ],
      order: [['id', 'ASC']],
    });
    return menus.map((m) =>
      this.toResponseDto(m),
    );
  }

  async findOne(
    id: number,
  ): Promise<MenuResponseDto> {
    const menu = await this.menuModel.findByPk(
      id,
      {
        include: [
          {
            association: 'module',
            attributes: [
              'id',
              'name',
              'description',
            ],
          },
          {
            association: 'parent',
            attributes: ['id', 'title', 'url'],
          },

          {
            association: 'permissions',
            attributes: [
              'id',
              'key',
              'description',
            ],
            through: { attributes: [] },
          },
        ],
      },
    );
    if (!menu)
      throw new NotFoundException(
        'Menu not found',
      );
    return this.toResponseDto(menu, true, true);
  }

  async update(
    id: number,
    dto: UpdateMenuDto,
  ): Promise<MenuResponseDto> {
    try {
      const menu =
        await this.menuModel.findByPk(id);
      if (!menu) {
        throw new NotFoundException(
          'Menu not found',
        );
      }

      // Check module existence if changed
      if (
        dto.moduleId &&
        dto.moduleId !== menu.moduleId
      ) {
        const module =
          await this.menuModulesModel.findByPk(
            dto.moduleId,
          );
        if (!module) {
          throw new NotFoundException(
            'Menu module not found',
          );
        }
      }

      // Check parent existence and prevent cycles/self-reference
      if (
        dto.parentId !== undefined &&
        dto.parentId !== menu.parentId
      ) {
        if (dto.parentId) {
          const parent =
            await this.menuModel.findByPk(
              dto.parentId,
            );
          if (!parent) {
            throw new NotFoundException(
              'Parent menu not found',
            );
          }
          if (dto.parentId === id) {
            throw new ConflictException(
              'A menu cannot be its own parent',
            );
          }
        }
      }

      // Update menu properties
      await menu.update({
        title: dto.title,
        url: dto.url,
        target: dto.target,
        location: dto.location,
        icon: dto.icon,
        order: dto.order,
        description: dto.description,
        parentId: dto.parentId,
        moduleId: dto.moduleId,
        isVisible: dto.isVisible,
        elementClass: dto.elementClass,
        elementId: dto.elementId,
      });

      // Update permissions if provided
      if (dto.permissionIds !== undefined) {
        await this.menuPermissionModel.destroy({
          where: { menuId: id },
          force: true,
        });

        if (dto.permissionIds.length > 0) {
          const menuPermissions =
            dto.permissionIds.map(
              (permissionId) => ({
                menuId: id,
                permissionId,
              }),
            );

          await this.menuPermissionModel.bulkCreate(
            menuPermissions,
          );
        }
      } else {
        // No permissionIds provided,means delete all existing permissions
        await this.menuPermissionModel.destroy({
          where: { menuId: id },
          force: true,
        });
      }

      // Return updated menu with permissions
      return this.findOne(id);
    } catch (error: any) {
      ErrorHandlerHelper.handleError(error);
    }
  }

  async remove(
    id: number,
  ): Promise<{ message: string }> {
    const menu =
      await this.menuModel.findByPk(id);
    if (!menu)
      throw new NotFoundException(
        'Menu not found',
      );

    // If menu has children, set their parentId to null
    const childMenus =
      await this.menuModel.findAll({
        where: { parentId: id },
      });

    if (childMenus.length > 0) {
      // Update all children to have parentId = null
      await this.menuModel.update(
        { parentId: null },
        { where: { parentId: id } },
      );
      console.log(
        `✅ Updated ${childMenus.length} child menus to have parentId = null`,
      );
    }

    // Remove all associated permissions first
    await this.menuPermissionModel.destroy({
      where: { menuId: id },
      force: true,
    });

    // Now delete the menu (hard delete)
    await menu.destroy({ force: true });

    return {
      message:
        'Menu and associated permissions deleted successfully. Child menus promoted to root level.',
    };
  }

  async findAndCount({
    skip,
    limit,
    search,
  }: PaginateParams): Promise<
    [MenuResponseDto[], number]
  > {
    const whereClause = search
      ? {
          [Op.or]: [
            {
              title: {
                [Op.iLike]: `%${search}%`,
              },
            },
            {
              url: { [Op.iLike]: `%${search}%` },
            },
            {
              description: {
                [Op.iLike]: `%${search}%`,
              },
            },
          ],
        }
      : {};

    const { rows, count } =
      await this.menuModel.findAndCountAll({
        where: whereClause,
        include: [
          {
            association: 'module',
            attributes: [
              'id',
              'name',
              'description',
            ],
          },
          {
            association: 'parent',
            attributes: ['id', 'title', 'url'],
          },
        ],
        order: [['createdAt', 'DESC']],
        offset: skip,
        limit: limit,
      });

    return [
      rows.map((m) => this.toResponseDto(m)),
      count,
    ];
  }

  async assignPermissions(
    menuId: number,
    permissionIds: number[],
  ): Promise<{ message: string }> {
    const menu =
      await this.menuModel.findByPk(menuId);
    if (!menu)
      throw new NotFoundException(
        'Menu not found',
      );

    await this.menuPermissionModel.destroy({
      where: { menuId },
      force: true,
    });

    const menuPermissions = permissionIds.map(
      (permissionId) => ({
        menuId,
        permissionId,
      }),
    );

    await this.menuPermissionModel.bulkCreate(
      menuPermissions,
    );
    return {
      message:
        'Menu permissions updated successfully',
    };
  }

  async findTree(): Promise<MenuResponseDto[]> {
    const menus = await this.menuModel.findAll({
      include: [
        {
          association: 'module',
          attributes: [
            'id',
            'name',
            'description',
          ],
        },
      ],
      order: [
        ['order', 'ASC'],
        ['id', 'ASC'],
      ], // Order by menu order, then by ID
    });

    const menuData = menus.map((m) => m.toJSON());

    // Check for cycles before building tree
    this.detectCycles(menuData);

    const map = new Map<number, any>();
    const roots: any[] = [];

    // Build the map first
    menuData.forEach((menu) => {
      map.set(menu.id, {
        ...menu,
        children: [],
      });
    });

    // Build the tree structure
    menuData.forEach((menu) => {
      if (
        menu.parentId &&
        map.has(menu.parentId)
      ) {
        map
          .get(menu.parentId)
          .children.push(map.get(menu.id));
      } else {
        roots.push(map.get(menu.id));
      }
    });

    // Map to DTOs
    return roots.map((menu) =>
      this.toResponseDto(menu, true, false),
    );
  }

  async findAllModulesWithMenuTree(
    moduleId?: number,
    location?:
      | SysMenuLocation
      | SysMenuLocation[],
  ): Promise<ModuleWithMenuTreeResponseDto[]> {
    try {
      // Fetch modules with optional filter
      const modules =
        await this.menuModulesModel.findAll({
          attributes: [
            'id',
            'name',
            'description',
          ],
          ...(moduleId && {
            where: { id: moduleId },
          }),
          order: [['id', 'ASC']],
        });

      if (modules.length === 0) {
        return [];
      }

      // Build location filter
      let locationFilter = {};
      if (location) {
        if (Array.isArray(location)) {
          locationFilter = {
            [Op.or]: location.map((loc) => ({
              location: { [Op.contains]: [loc] },
            })),
          };
        } else {
          locationFilter = {
            location: {
              [Op.contains]: [location],
            },
          };
        }
      }

      // Fetch menus with optional module and location filter
      const moduleIds = modules.map((m) => m.id);
      const allMenus =
        await this.menuModel.findAll({
          where: {
            ...(moduleIds.length === 1
              ? { moduleId: moduleIds[0] }
              : { moduleId: moduleIds }),
            ...locationFilter,
          },
          include: [
            {
              association: 'module',
              attributes: [
                'id',
                'name',
                'description',
              ],
            },
            {
              association: 'permissions',
              attributes: [
                'id',
                'key',
                'description',
              ],
              through: { attributes: [] },
            },
          ],
          order: [
            ['moduleId', 'ASC'],
            ['order', 'ASC'],
            ['id', 'ASC'],
          ],
        });

      // Deep clone once for all menus
      const allMenuData = JSON.parse(
        JSON.stringify(allMenus),
      );

      // Group menus by moduleId for efficient lookup
      const menusByModule = new Map<
        number,
        any[]
      >();
      allMenuData.forEach((menu) => {
        if (!menusByModule.has(menu.moduleId)) {
          menusByModule.set(menu.moduleId, []);
        }
        menusByModule
          .get(menu.moduleId)
          .push(menu);
      });

      const result: ModuleWithMenuTreeResponseDto[] =
        [];

      for (const module of modules) {
        const menuData =
          menusByModule.get(module.id) || [];

        if (menuData.length > 0) {
          try {
            this.detectCycles(menuData);
          } catch (cycleErr) {
            console.error(
              `[MenuService] Cycle detected in module ${module.id}:`,
              cycleErr,
            );
            throw cycleErr;
          }
        }

        // Build the tree from the filtered menu data
        const map = new Map<number, any>();
        const roots: any[] = [];

        menuData.forEach((menu) => {
          map.set(menu.id, {
            ...menu,
            children: [],
          });
        });

        menuData.forEach((menu) => {
          if (
            menu.parentId &&
            map.has(menu.parentId)
          ) {
            map
              .get(menu.parentId)
              ?.children.push(map.get(menu.id));
          } else {
            roots.push(map.get(menu.id));
          }
        });

        const moduleWithTree: ModuleWithMenuTreeResponseDto =
          {
            moduleId: module.id,
            moduleName: module.name,
            moduleDescription: module.description,
            menuTree: roots.map((menu) =>
              this.toResponseDto(
                menu,
                true,
                true,
              ),
            ),
          };

        result.push(moduleWithTree);
      }

      return result.sort(
        (a, b) => a.moduleId - b.moduleId,
      );
    } catch (err) {
      console.error(
        '[MenuService] Error in findAllModulesWithMenuTree:',
        err,
      );
      throw err;
    }
  }

  /**
   * Updates the entire menu tree structure for a module, including order and parent-child relationships.
   * This replaces the old updateMenuOrder method.
   */
  async updateMenuTree(
    dto: UpdateMenuTreeDto,
  ): Promise<{
    message: string;
    updated: number;
  }> {
    const { moduleId, menuTree } = dto;

    // 1. Validate module exists
    const module =
      await this.menuModulesModel.findByPk(
        moduleId,
      );
    if (!module) {
      throw new NotFoundException(
        `Module with ID ${moduleId} not found`,
      );
    }

    // 2. Flatten the incoming tree to get all menu IDs
    const incomingMenuIds =
      this.flattenMenuTree(menuTree);
    if (
      new Set(incomingMenuIds).size !==
      incomingMenuIds.length
    ) {
      throw new BadRequestException(
        'Duplicate menu IDs found in the payload.',
      );
    }

    // 3. Verify all menus exist and belong to the module
    const existingMenus =
      await this.menuModel.findAll({
        where: { id: incomingMenuIds, moduleId },
      });
    if (
      existingMenus.length !==
      incomingMenuIds.length
    ) {
      throw new BadRequestException(
        'One or more menu IDs are invalid or do not belong to the specified module.',
      );
    }

    // 4. Perform the update within a transaction
    const sequelize = this.menuModel.sequelize;
    if (!sequelize) {
      throw new Error(
        'Database connection not available',
      );
    }

    try {
      const updatedCount =
        await sequelize.transaction(
          async (transaction) => {
            // We need a recursive helper function to process the tree
            const processNode = async (
              node: MenuTreeNodeDto,
              index: number,
              parentId: number | null,
            ): Promise<number> => {
              let count = 0;

              // Update the current node's order and parentId
              const [affectedRows] =
                await this.menuModel.update(
                  {
                    order: index + 1, // 1-based order
                    parentId: parentId,
                    updatedAt: new Date(),
                  },
                  {
                    where: {
                      id: node.id,
                      moduleId,
                    },
                    transaction,
                  },
                );

              count += affectedRows;

              // If the node has children, recurse
              if (
                node.children &&
                node.children.length > 0
              ) {
                for (
                  let i = 0;
                  i < node.children.length;
                  i++
                ) {
                  // The current node's ID becomes the parentId for its children
                  count += await processNode(
                    node.children[i],
                    i,
                    node.id,
                  );
                }
              }
              return count;
            };

            let totalUpdated = 0;
            // Start processing from the root of the tree (parentId is null)
            for (
              let i = 0;
              i < menuTree.length;
              i++
            ) {
              totalUpdated += await processNode(
                menuTree[i],
                i,
                null,
              );
            }

            return totalUpdated;
          },
        );

      return {
        message: `Successfully updated menu tree for module ${moduleId}.`,
        updated: updatedCount,
      };
    } catch (error) {
      console.error(
        'Error updating menu tree:',
        error,
      );
      throw new BadRequestException(
        `Failed to update menu tree: ${error.message}`,
      );
    }
  }

  /**
   * Helper function to flatten the menu tree and collect all IDs.
   */
  private flattenMenuTree(
    nodes: MenuTreeNodeDto[],
  ): number[] {
    let ids: number[] = [];
    for (const node of nodes) {
      ids.push(node.id);
      if (
        node.children &&
        node.children.length > 0
      ) {
        ids = ids.concat(
          this.flattenMenuTree(node.children),
        );
      }
    }
    return ids;
  }

  /**
   * Get permitted modules with their menu trees for user
   * This is the ONLY method needed for permitted menus - everything in one function
   */

  async findPermittedModulesWithMenuTree(
    userId: number,
    moduleId?: number,
    location?:
      | SysMenuLocation
      | SysMenuLocation[],
  ): Promise<ModuleWithMenuTreeResponseDto[]> {
    try {
      console.debug(
        `[MenuService] Finding permitted modules with menu trees for user ${userId}`,
      );

      // Get user permissions and module IDs in parallel
      const [userPermissions, userModuleIds] =
        await Promise.all([
          this.authService.getUserDirectPermissions(
            userId,
          ),
          this.moduleUserService.findModuleIdsForUser(
            userId,
          ),
        ]);

      // If user is super user, return all modules
      if (userPermissions.includes('*')) {
        console.debug(
          '[MenuService] Super user detected, returning all modules',
        );
        return this.findAllModulesWithMenuTree(
          moduleId,
          location,
        );
      }

      if (userModuleIds.length === 0) {
        console.debug(
          '[MenuService] User has no module access, returning empty array',
        );
        return [];
      }

      // Build filters
      const moduleWhereClause: any = {
        id: { [Op.in]: userModuleIds },
      };
      if (moduleId) {
        if (
          !userModuleIds
            .map((id) => Number(id))
            .includes(moduleId)
        ) {
          console.debug(
            `[MenuService] User does not have access to requested module ${moduleId}`,
          );
          return [];
        }
        moduleWhereClause.id = moduleId;
      }

      let locationFilter = {};
      if (location) {
        locationFilter = Array.isArray(location)
          ? {
              [Op.or]: location.map((loc) => ({
                location: {
                  [Op.contains]: [loc],
                },
              })),
            }
          : {
              location: {
                [Op.contains]: [location],
              },
            };
      }

      // Single query to get ALL data at once
      const [modules, allMenus] =
        await Promise.all([
          this.menuModulesModel.findAll({
            where: moduleWhereClause,
            attributes: [
              'id',
              'name',
              'description',
            ],
            order: [['id', 'ASC']],
          }),
          this.menuModel.findAll({
            where: {
              moduleId: {
                [Op.in]: userModuleIds,
              },
              ...locationFilter,
            },
            include: [
              {
                association: 'permissions',
                attributes: ['key'],
                through: { attributes: [] },
              },
            ],
            order: [
              ['moduleId', 'ASC'],
              ['order', 'ASC'],
              ['id', 'ASC'],
            ],
          }),
        ]);

      if (modules.length === 0) return [];

      // Group menus by moduleId for O(1) lookup
      const menusByModule = new Map<
        number,
        any[]
      >();
      JSON.parse(
        JSON.stringify(allMenus),
      ).forEach((menu) => {
        if (!menusByModule.has(menu.moduleId)) {
          menusByModule.set(menu.moduleId, []);
        }
        menusByModule
          .get(menu.moduleId)
          .push(menu);
      });

      // Convert user permissions to Set for O(1) lookup
      const userPermSet = new Set(
        userPermissions,
      );

      const result: ModuleWithMenuTreeResponseDto[] =
        [];

      for (const module of modules) {
        const moduleMenus =
          menusByModule.get(module.id) || [];

        // Filter menus based on permissions
        const permittedMenus = moduleMenus.filter(
          (menu) =>
            !menu.permissions?.length ||
            menu.permissions.some((p) =>
              userPermSet.has(p.key),
            ),
        );

        if (permittedMenus.length === 0) continue;

        // Build tree efficiently
        const menuMap = new Map<number, any>();
        const roots: any[] = [];

        // Create menu nodes with children array
        permittedMenus.forEach((menu) => {
          menuMap.set(menu.id, {
            ...menu,
            children: [],
          });
        });

        // Build parent-child relationships
        permittedMenus.forEach((menu) => {
          const node = menuMap.get(menu.id);
          if (
            menu.parentId &&
            menuMap.has(menu.parentId)
          ) {
            menuMap
              .get(menu.parentId)
              .children.push(node);
          } else {
            roots.push(node);
          }
        });

        // Sort and convert to clean DTOs
        const sortByOrder = (a: any, b: any) =>
          (a.order || 0) - (b.order || 0);
        const toCleanDto = (
          menu: any,
        ): MenuResponseDto => ({
          id: menu.id,
          title: menu.title || '',
          url: menu.url || '',
          target: menu.target,
          location: menu.location,
          icon: menu.icon,
          order: menu.order || 0,
          description: menu.description,
          isVisible: menu.isVisible,
          parentId: menu.parentId,
          moduleId: menu.moduleId,
          ...(menu.children?.length && {
            children: menu.children
              .sort(sortByOrder)
              .map(toCleanDto),
          }),
        });

        const menuTree = roots
          .sort(sortByOrder)
          .map(toCleanDto);

        if (menuTree.length > 0) {
          result.push({
            moduleId: module.id,
            moduleName: module.name,
            moduleDescription: module.description,
            menuTree,
          });
        }
      }

      console.debug(
        `[MenuService] Found ${result.length} modules with permitted menus`,
      );
      return result.sort(
        (a, b) => a.moduleId - b.moduleId,
      );
    } catch (err) {
      console.error(
        '[MenuService] Error finding permitted modules with menu trees:',
        err,
      );
      throw err;
    }
  }

  /**
   * Detect cycles in menu hierarchy using DFS
   */
  private detectCycles(menus: any[]): void {
    const visited = new Set<number>();
    const recursionStack = new Set<number>();
    const menuMap = new Map<number, any>();

    // Create a map for quick lookup
    menus.forEach((menu) => {
      menuMap.set(menu.id, menu);
    });

    // Check each menu as a potential starting point
    for (const menu of menus) {
      if (!visited.has(menu.id)) {
        if (
          this.hasCycleDFS(
            menu.id,
            menuMap,
            visited,
            recursionStack,
          )
        ) {
          throw new ConflictException(
            `Circular reference detected in menu hierarchy starting from menu ID: ${menu.id}`,
          );
        }
      }
    }
  }

  /**
   * DFS helper to detect cycles
   */
  private hasCycleDFS(
    menuId: number,
    menuMap: Map<number, any>,
    visited: Set<number>,
    recursionStack: Set<number>,
  ): boolean {
    // Mark current node as visited and add to recursion stack
    visited.add(menuId);
    recursionStack.add(menuId);

    const menu = menuMap.get(menuId);
    if (!menu) return false;

    // Check all children
    const children = Array.from(
      menuMap.values(),
    ).filter((m) => m.parentId === menuId);

    for (const child of children) {
      // If child is not visited, recurse
      if (!visited.has(child.id)) {
        if (
          this.hasCycleDFS(
            child.id,
            menuMap,
            visited,
            recursionStack,
          )
        ) {
          return true;
        }
      }
      // If child is in recursion stack, we found a cycle
      else if (recursionStack.has(child.id)) {
        return true;
      }
    }

    // Remove from recursion stack before returning
    recursionStack.delete(menuId);
    return false;
  }

  // Helper: map entity to response DTO
  private toResponseDto(
    menu: any,
    withChildren = false,
    withPermissions = false,
  ): MenuResponseDto {
    const dto: MenuResponseDto = {
      id: menu.id,
      title: menu.title || '',
      url: menu.url || '',
      target: menu.target,
      location: menu.location,
      icon: menu.icon,
      order: menu.order || 0,
      elementClass: menu.elementClass,
      elementId: menu.elementId,
      description: menu.description,
      parentId: menu.parentId,
      moduleId: menu.moduleId,
      isVisible: menu.isVisible,
    };

    // Only add module info if explicitly requested AND it exists
    if (withPermissions && menu.module) {
      dto.module = {
        id: menu.module.id,
        name: menu.module.name,
        description: menu.module.description,
      };
    }

    // Add children if requested (sorted by order)
    if (
      withChildren &&
      menu.children &&
      Array.isArray(menu.children)
    ) {
      // Sort children by order field
      menu.children.sort(
        (a: any, b: any) =>
          (a.order || 0) - (b.order || 0),
      );
      dto.children = menu.children.map(
        (child: any) =>
          this.toResponseDto(
            child,
            true,
            withPermissions,
          ),
      );
    }

    // Only add permissions if explicitly requested AND it exists
    if (
      withPermissions &&
      menu.permissions &&
      Array.isArray(menu.permissions)
    ) {
      dto.permissions = menu.permissions.map(
        (permission: any) => ({
          id: permission.id,
          key: permission.key,
          description: permission.description,
        }),
      );
    }

    return dto;
  }
}
