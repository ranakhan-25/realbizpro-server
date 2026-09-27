import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { SendEmailDto } from './dto/send-email.dto';
import {
  EmailOptions,
  EmailService,
} from './email.service';

@ApiTags('System | Email')
@Controller('email')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  @Post('send')
  // @Permissions('email:send')
  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  async sendEmail(
    @Body() sendEmailDto: SendEmailDto,
  ) {
    const emailOptions: EmailOptions = {
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      template: sendEmailDto.template,
      context: sendEmailDto.context,
      text: sendEmailDto.text,
      html: sendEmailDto.html,
    };

    const success =
      await this.emailService.sendMail(
        emailOptions,
      );

    return {
      success,
      message: success
        ? 'Email sent successfully'
        : 'Failed to send email',
    };
  }

  @Post('send-notification')
  @Permissions('email_send')
  @ApiOperation({
    summary: 'Send notification email',
  })
  async sendNotification(
    @Body()
    body: {
      to: string;
      title: string;
      message: string;
    },
  ) {
    const success =
      await this.emailService.sendNotificationEmail(
        body.to,
        body.title,
        body.message,
      );

    return {
      success,
      message: success
        ? 'Notification sent successfully'
        : 'Failed to send notification',
    };
  }
}
