/**
 * Resolves the tenant organization ID from request user context.
 * - For Super Admins: allows viewing a specific company via query param, or all companies if omitted.
 * - For Regular Users & Org Admins: strictly restricts queries to their authenticated company org_id.
 */
export function getTenantOrgId(req: any): string | undefined {
  if (req?.user?.isSuperUser) {
    return req?.query?.org_id || undefined;
  }
  const org =
    req?.user?.org_id ||
    req?.user?.orgId ||
    req?.user?.organization_id ||
    req?.user?.organization?.id;
  return org ? String(org) : undefined;
}

/**
 * Returns authenticated user email or username for audit trail stamping.
 */
export function getUserAuditEmail(req: any): string | undefined {
  return req?.user?.email || req?.user?.username || undefined;
}
