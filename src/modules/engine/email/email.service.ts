import {
  ISendMailOptions,
  MailerService,
} from '@nestjs-modules/mailer';
import { existsSync } from 'fs';
import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(
    EmailService.name,
  );

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(
    emailOptions: EmailOptions,
  ): Promise<boolean> {
    try {
      if (
        emailOptions.template &&
        !this.templateExists(
          emailOptions.template,
        )
      ) {
        this.logger.warn(
          `Email template "${emailOptions.template}" not found. Skipping email send.`,
        );
        return false;
      }

      console.log({
        emailOptions,
      });

      const mailOptions: ISendMailOptions = {
        to: emailOptions.to,
        subject: emailOptions.subject,
        template: emailOptions.template,
        context: emailOptions.context,
        text: emailOptions.text,
        html: emailOptions.html,
        attachments: emailOptions.attachments,
      };

      await this.mailerService.sendMail(
        mailOptions,
      );
      this.logger.log(
        `Email sent successfully to: ${emailOptions.to}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${emailOptions.to}:`,
        error,
      );
      return false;
    }
  }

  private templateExists(
    templateName: string,
  ): boolean {
    const candidatePaths = [
      join(
        process.cwd(),
        'dist',
        'templates',
        `${templateName}.hbs`,
      ),
      join(
        process.cwd(),
        'src',
        'modules',
        'engine',
        'email',
        'templates',
        `${templateName}.hbs`,
      ),
      join(
        __dirname,
        'templates',
        `${templateName}.hbs`,
      ),
    ];

    return candidatePaths.some((path) =>
      existsSync(path),
    );
  }

  // Common email templates
  async sendWelcomeEmail(
    to: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendMail({
      to,
      subject: 'Welcome to Our Platform',
      template: 'welcome',
      context: {
        userName,
        loginUrl: `${this.configService.get('app.frontendDomain')}/login`,
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    userName: string,
  ): Promise<boolean> {
    const resetUrl = `${this.configService.get('app.frontendDomain')}/reset-password?token=${resetToken}`;

    return this.sendMail({
      to,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        userName,
        resetUrl,
        expirationTime: '1 hour',
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
    userName: string,
  ): Promise<boolean> {
    const verificationUrl = `${this.configService.get('app.frontendDomain')}/verify-email?token=${verificationToken}`;

    return this.sendMail({
      to,
      subject: 'Email Verification',
      template: 'email-verification',
      context: {
        userName,
        verificationUrl,
      },
    });
  }

  async sendNotificationEmail(
    to: string,
    title: string,
    message: string,
  ): Promise<boolean> {
    return this.sendMail({
      to,
      subject: title,
      template: 'notification',
      context: {
        title,
        message,
        supportEmail: this.configService.get(
          'mail.defaultEmail',
        ),
      },
    });
  }

  async sendOtpVerificationEmail(
    to: string,
    otp: string,
    userName: string,
  ): Promise<boolean> {
    return this.sendMail({
      to,
      subject: 'Email Verification',
      template: 'otp-verification',
      context: {
        userName,
        otp,
        expiryTime: '10 minutes',
      },
    });
  }
}
