import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateModuleTreeDto, FeatureNodeDto } from './module-tree.dto';

describe('ModuleTreeDto Validation', () => {
  it('validates a complete module tree payload with nested features containing moduleId and uuid', async () => {
    const rawPayload = {
      id: 5,
      uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      name: 'Finance Module',
      code: 'FINANCE',
      pathRoute: '/dashboard/accounts',
      icon: 'Layers',
      description: 'Financial accounting module',
      displayOrder: 1,
      isActive: true,
      features: [
        {
          id: 10,
          uuid: 'f1e2d3c4-b5a6-7890-1234-567890abcdef',
          moduleId: 5,
          moduleUuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          name: 'General Ledger',
          code: 'ACC_GL',
          routePath: '/dashboard/accounts/gl',
          actionType: 'read',
          description: 'View general ledger',
          displayOrder: 1,
          isActive: true,
        },
        {
          id: 11,
          uuid: 'f2e3d4c5-b6a7-8901-2345-678901bcdefa',
          moduleId: 5,
          name: 'Voucher Entry',
          code: 'ACC_VOUCHER_CREATE',
          routePath: '/dashboard/accounts/voucher/create',
          actionType: 'write',
          displayOrder: 2,
          isActive: true,
        },
      ],
    };

    const instance = plainToInstance(CreateModuleTreeDto, rawPayload);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBe(0);
  });

  it('fails when feature name or code are empty', async () => {
    const invalidPayload = {
      name: 'Invalid Module',
      code: 'INVALID',
      features: [
        {
          name: '',
          code: '',
        },
      ],
    };

    const instance = plainToInstance(CreateModuleTreeDto, invalidPayload);
    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('features');
  });
});
