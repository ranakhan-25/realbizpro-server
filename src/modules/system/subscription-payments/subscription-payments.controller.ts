import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PaginateHelper } from '../../../common/helper/paginate.helper';
import { InvoiceService } from './invoice.service';
import { InitiateSubscriptionPaymentDto } from './dto/initiate-subscription-payment.dto';
import { QuerySubscriptionPaymentsDto } from './dto/query-subscription-payments.dto';
import { SubscriptionPaymentsService } from './subscription-payments.service';

@ApiTags('System | Subscription Payments')
@Controller('subscription-payments')
export class SubscriptionPaymentsController {
  private readonly frontendUrl: string;

  constructor(
    private readonly subscriptionPaymentsService: SubscriptionPaymentsService,
    private readonly invoiceService: InvoiceService,
    private readonly configService: ConfigService,
  ) {
    this.frontendUrl =
      this.configService.get<string>('APP_FRONTEND_URL') ||
      'http://localhost:3000';
  }

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate SSLCommerz payment session for subscription' })
  @ApiResponse({ status: 201, description: 'Payment session created successfully' })
  async initiate(
    @Req() req: any,
    @Body() dto: InitiateSubscriptionPaymentDto,
  ) {
    const user = req.user;
    return this.subscriptionPaymentsService.initiateCheckout(user, dto);
  }

  @Post('success')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz browser success return callback' })
  async handleSuccess(@Body() body: any, @Res() res: Response) {
    try {
      await this.subscriptionPaymentsService.processPaymentSuccess(body, false);
      const redirectUrl = `${this.frontendUrl}/admin/organization?payment=success&tran_id=${body.tran_id || ''}`;
      return res.redirect(redirectUrl);
    } catch (err: any) {
      const redirectUrl = `${this.frontendUrl}/admin/organization?payment=error&message=${encodeURIComponent(
        err?.message || 'Verification failed',
      )}`;
      return res.redirect(redirectUrl);
    }
  }

  @Post('fail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz browser fail return callback' })
  async handleFail(@Body() body: any, @Res() res: Response) {
    await this.subscriptionPaymentsService.processPaymentFail(body);
    const redirectUrl = `${this.frontendUrl}/admin/organization?payment=failed&tran_id=${body.tran_id || ''}`;
    return res.redirect(redirectUrl);
  }

  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz browser cancel return callback' })
  async handleCancel(@Body() body: any, @Res() res: Response) {
    await this.subscriptionPaymentsService.processPaymentCancel(body);
    const redirectUrl = `${this.frontendUrl}/admin/organization?payment=cancelled&tran_id=${body.tran_id || ''}`;
    return res.redirect(redirectUrl);
  }

  @Post('ipn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz server to server Instant Payment Notification (IPN)' })
  async handleIpn(@Body() body: any) {
    await this.subscriptionPaymentsService.processPaymentSuccess(body, true);
    return { status: 'OK', message: 'IPN processed successfully' };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment transaction history' })
  async getHistory(
    @Query() query: QuerySubscriptionPaymentsDto,
    @Req() req: any,
  ) {
    const [data, total] =
      await this.subscriptionPaymentsService.getHistory(query, req.user);
    return PaginateHelper.response(data, total, {
      limit: query.limit ?? 20,
      page: query.page ?? 1,
    });
  }

  @Post('cleanup-stale')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Expire stale pending transactions older than 30 minutes' })
  async cleanupStale() {
    const expiredCount =
      await this.subscriptionPaymentsService.expireStalePendingPayments();
    return { success: true, expiredCount };
  }

  @Get(':tranId/invoice')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'tranId', description: 'Transaction ID (e.g. RB_1234567890_ABCDE)' })
  @ApiQuery({ name: 'format', required: false, enum: ['html', 'pdf'], description: 'Response format. html (default) returns printable page; pdf returns binary PDF.' })
  @ApiOperation({ summary: 'Download subscription invoice as HTML or PDF' })
  @ApiResponse({ status: 200, description: 'Invoice HTML or PDF returned' })
  async getInvoice(
    @Param('tranId') tranId: string,
    @Query('format') format: string,
    @Res() res: Response,
  ) {
    const payment = await this.invoiceService.getPaymentForInvoice(tranId);
    const html = this.invoiceService.generateInvoiceHtml(payment);

    if (format === 'pdf') {
      // Lazy-load puppeteer to avoid startup cost
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const puppeteer = await import('puppeteer');
      const browser = await puppeteer.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="invoice-${tranId}.pdf"`,
        );
        res.send(Buffer.from(pdfBuffer));
      } finally {
        await browser.close();
      }
      return;
    }

    // Default: serve the printable HTML page
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="invoice-${tranId}.html"`,
    );
    res.send(html);
  }
}
