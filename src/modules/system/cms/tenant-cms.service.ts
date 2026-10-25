import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  SysTenantSite,
  SysTenantMenu,
  SysTenantMenuItem,
  SysTenantPage,
  SysTenantPageBlock,
} from '../../../database/models/cms';
import { SysOrganization } from '../../../database/models/system/sys_organization.model';
import {
  UpdateTenantSiteDto,
  CreateTenantMenuDto,
  CreateTenantMenuItemDto,
  UpdateTenantMenuItemDto,
  CreateTenantPageDto,
  UpdateTenantPageDto,
  CreateTenantPageBlockDto,
  UpdateTenantPageBlockDto,
} from './dto/tenant-cms.dto';

@Injectable()
export class TenantCmsService {
  constructor(
    @InjectModel(SysTenantSite)
    private readonly siteModel: typeof SysTenantSite,
    @InjectModel(SysTenantMenu)
    private readonly menuModel: typeof SysTenantMenu,
    @InjectModel(SysTenantMenuItem)
    private readonly menuItemModel: typeof SysTenantMenuItem,
    @InjectModel(SysTenantPage)
    private readonly pageModel: typeof SysTenantPage,
    @InjectModel(SysTenantPageBlock)
    private readonly pageBlockModel: typeof SysTenantPageBlock,
    @InjectModel(SysOrganization)
    private readonly orgModel: typeof SysOrganization,
  ) {}

  // 1. Tenant Site Settings
  async getSite(orgId: number) {
    let site = await this.siteModel.findOne({
      where: { orgId },
      include: [{ model: this.orgModel, attributes: ['id', 'name', 'code'] }],
    });

    if (!site) {
      const org = await this.orgModel.findByPk(orgId);
      if (!org) {
        throw new NotFoundException(`Organization with ID ${orgId} not found`);
      }
      const subdomain = org.code.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      site = await this.siteModel.create({
        orgId,
        subdomain,
        siteTitle: `${org.name} Portal`,
        tagline: 'Driving Enterprise Innovation',
        themeConfig: {
          primaryColor: '#0000F2',
          secondaryColor: '#3B82F6',
          accentColor: '#00D2FF',
          fontFamily: 'Inter',
          darkMode: true,
          borderRadius: '8px',
        },
        seoConfig: {
          metaTitle: `${org.name} Enterprise Portal`,
          metaDescription: `Enterprise stakeholder portal for ${org.name}`,
          ogImage: '',
          keywords: 'enterprise, portal, saas',
        },
        isPublished: true,
      });
    }

    return site;
  }

  async updateSite(orgId: number, dto: UpdateTenantSiteDto) {
    const site = await this.getSite(orgId);
    await site.update({
      ...dto,
      themeConfig: dto.themeConfig ? { ...site.themeConfig, ...dto.themeConfig } : site.themeConfig,
      seoConfig: dto.seoConfig ? { ...site.seoConfig, ...dto.seoConfig } : site.seoConfig,
    });
    return site;
  }

  // 2. Tenant Menus & Menu Items
  async getMenus(orgId: number) {
    return this.menuModel.findAll({
      where: { orgId },
      include: [
        {
          model: this.menuItemModel,
          as: 'items',
          order: [['orderIndex', 'ASC']],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
  }

  async getMenuTree(orgId: number, menuId?: number) {
    const where: any = { orgId };
    if (menuId) {
      where.id = menuId;
    }

    const menus = await this.menuModel.findAll({
      where,
      include: [
        {
          model: this.menuItemModel,
          as: 'items',
        },
      ],
    });

    return menus.map((menu) => {
      const plainMenu = menu.get({ plain: true });
      const items = plainMenu.items || [];
      
      const itemMap = new Map<number, any>();
      const roots: any[] = [];

      items.forEach((item: any) => {
        itemMap.set(item.id, { ...item, children: [] });
      });

      items.forEach((item: any) => {
        const current = itemMap.get(item.id);
        if (item.parentId && itemMap.has(item.parentId)) {
          itemMap.get(item.parentId).children.push(current);
        } else {
          roots.push(current);
        }
      });

      const sortTree = (nodes: any[]) => {
        nodes.sort((a, b) => a.orderIndex - b.orderIndex);
        nodes.forEach((n) => sortTree(n.children));
      };
      sortTree(roots);

      return {
        ...plainMenu,
        tree: roots,
      };
    });
  }

  async createMenu(orgId: number, dto: CreateTenantMenuDto) {
    return this.menuModel.create({
      ...dto,
      orgId,
    });
  }

  async createMenuItem(orgId: number, dto: CreateTenantMenuItemDto) {
    const menu = await this.menuModel.findOne({
      where: { id: dto.menuId, orgId },
    });
    if (!menu) {
      throw new BadRequestException('Target menu not found for this organization');
    }

    return this.menuItemModel.create({
      ...dto,
      orgId,
    });
  }

  async updateMenuItem(orgId: number, id: number, dto: UpdateTenantMenuItemDto) {
    const item = await this.menuItemModel.findOne({
      where: { id, orgId },
    });
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await item.update(dto);
    return item;
  }

  async deleteMenuItem(orgId: number, id: number) {
    const item = await this.menuItemModel.findOne({
      where: { id, orgId },
    });
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }

    await item.destroy();
    return { success: true, message: 'Menu item deleted' };
  }

  // 3. Tenant Pages & Blocks
  async getPages(orgId: number) {
    return this.pageModel.findAll({
      where: { orgId },
      include: [
        {
          model: this.pageBlockModel,
          as: 'blocks',
        },
      ],
      order: [
        ['isHomePage', 'DESC'],
        ['createdAt', 'ASC'],
        [{ model: this.pageBlockModel, as: 'blocks' }, 'orderIndex', 'ASC'],
      ],
    });
  }

  async createPage(orgId: number, dto: CreateTenantPageDto) {
    return this.pageModel.create({
      ...dto,
      orgId,
    });
  }

  async updatePage(orgId: number, id: number, dto: UpdateTenantPageDto) {
    const page = await this.pageModel.findOne({
      where: { id, orgId },
    });
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    await page.update(dto);
    return page;
  }

  async addPageBlock(orgId: number, dto: CreateTenantPageBlockDto) {
    const page = await this.pageModel.findOne({
      where: { id: dto.pageId, orgId },
    });
    if (!page) {
      throw new BadRequestException('Target page not found for this organization');
    }

    return this.pageBlockModel.create({
      ...dto,
      orgId,
    });
  }

  async updatePageBlock(orgId: number, id: number, dto: UpdateTenantPageBlockDto) {
    const block = await this.pageBlockModel.findOne({
      where: { id, orgId },
    });
    if (!block) {
      throw new NotFoundException('Page block not found');
    }

    await block.update(dto);
    return block;
  }

  async deletePageBlock(orgId: number, id: number) {
    const block = await this.pageBlockModel.findOne({
      where: { id, orgId },
    });
    if (!block) {
      throw new NotFoundException('Page block not found');
    }

    await block.destroy();
    return { success: true, message: 'Block removed' };
  }

  // 4. Public Site Resolution by Subdomain or Custom Domain
  async resolvePublicSite(domainOrSubdomain: string) {
    let site = await this.siteModel.findOne({
      where: { subdomain: domainOrSubdomain.toLowerCase(), isPublished: true },
      include: [
        {
          model: this.orgModel,
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!site) {
      site = await this.siteModel.findOne({
        where: { customDomain: domainOrSubdomain.toLowerCase(), isPublished: true },
        include: [
          {
            model: this.orgModel,
            attributes: ['id', 'name', 'code'],
          },
        ],
      });
    }

    if (!site) {
      // Check by org code or numeric ID
      if (!isNaN(Number(domainOrSubdomain))) {
        site = await this.siteModel.findOne({
          where: { orgId: Number(domainOrSubdomain), isPublished: true },
          include: [{ model: this.orgModel, attributes: ['id', 'name', 'code'] }],
        });
      }
    }

    if (!site) {
      throw new NotFoundException(`Tenant site "${domainOrSubdomain}" not found or unpublished`);
    }

    const orgId = site.orgId;
    const menus = await this.getMenuTree(orgId);
    const pages = await this.getPages(orgId);

    return {
      site,
      menus,
      pages,
    };
  }
}
