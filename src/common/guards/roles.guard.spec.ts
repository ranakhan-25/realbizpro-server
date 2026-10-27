import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  const mockExecutionContext = (user: any) => {
    return {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;
  };

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = mockExecutionContext({ id: 1, role: 'staff' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows super admin user regardless of required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'roles') return ['super-admin'];
      return false;
    });
    const ctx = mockExecutionContext({ id: 1, isSuperUser: true });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows org-admin user when org-admin role is required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'roles') return ['org-admin'];
      return false;
    });
    const ctx = mockExecutionContext({ id: 2, isOrgAdmin: true });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('throws ForbiddenException when user lacks required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
      if (key === 'roles') return ['super-admin'];
      return false;
    });
    const ctx = mockExecutionContext({ id: 3, role: 'org-admin', isSuperUser: false });
    expect(() => guard.canActivate(ctx)).toThrow();
  });
});
