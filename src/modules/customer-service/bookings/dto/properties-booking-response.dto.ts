import { HandoverStatus } from 'src/database/models/customer-service/cs_booking_handover.model';

export interface BookingStatsData {
  total_booked_units: number;
  ready_for_snagging: number;
  dlp_active: number;
  handed_over: number;
  under_construction: number;
  total_portfolio_valuation: number;
  total_portfolio_valuation_formatted: string;
  total_collected_amount: number;
  total_collected_amount_formatted: string;
  total_outstanding_due: number;
  total_outstanding_due_formatted: string;
  deleted_count?: number;
}

export interface BookingListItem {
  id: string;
  uuid: string;
  code: string;
  customer_id: string;
  customer_uuid?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  project_id?: string;
  project_name?: string;
  project_code?: string;
  unit_id?: string;
  unit_type?: string;
  unit_number?: string;
  floor?: string;
  size_sqft?: number;
  total_price: number;
  booking_money: number;
  paid_amount: number;
  due_amount: number;
  payment_status:
    'Paid' | 'Partial' | 'Due' | 'Overdue';
  next_installment_date?: string;
  handover_status: HandoverStatus;
  booking_date: string;
  possession_date?: string;
  dlp_start_date?: string;
  dlp_expiry_date?: string;
  key_register_no?: string;
  possession_cert_no?: string;
  total_snags_reported: number;
  total_snags_resolved: number;
  open_snags: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface BookingTabCounts {
  all: number;
  snagging: number;
  dlp: number;
  handedover: number;
  under_construction: number;
}

export interface BookingPaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next_page: boolean;
  has_previous_page: boolean;
}

export interface BookingListResponse {
  items: BookingListItem[];
  tab_counts: BookingTabCounts;
  meta: BookingPaginationMeta;
}

export interface Booking360Detail {
  booking: {
    id: string;
    uuid: string;
    code: string;
    booking_date: string;
    sales_by?: string;
    status: string;
    rate: number;
    subtotal: number;
    other_cost: number;
    parking: number;
    utility_charge: number;
    discount: number;
    grand_total: number;
    paid: number;
    due: number;
    payment_status: string;
    attachment?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
  };
  unit: {
    unit_id?: string;
    unit_number?: string;
    unit_type?: string;
    floor?: string;
    size_sqft?: number;
    bedroom?: number;
    bathroom?: number;
    facing?: string;
    amenities?: string;
    drawing?: string;
    dining?: string;
    kitchen?: string;
    balcony?: string;
    parking?: string;
    basement?: string;
    status?: string;
  };
  project: {
    id?: number;
    uuid?: string;
    code?: string;
    name?: string;
    project_type?: string;
    location?: string;
    description?: string;
  };
  customer: {
    customer_id?: string;
    customer_uuid?: string;
    customer_name: string;
    customer_phone?: string;
    customer_email?: string;
    customer_address?: string;
    nid_number?: string;
    tin_number?: string;
    nominee_name?: string;
    nominee_relation?: string;
  };
  handover: {
    handover_status: HandoverStatus;
    possession_date?: string;
    dlp_start_date?: string;
    dlp_expiry_date?: string;
    key_register_no?: string;
    possession_cert_no?: string;
    total_snags_reported: number;
    total_snags_resolved: number;
    open_snags: number;
    remarks?: string;
  };
  cost_breakdown: {
    rate: number;
    subtotal: number;
    parking: number;
    utility_charge: number;
    other_cost: number;
    discount: number;
    grand_total: number;
    paid_amount: number;
    due_amount: number;
  };
  milestone_history: Array<{
    installment_no: number;
    title: string;
    due_date: string;
    payable_amount: number;
    paid_amount: number;
    due_amount: number;
    status: string;
  }>;
  snag_summary: {
    total_snags_reported: number;
    total_snags_resolved: number;
    open_snags: number;
  };
}

export interface DemandLetterPreview {
  booking_code: string;
  booking_uuid: string;
  customer_name: string;
  customer_phone?: string;
  project_name?: string;
  unit_number?: string;
  demand_letter_reference: string;
  generation_date: string;
  current_milestone: {
    installment_no?: number;
    title: string;
    due_date?: string;
    payable_amount: number;
    paid_amount: number;
    due_amount: number;
    is_overdue: boolean;
  };
  financial_summary: {
    grand_total: number;
    total_paid: number;
    total_due: number;
  };
  bank_instructions: {
    bank_name: string;
    account_name: string;
    account_number: string;
    branch_name: string;
    routing_number: string;
    payment_methods: string[];
  };
}
