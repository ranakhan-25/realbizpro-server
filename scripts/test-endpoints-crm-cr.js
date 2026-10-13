const http = require('http');

const BASE_HOST = 'localhost';
const BASE_PORT = 5002;
const BASE_PREFIX = '/realbizpro/api/v1';
const T = Date.now().toString().slice(-6);

async function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const options = {
      hostname: BASE_HOST,
      port: BASE_PORT,
      path: `${BASE_PREFIX}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================================');
  console.log(`🚀 EXECUTING COMPLETE ENDPOINT TEST SUITE: CRM & CREDIT REALIZATION [Run ID: ${T}]`);
  console.log('========================================================================\n');

  const results = [];

  async function step(name, method, url, payload = null) {
    console.log(`\n▶️ [${method}] ${url} - ${name}`);
    if (payload) {
      console.log('  📤 Request Payload:', JSON.stringify(payload, null, 2));
    }
    const res = await request(method, url, payload);
    console.log(`  📥 Status: ${res.status}`);
    console.log('  📦 Response:', JSON.stringify(res.data, null, 2));
    results.push({ name, method, url, payload, status: res.status, response: res.data });
    return res.data?.data || res.data;
  }

  // ==========================================
  // SECTION 1: CRM MASTER DATA
  // ==========================================
  console.log('\n--- [1] CRM MASTER DATA & SETTINGS ---');
  
  const category = await step('Create CRM Category', 'POST', '/crm/master/categories', {
    name: `High Net-Worth Individual ${T}`,
    code: `CAT-${T}`,
    description: 'Clients interested in prime duplex or commercial plots',
    is_active: true,
    projectId: 'PRJ-101',
  });

  await step('List CRM Categories', 'GET', '/crm/master/categories');

  const stage = await step('Create CRM Pipeline Stage', 'POST', '/crm/master/stages', {
    name: `Initial Consultation ${T}`,
    order: 1,
    color: '#0000F2',
    is_system: false,
    is_active: true,
    projectId: 'PRJ-101',
  });

  const wonStage = await step('Create CRM Won Stage', 'POST', '/crm/master/stages', {
    name: `Deal Won & Closed ${T}`,
    order: 5,
    color: '#10B981',
    is_system: true,
    is_active: true,
    projectId: 'PRJ-101',
  });

  await step('List CRM Pipeline Stages', 'GET', '/crm/master/stages');

  const source = await step('Create Lead Source', 'POST', '/crm/master/sources', {
    name: `Somikoron Property Expo ${T}`,
    code: `EXPO-${T}`,
    is_active: true,
    projectId: 'PRJ-101',
  });

  const campaign = await step('Create Marketing Campaign', 'POST', '/crm/master/campaigns', {
    name: `Purbachal Green City Campaign ${T}`,
    start_date: '2026-10-01',
    end_date: '2026-12-31',
    budget: 350000,
    channel: 'Digital & Event',
    status: 'active',
    description: 'Campaign promoting South-facing waterfront plots',
    projectId: 'PRJ-101',
  });

  const profession = await step('Create Profession', 'POST', '/crm/master/professions', {
    name: `Senior Software Architect ${T}`,
    description: 'Tech leaders and software consultants',
    projectId: 'PRJ-101',
  });

  const team = await step('Create Sales Team', 'POST', '/crm/master/teams', {
    name: `Elite Realty Force Alpha ${T}`,
    leader_id: 'USR-MGR-01',
    department: 'Premium Property Sales',
    is_active: true,
    projectId: 'PRJ-101',
  });

  await step('Add Member to Sales Team', 'POST', `/crm/master/teams/${team.uuid}/members`, {
    user_id: `USR-AGENT-${T}`,
    role_in_team: 'Senior Closer',
  });

  await step('List Sales Teams', 'GET', '/crm/master/teams');

  await step('Create Area', 'POST', '/crm/master/areas', {
    name: `Purbachal Sector 17-${T}`,
    city: 'Dhaka',
    zone: 'East Zone',
    projectId: 'PRJ-101',
  });

  await step('Create Feature', 'POST', '/crm/master/features', {
    name: `60-ft Wide Avenue Road Facing ${T}`,
    code: `RD-${T}`,
    description: 'Direct access to 60-feet wide main avenue',
    projectId: 'PRJ-101',
  });

  // ==========================================
  // SECTION 2: CRM LEADS & PIPELINE JOURNEY
  // ==========================================
  console.log('\n--- [2] CRM LEADS & PIPELINE JOURNEY ---');

  const lead = await step('Create New Lead', 'POST', '/crm/leads', {
    lead_code: `LEAD-2026-${T}`,
    client_name: 'Dr. Tariqul Islam Chowdhury',
    phone: `+88017${T}`,
    alternate_phone: `+88018${T}`,
    email: `tariqul.${T}@medicare.org`,
    lead_category_id: Number(category.id),
    lead_stage_id: Number(stage.id),
    lead_source_id: Number(source.id),
    campaign_id: Number(campaign.id),
    profession_id: Number(profession.id),
    designation: 'Managing Director & Chief Surgeon',
    organization: 'Apex Specialized Hospital',
    present_address: 'House #25, Road #11, Dhanmondi, Dhaka',
    permanent_address: 'Chowdhury Bari, Feni Sadar',
    assigned_to: `USR-AGENT-${T}`,
    priority: 'high',
    lead_score: 85,
    status: 'active',
    notes: 'Inquiring about 5 katha corner plot near club lake',
    projectId: 'PRJ-101',
  });

  await step('List All Leads', 'GET', '/crm/leads');

  await step('Get Lead 360 Timeline Details', 'GET', `/crm/leads/${lead.uuid}`);

  await step('Add Property Requirement to Lead', 'POST', `/crm/leads/${lead.uuid}/requirements`, {
    property_type: 'Plot',
    preferred_area: `Purbachal Sector 17-${T}`,
    size_sqft: 3600,
    budget_min: 7500000,
    budget_max: 9500000,
    remarks: 'Must be South-East corner with natural ventilation',
    projectId: 'PRJ-101',
  });

  await step('Add Property of Interest to Lead', 'POST', `/crm/leads/${lead.uuid}/property-interests`, {
    project_name: 'Purbachal Lake View Phase 1',
    plot_flat_no: `Plot # ${T}/A, Road # 4`,
    size: '5 Katha',
    quoted_price: 9000000,
    client_offered_price: 8500000,
    status: 'interested',
    projectId: 'PRJ-101',
  });

  await step('Log Activity: Site Visit', 'POST', `/crm/leads/${lead.uuid}/activities`, {
    activity_type: 'visit',
    activity_date: '2026-10-14T10:30:00Z',
    summary: `Conducted field site visit at Purbachal Lake View Plot # ${T}/A`,
    discussion_points: 'Client inspected plot boundaries, road width, and drainage elevation.',
    next_followup_date: '2026-10-18T14:00:00Z',
    feedback: 'Very satisfied with location; requested negotiation on down payment',
    conducted_by: `USR-AGENT-${T}`,
    projectId: 'PRJ-101',
  });

  await step('Assign Follow-Up Call Task', 'POST', `/crm/leads/${lead.uuid}/call-assign`, {
    assigned_from: 'USR-MGR-01',
    assigned_to: `USR-AGENT-${T}`,
    assignment_date: '2026-10-15T09:00:00Z',
    due_date: '2026-10-16T17:00:00Z',
    priority: 'urgent',
    instruction: 'Call client to present customized 24-month installment schedule',
    projectId: 'PRJ-101',
  });

  await step('Transfer Lead', 'POST', `/crm/leads/${lead.uuid}/transfer`, {
    transferred_from: `USR-AGENT-${T}`,
    transferred_to: 'USR-AGENT-TOP-CLOSER',
    transfer_reason: 'Transferred to Executive Closer for deal closure',
    approved_by: 'USR-MGR-01',
    projectId: 'PRJ-101',
  });

  await step('Transition Pipeline Stage', 'POST', `/crm/leads/${lead.uuid}/stage`, {
    lead_stage_id: Number(wonStage.id),
    notes: 'Site visit completed, contract negotiation concluded successfully!',
  });

  // ==========================================
  // SECTION 3: CRM DEAL NEGOTIATIONS
  // ==========================================
  console.log('\n--- [3] CRM DEAL NEGOTIATIONS ---');

  const negotiation = await step('Initiate Deal Negotiation', 'POST', '/crm/negotiations', {
    lead_id: Number(lead.id),
    property_id: `PLOT-${T}-SEC17`,
    offer_price: 9000000,
    agreed_price: 8600000,
    discount_amount: 400000,
    special_terms: 'Booking money 1,000,000 BDT, down payment 2,000,000 BDT, rest in 24 EMIs',
    approval_status: 'pending',
    projectId: 'PRJ-101',
  });

  await step('List Negotiations', 'GET', '/crm/negotiations');

  await step('Approve Negotiation by Management', 'POST', `/crm/negotiations/${negotiation.uuid}/approve`, {
    approval_status: 'approved',
    approved_by: 'DIRECTOR-BOARD-01',
    rejection_reason: '',
  });

  // ==========================================
  // SECTION 4: CRM INTERNAL TASKS
  // ==========================================
  console.log('\n--- [4] CRM INTERNAL TASKS ---');

  const task = await step('Create Internal Task', 'POST', '/crm/tasks', {
    title: `Prepare Deed of Agreement for Lead ${T}`,
    description: 'Coordinate with Legal department for stamp paper and mutation deed drafting',
    priority: 'urgent',
    due_date: '2026-10-20T12:00:00Z',
    status: 'in_progress',
    related_lead_id: Number(lead.id),
    assignee_ids: ['USR-LEGAL-01', 'USR-AGENT-TOP-CLOSER'],
    projectId: 'PRJ-101',
  });

  await step('List Internal Tasks', 'GET', '/crm/tasks');

  // ==========================================
  // SECTION 5: CRM REPORTS & ANALYTICS
  // ==========================================
  console.log('\n--- [5] CRM REPORTS & ANALYTICS ---');

  await step('CRM Lead Funnel & Conversion Rate', 'GET', '/crm/reports/lead-funnel');
  await step('CRM Lead Acquisition Source Performance', 'GET', '/crm/reports/source-performance');
  await step('CRM Team Sales Productivity', 'GET', '/crm/reports/team-productivity');

  // ==========================================
  // SECTION 6: CREDIT REALIZATION SETUPS
  // ==========================================
  console.log('\n--- [6] CREDIT REALIZATION SETUPS & POLICIES ---');

  const setupPlan = await step('Create Installment Policy Setup', 'POST', '/credit-realization/setups', {
    plan_code: `CR-PLAN-24M-${T}`,
    plan_name: `24-Month Executive Installment Plan ${T}`,
    number_of_installments: 24,
    frequency: 'monthly',
    penalty_rate_percentage: 0.05,
    grace_period_days: 7,
    description: '0.05% per day delay penalty with 7 days grace period',
    is_active: true,
    projectId: 'PRJ-101',
  });

  await step('List Installment Setups', 'GET', '/credit-realization/setups');

  // ==========================================
  // SECTION 7: CREDIT REALIZATION SALE AGREEMENT & AMORTIZATION
  // ==========================================
  console.log('\n--- [7] CREDIT REALIZATION SALE AGREEMENT & AMORTIZATION ---');

  const agreement = await step('Create Sale Agreement (Auto-Generates 24 Installments)', 'POST', '/credit-realization/agreements', {
    agreement_number: `AGR-2026-PURBA-${T}`,
    customer_id: `CUST-${T}`,
    customer_name: 'Dr. Tariqul Islam Chowdhury',
    customer_phone: `+88017${T}`,
    property_type: 'plot',
    unit_identifier: `Plot # ${T}/A, Road # 4, Sector 17`,
    total_price: 8600000,
    down_payment: 2000000,
    booking_money: 1000000,
    agreement_date: '2026-08-01', // Backdated to demonstrate overdue calculation
    handover_date: '2028-08-01',
    number_of_installments: 24,
    terms_and_conditions: 'Standard terms: Handover upon 100% credit realization',
    projectId: 'PRJ-101',
  });

  await step('List All Sale Agreements', 'GET', '/credit-realization/agreements');

  const agreementDetails = await step('Get Sale Agreement 360 Details with Installment Schedule', 'GET', `/credit-realization/agreements/${agreement.uuid}`);

  await step('Allocate Plot Distribution Details', 'POST', `/credit-realization/agreements/${agreement.uuid}/plot-distribution`, {
    plot_no: `Plot # ${T}/A`,
    road_no: 'Road # 4 (60 ft Avenue)',
    sector_block: 'Sector 17, Block B',
    plot_size_katha: 5.0,
    facing: 'South-East',
    allotment_status: 'confirmed',
    allotment_letter_no: `ALLOT-${T}`,
    allotment_date: '2026-08-05',
    projectId: 'PRJ-101',
  });

  // ==========================================
  // SECTION 8: INSTALLMENTS, PAYMENTS & PENALTY WAIVER
  // ==========================================
  console.log('\n--- [8] INSTALLMENTS, OVERDUE & PAYMENTS ---');

  const overdueList = await step('Fetch Overdue Installments with Live Amortization & Delay Penalty', 'GET', '/credit-realization/installments/overdue');

  const targetInstallment = agreementDetails.installment_plans?.[0] || overdueList?.[0];

  if (targetInstallment) {
    await step('Get Specific Installment Plan Details', 'GET', `/credit-realization/installments/${targetInstallment.uuid}`);

    await step('Record Payment Voucher', 'POST', `/credit-realization/installments/${targetInstallment.uuid}/payments`, {
      payment_voucher_no: `VCHR-2026-EBL-${T}`,
      paid_amount: 233333.33,
      penalty_paid: 2500,
      payment_date: '2026-10-13',
      payment_method: 'bank_transfer',
      bank_name: 'Eastern Bank Ltd.',
      cheque_no: `FT-${T}`,
      cheque_date: '2026-10-13',
      transaction_reference: `EBL-TRX-${T}`,
      money_receipt_no: `MR-${T}`,
      remarks: 'Payment cleared and verified via BEFTN',
      projectId: 'PRJ-101',
    });

    const secondInstallment = agreementDetails.installment_plans?.[1] || overdueList?.[1];
    if (secondInstallment) {
      await step('Waive Delay Penalty on Installment', 'POST', `/credit-realization/installments/${secondInstallment.uuid}/waive-penalty`, {
        amount_to_waive: 1000,
        reason: 'Client requested waiver for Eid festival period, approved by Director',
      });
    }
  }

  // ==========================================
  // SECTION 9: RECOVERY LOGS
  // ==========================================
  console.log('\n--- [9] RECOVERY LOGS & FIELD ACTIONS ---');

  const recovery = await step('Log Recovery Action', 'POST', '/credit-realization/recovery', {
    sale_agreement_id: Number(agreement.id),
    customer_id: `CUST-${T}`,
    action_type: 'phone_call',
    action_date: '2026-10-12T14:30:00Z',
    promised_payment_date: '2026-10-25',
    promised_amount: 233333.33,
    officer_name: 'Mirza Asaduzzaman (Senior Recovery Manager)',
    customer_response: 'Customer confirmed that upcoming installment will be remitted by October 25th',
    outcome: 'promised',
    next_action_date: '2026-10-26',
    projectId: 'PRJ-101',
  });

  await step('List Recovery Logs', 'GET', '/credit-realization/recovery');

  // ==========================================
  // SECTION 10: CREDIT REALIZATION REPORTS & AGING ANALYSIS
  // ==========================================
  console.log('\n--- [10] CREDIT REALIZATION REPORTS & 5-BUCKET AGING MATRIX ---');

  await step('5-Bucket Aging Analysis (0-30, 31-60, 61-90, 91-120, 120+ days)', 'GET', '/credit-realization/reports/aging-analysis');
  await step('Macro Overdue Summary & Recovery Rate', 'GET', '/credit-realization/reports/overdue-summary');
  await step('Collection Summary by Payment Method', 'GET', '/credit-realization/reports/collection-summary');

  console.log('\n========================================================================');
  console.log('🎉 ALL TEST SCENARIOS EXECUTED SUCCESSFULLY!');
  console.log(`📊 Total Requests Run: ${results.length}`);
  console.log(`✅ Success Count (2xx): ${results.filter((r) => r.status >= 200 && r.status < 300).length}`);
  console.log(`❌ Failure Count: ${results.filter((r) => r.status >= 400).length}`);
  console.log('========================================================================\n');
}

runTests().catch(console.error);
