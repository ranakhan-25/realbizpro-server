export interface MenuNode {
  label: string;
  slug: string;
  path: string;
  children?: MenuNode[];
}

const ACRONYMS: Record<string, string> = {
  boq: 'BOQ',
  kpi: 'KPI',
  rfq: 'RFQ',
  grn: 'GRN',
  hrm: 'HRM',
  crm: 'CRM',
  zkteco: 'ZKTeco',
  cr: 'CR',
  lams: 'LAMS',
  vs: 'vs',
  and: '&',
};

export function slugToLabel(slug: string): string {
  if (slug === 'sub-category') return 'Sub-Category';
  return slug
    .split('-')
    .map((w) => ACRONYMS[w.toLowerCase()] ?? w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function parseTree(text: string): MenuNode[] {
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  const root: MenuNode[] = [];
  const stack: { depth: number; node: MenuNode }[] = [];

  for (const raw of lines) {
    const depth = (raw.match(/^ */)?.[0].length ?? 0) / 2;
    const slug = raw.trim();
    while (stack.length && (stack[stack.length - 1]?.depth ?? -1) >= depth) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]?.node;
    const path = parent ? `${parent.path}/${slug}` : slug;
    const node: MenuNode = { label: slugToLabel(slug), slug, path };
    if (parent) {
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    } else {
      root.push(node);
    }
    stack.push({ depth, node });
  }
  return root;
}

const project = `
dashboard
projects
  project-type
  project
  site
  building
  floor
  unit-plot
  project-party
  project-agreement
  project-milestone
  project-task
  project-budget
  project-cost
  project-progress
  project-control
  report
    project-details
    at_a_glance_project_summary_report
    project-summary-report
    project-financial-report
    project-progress-report
    project-wise-income-statement
    site-wise-income-statement
contract
  customer-accounts
  supplier-accounts
  labour-work-bank
  contractor
investments
  investor
  configuration
share-project
  assign-share
  share-report
  share-collection-report
  penalty-report
  share-holders-point-report
  project-share-configuration
requisition
  material-requisition
  service-work-requisition
  fund-requisition
  fund-requisition-report
billing
  configuration
    category
    sub-category
    bill-item
    service-work-name
    boq-title
  bill-invoice
  contractor-bill
  labour-work-bill
  work-order
  contractor-work-order
  period-billing
  adjustment-billing
  quote
  labour-work-bill-report
flat-land
  flat
  land
    road
    block
    land-details
  booking
  sale-offer
  flat-land-sale
  flat-land-sale-report
  sale-collection-report
  plot-distribution-report
  aging-report
  installment-report
document
`;

const inventory = `
contracts
  supplier-accounts
products
  categories
  sub-categories
  brands
  units
  item-entry
purchase
  add-purchase
  purchase-list
sales
adjustment
  material-usage
  stock-transfer
material-requisition
reports
  purchase-details
  purchase-order-receive-details
  stock-report
  item-history-report
  item-wise-supplier-ledger
  material-usage-report
  material-comparison-report
`;

const accounts = `
dashboard
contract
  customer-account
  supplier-account
  labour-worker-contractor
employee
  department
  designation
  shift
  section
  unit
  employee-list
  employee-hierarchy
configuration
  chart-of-group
  chart-of-accounts
voucher
  expense
  receipt-voucher
  payment-voucher
  journal-voucher
  contra-voucher
bank-reconciliation
  bank-reconciliation-statement
  list-of-cheque-range
  list-of-cheque
billing
  configuration
    category
    sub-category
    bill-item
    service-work-name
    boq-title
  bill-invoice
  contractor-bill
  labour-work-bill
  work-order
  contractor-work-order
  period-billing
  adjustment-billing
  quote
  labour-worker-bill-report
assets
  asset-list
  item-empty
reports
  payable-report
  expense-report
  receipt-report
  receivable-report
  day-book
  receive-payment-statement
  receive-and-payment-summary
  cash-bank-books
  general-ledger
  income_statement
  cash-flow-statement
  fund-flow-summary
  trial_balance_summary
  balance_sheet_summary
  profit-loss-comprehensive-income
  statement-of-financial-position
  statement-of-changes-equity
  property-plant-equipment
  budget-vs-actual-expenses-vs-collection-report
`;

const hrm = `
dashboard
employee
  department
  designation
  shift
  shift-allocation
  bonus
  bonus-generate
  section
  unit
  employee-list
  employee-hierarchy
  Increment
  ID-Card-Generate
configuration
  month-configuration
  deduction-rules
  allowance-deduction
  salary-grade
  leave-type
  holiday
  zkteco-device-configuration
attendance
  attendance
  attendance-log
  pending-attendance
  attendance-reconciliations
pay-slip
  pay-slip-process
  pay-slip-details
  bank-pay-slip
leave-application
reports
  daily-attendance-report
  daily-manpower-report
  attendance-register
  attendance-summary
  attendance-details-report
  job-card
  leave-report
  leave-details-report
  salary-sheet
  salary-due-report
  deduction-report
kpi
  employee-call-report
  employee-task-report
  employee-kpi-setting
  reports
`;

const cr = `
dashboard
agreements
setups
recovery
receipt-voucher
overdue-list
reports
  realization-summary-report
  sale-collection-report
  aging-report
  installment-report
`;

const lams = `
dashboard
land-owners
acquisition-leads
negotiation-process
legal-documents
follow-up
`;

const crm = `
dashboard
configuration
  communication-status
  teams
  lead-category
  categories
  campaign
  profession
  lead-source
  sources
  offers
  area
  lead-stage
  stages
  project
  price-range
lead
  lead-list
  pipeline
  parties
  junk-lead
  transfer-history
call-center
  follow-up
  followups
  call-report
  call-report-details
  call-assign-history
task-visit
  task-visit-list
  visits
  deal-negotiation-activity
  task-visit-summary-report
  task-visit-details-report
property
  flat
  land
  booking
  sale-offer
  offers
  quotations
reports
  user-wise-report
  user-active-report
  sales-pipeline-funnel-report
  team-reports
  interested-flat-land-requirements
  sales-probability
  flat-land-sale-report
  missed-followup-visit-summary
  deal-negotiation-reports
kpi
  employee-kpi-setting
  reports
    employee-call-report
    team-call-report
`;

const procurement = `
dashboard
configuration
  products
    category
    sub-category
    brand
    unit
    item-entry
  asset
    asset-category
    asset-item-entry
requisition
  material-requisition
  asset-requisition
rfq
  request-for-quotation
  asset-request-for-quotation
purchase-order
  purchase-order-list
  asset-purchase-order-list
grn
  goods-receipt-note
  asset-goods-receipt-note
purchase-bill
  purchase-bill-invoice
  asset-purchase-bill-invoice
approvals
  procurement-approvals
vendors
  vendor-list
boq
  all-boq
equipment-hire
  hire-orders
  equipment-bills
  equipment-on-site
work-orders
  work-orders-list
  work-measurements
  work-bills
reports
  supplier-ledger
  purchase-summary
  inventory-status
`;

const customerService = `
dashboard
customers
  customer-360
  change-requests
documents
  center
  registration-tracking
  mutation-khatian-tracking
handover
  schedule
  inspection-snags
  possession-records
tickets
property-care
  warranty-dlp
  maintenance-requests
  work-orders-association
building-services
  utility-service
  security-service
  parking-service
  other-services
building-management
  service-charge
  building-committee
communication
  inbox-reminders
  site-visits-appointments
  feedback-surveys
reports
  collections-ageing
  service-ticket-sla
  handover-property-care
settings
  service-workflow-rules
`;

export const RAW_MENUS: Record<string, string> = {
  project,
  inventory,
  accounts,
  hrm,
  crm,
  cr,
  lams,
  procurement,
  'customer-service': customerService,
  customer_service: customerService,
};

const CACHED_TREES: Record<string, MenuNode[]> = {};

export function getFullMenuTree(moduleKey: string): MenuNode[] {
  const normKey = moduleKey.toLowerCase().trim();
  if (CACHED_TREES[normKey]) {
    return CACHED_TREES[normKey];
  }
  const raw = RAW_MENUS[normKey];
  if (!raw) return [];
  const parsed = parseTree(raw);
  CACHED_TREES[normKey] = parsed;
  return parsed;
}

function pruneTree(nodes: MenuNode[], allowedPaths: Set<string>): MenuNode[] {
  const out: MenuNode[] = [];
  for (const n of nodes) {
    const kids = n.children ? pruneTree(n.children, allowedPaths) : undefined;
    const cleanPath = n.path.toLowerCase().replace(/^\/+|\/+$/g, '');
    const selfAllowed =
      allowedPaths.has('*') ||
      allowedPaths.has(cleanPath) ||
      cleanPath === 'dashboard';

    // A node is included if it has visible children, or if it is a leaf node that is allowed
    const hasKids = kids && kids.length > 0;
    const isLeaf = !n.children || n.children.length === 0;

    if (hasKids) {
      out.push({
        ...n,
        children: kids,
      });
    } else if (isLeaf && selfAllowed) {
      out.push({
        ...n,
      });
    }
  }
  return out;
}

export function getModuleMenuTree(moduleKey: string, allowedRoutes?: string[]): MenuNode[] {
  const fullTree = getFullMenuTree(moduleKey);
  if (!allowedRoutes || allowedRoutes.includes('*')) {
    return fullTree;
  }
  const allowedSet = new Set(
    allowedRoutes.map((r) => r.toLowerCase().replace(/^\/+|\/+$/g, ''))
  );
  return pruneTree(fullTree, allowedSet);
}
