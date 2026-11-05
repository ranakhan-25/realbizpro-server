import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SysSubscriptionPayment } from '../../../database/models/system/sys_subscription_payment.model';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(SysSubscriptionPayment)
    private paymentModel: typeof SysSubscriptionPayment,
  ) {}

  async getPaymentForInvoice(tranId: string): Promise<SysSubscriptionPayment> {
    const payment = await this.paymentModel.findOne({
      where: { tranId },
      include: [
        {
          association: 'plan',
          attributes: [
            'id', 'name', 'code', 'description',
            'monthlyPrice', 'yearlyPrice', 'currency',
          ],
          required: false,
        },
        {
          association: 'organization',
          attributes: [
            'id', 'name', 'code', 'email', 'phone', 'address',
            'subscriptionStartDate', 'subscriptionEndDate', 'subscriptionStatus',
          ],
          required: false,
        },
        {
          association: 'user',
          attributes: ['id', 'name', 'email'],
          required: false,
        },
      ],
    });

    if (!payment) {
      throw new NotFoundException(`Transaction ${tranId} not found`);
    }
    return payment;
  }

  generateInvoiceHtml(payment: SysSubscriptionPayment): string {
    const org = (payment as any).organization;
    const plan = (payment as any).plan;
    const user = (payment as any).user;

    const formatDate = (d?: Date | string | null) => {
      if (!d) return 'N/A';
      return new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const formatDateTime = (d?: Date | string | null) => {
      if (!d) return 'N/A';
      return new Date(d).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const statusColor = {
      VALID: '#10b981',
      PENDING: '#f59e0b',
      FAILED: '#ef4444',
      CANCELLED: '#6b7280',
      EXPIRED: '#6b7280',
    }[payment.status] ?? '#6b7280';

    const billingCycleLabel: Record<string, string> = {
      monthly: 'Monthly (30 Days)',
      quarterly: 'Quarterly (90 Days)',
      half_yearly: 'Half Yearly (180 Days)',
      yearly: 'Yearly (365 Days)',
    };

    const cycleLabel = billingCycleLabel[payment.billingCycle] ?? payment.billingCycle;
    const amount = Number(payment.amount).toFixed(2);
    const invoiceNumber = `INV-${payment.tranId}`;
    const issuedOn = formatDateTime(payment.paymentCompletedAt ?? payment.paymentInitiatedAt);

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Subscription Invoice ${invoiceNumber}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #f1f5f9;
    color: #1e293b;
    min-height: 100vh;
    padding: 40px 20px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .invoice-wrapper {
    max-width: 760px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 32px rgba(0,0,0,.08);
    overflow: hidden;
  }
  /* ── Header Band ── */
  .header {
    background: linear-gradient(135deg, #0000F2 0%, #3B82F6 100%);
    color: #fff;
    padding: 36px 40px 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }
  .brand { display: flex; flex-direction: column; gap: 4px; }
  .brand-name { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
  .brand-sub { font-size: 12px; opacity: .75; font-weight: 500; letter-spacing: .5px; }
  .invoice-meta { text-align: right; }
  .invoice-label { font-size: 11px; opacity: .7; text-transform: uppercase; letter-spacing: 1px; }
  .invoice-number { font-size: 18px; font-weight: 700; margin-top: 2px; }
  .invoice-date { font-size: 12px; opacity: .8; margin-top: 4px; }
  /* ── Status Banner ── */
  .status-band {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 12px 40px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    letter-spacing: .3px;
  }
  .status-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.8); }
  .status-note { font-size: 12px; color: #64748b; }
  /* ── Body ── */
  .body { padding: 36px 40px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 32px; }
  .info-block { }
  .info-block-title {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 10px;
  }
  .info-line { font-size: 13px; color: #334155; margin-bottom: 4px; }
  .info-line strong { color: #0f172a; font-weight: 600; }
  /* ── Line Items Table ── */
  .table-wrap { margin-bottom: 28px; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead { background: #f1f5f9; }
  thead th { padding: 12px 16px; text-align: left; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .6px; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  tbody td { padding: 14px 16px; vertical-align: middle; border-bottom: 1px solid #f1f5f9; color: #334155; }
  tbody tr:last-child td { border-bottom: none; }
  .item-name { font-weight: 600; color: #0f172a; }
  .item-code { font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 2px; }
  td.right, th.right { text-align: right; }
  /* ── Totals ── */
  .totals { display: flex; justify-content: flex-end; margin-bottom: 28px; }
  .totals-box { width: 300px; }
  .totals-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; }
  .totals-row:last-child { border-bottom: none; border-top: 2px solid #e2e8f0; padding-top: 12px; margin-top: 4px; }
  .totals-row.total-row { font-weight: 800; font-size: 16px; color: #0f172a; }
  /* ── Payment Details ── */
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 28px; }
  .detail-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 14px; }
  .detail-label { font-size: 10px; text-transform: uppercase; letter-spacing: .7px; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
  .detail-value { font-size: 13px; font-weight: 600; color: #0f172a; word-break: break-all; }
  /* ── Footer ── */
  .footer { border-top: 1px solid #e2e8f0; padding: 20px 40px; display: flex; align-items: center; justify-content: space-between; background: #f8fafc; }
  .footer-brand { font-size: 12px; font-weight: 700; color: #0000F2; letter-spacing: -.2px; }
  .footer-note { font-size: 11px; color: #94a3b8; }
  /* ── Print ── */
  @media print {
    body { background: #fff; padding: 0; }
    .invoice-wrapper { box-shadow: none; border-radius: 0; }
    .print-btn { display: none !important; }
  }
  .print-btn {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    gap: 10px;
  }
  .print-btn button {
    padding: 10px 28px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }
  .btn-print { background: #0000F2; color: #fff; }
  .btn-print:hover { background: #0000cc; }
</style>
</head>
<body>
<div class="invoice-wrapper">

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-name">RealBiz Pro</div>
      <div class="brand-sub">Subscription Invoice</div>
    </div>
    <div class="invoice-meta">
      <div class="invoice-label">Invoice Number</div>
      <div class="invoice-number">${invoiceNumber}</div>
      <div class="invoice-date">Issued: ${issuedOn}</div>
    </div>
  </div>

  <!-- Status Band -->
  <div class="status-band">
    <span class="status-pill" style="background:${statusColor}">
      <span class="status-dot"></span>
      ${payment.status}
    </span>
    <span class="status-note">
      ${
        payment.status === 'VALID'
          ? 'Payment confirmed and subscription activated.'
          : payment.status === 'PENDING'
          ? 'Payment is pending gateway confirmation.'
          : payment.status === 'CANCELLED'
          ? 'This payment was cancelled by the customer.'
          : payment.status === 'FAILED'
          ? 'Payment was not completed successfully.'
          : 'Transaction status: ' + payment.status
      }
    </span>
  </div>

  <!-- Body -->
  <div class="body">

    <!-- Bill To / From -->
    <div class="two-col">
      <div class="info-block">
        <div class="info-block-title">Bill To</div>
        <div class="info-line"><strong>${org?.name ?? 'N/A'}</strong></div>
        ${org?.code ? `<div class="info-line">Code: <strong>${org.code}</strong></div>` : ''}
        ${org?.email ? `<div class="info-line">${org.email}</div>` : ''}
        ${org?.phone ? `<div class="info-line">${org.phone}</div>` : ''}
        ${org?.address ? `<div class="info-line">${org.address}</div>` : ''}
        ${user?.name ? `<div class="info-line" style="margin-top:8px">Contact: <strong>${user.name}</strong></div>` : ''}
      </div>
      <div class="info-block">
        <div class="info-block-title">From</div>
        <div class="info-line"><strong>RealBiz Pro Platform</strong></div>
        <div class="info-line">Multi-Tenant SaaS ERP</div>
        <div class="info-line" style="margin-top:8px">Subscription Period</div>
        <div class="info-line"><strong>${formatDate(org?.subscriptionStartDate)}</strong></div>
        <div class="info-line">to <strong>${formatDate(org?.subscriptionEndDate)}</strong></div>
      </div>
    </div>

    <!-- Line Items -->
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th class="right">Billing Cycle</th>
            <th class="right">Duration</th>
            <th class="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-name">${plan?.name ?? 'Subscription Plan'}</div>
              <div class="item-code">${plan?.code ?? ''}</div>
            </td>
            <td class="right">${cycleLabel}</td>
            <td class="right">${payment.durationDays} Days</td>
            <td class="right"><strong>${payment.currency} ${amount}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>${payment.currency} ${amount}</span>
        </div>
        <div class="totals-row">
          <span>Tax / VAT</span>
          <span>Included</span>
        </div>
        <div class="totals-row total-row">
          <span>Total Paid</span>
          <span>${payment.currency} ${amount}</span>
        </div>
      </div>
    </div>

    <!-- Payment Details -->
    <div class="info-block-title" style="margin-bottom:12px">Payment Details</div>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Transaction ID</div>
        <div class="detail-value">${payment.tranId}</div>
      </div>
      ${payment.valId ? `<div class="detail-item">
        <div class="detail-label">Validation ID</div>
        <div class="detail-value">${payment.valId}</div>
      </div>` : ''}
      ${payment.bankTranId ? `<div class="detail-item">
        <div class="detail-label">Bank Transaction ID</div>
        <div class="detail-value">${payment.bankTranId}</div>
      </div>` : ''}
      ${payment.cardType ? `<div class="detail-item">
        <div class="detail-label">Payment Method</div>
        <div class="detail-value">${payment.cardType}${payment.cardBrand ? ` (${payment.cardBrand})` : ''}</div>
      </div>` : ''}
      <div class="detail-item">
        <div class="detail-label">Initiated At</div>
        <div class="detail-value">${formatDateTime(payment.paymentInitiatedAt)}</div>
      </div>
      ${payment.paymentCompletedAt ? `<div class="detail-item">
        <div class="detail-label">Completed At</div>
        <div class="detail-value">${formatDateTime(payment.paymentCompletedAt)}</div>
      </div>` : ''}
    </div>

  </div><!-- /body -->

  <!-- Footer -->
  <div class="footer">
    <span class="footer-brand">RealBiz Pro</span>
    <span class="footer-note">Thank you for your subscription. For support: support@realbizpro.com</span>
  </div>

</div><!-- /invoice-wrapper -->

<div class="print-btn">
  <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
</div>
</body>
</html>`;
  }
}
