import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { TenantCmsController } from './tenant-cms.controller';
import { TenantCmsService } from './tenant-cms.service';

describe('TenantCmsController', () => {
  let controller: TenantCmsController;
  let cmsService: Partial<Record<keyof TenantCmsService, jest.Mock>>;

  beforeEach(async () => {
    cmsService = {
      getSite: jest.fn().mockResolvedValue({ id: 1, siteTitle: 'Apex Portal' }),
      updateSite: jest.fn().mockImplementation((orgId, dto) => Promise.resolve({ orgId, ...dto })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantCmsController],
      providers: [
        {
          provide: TenantCmsService,
          useValue: cmsService,
        },
      ],
    }).compile();

    controller = module.get<TenantCmsController>(TenantCmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateSite sovereignty controls', () => {
    it('throws ForbiddenException when a Super Administrator attempts to modify tenant CMS', async () => {
      const mockReq = {
        user: {
          id: 1,
          isSuperUser: true,
          email: 'admin@platform.com',
        },
      };

      await expect(
        controller.updateSite(mockReq, { siteTitle: 'Overwritten by Super Admin' }),
      ).rejects.toThrow(ForbiddenException);

      expect(cmsService.updateSite).not.toHaveBeenCalled();
    });

    it('throws ForbiddenException when user has no bound orgId', async () => {
      const mockReq = {
        user: {
          id: 2,
          isSuperUser: false,
          orgId: null,
        },
      };

      await expect(
        controller.updateSite(mockReq, { siteTitle: 'Orphan Edit' }),
      ).rejects.toThrow(ForbiddenException);

      expect(cmsService.updateSite).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when user is not present in request', async () => {
      const mockReq = {};

      await expect(
        controller.updateSite(mockReq, { siteTitle: 'Anonymous Edit' }),
      ).rejects.toThrow(UnauthorizedException);

      expect(cmsService.updateSite).not.toHaveBeenCalled();
    });

    it('permits Organization Administrator to update site settings for their bound orgId', async () => {
      const mockReq = {
        user: {
          id: 20,
          isSuperUser: false,
          isOrgAdmin: true,
          orgId: 14,
        },
      };

      const result = await controller.updateSite(mockReq, {
        siteTitle: 'Official Apex Site',
        tagline: 'Enterprise Cloud',
      });

      expect(cmsService.updateSite).toHaveBeenCalledWith(14, {
        siteTitle: 'Official Apex Site',
        tagline: 'Enterprise Cloud',
      });
      expect(result).toEqual({
        orgId: 14,
        siteTitle: 'Official Apex Site',
        tagline: 'Enterprise Cloud',
      });
    });
  });
});
