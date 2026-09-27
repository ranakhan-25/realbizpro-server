import { Global, Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { join } from 'path';

import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import mailConfig from '../../config/mail.config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(mailConfig),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => {
        const mail = configService.get('mail');

        return {
          transport: {
            host: mail.host,
            port: Number(mail.port),
            secure: mail.secure,
            auth:
              mail.user && mail.password
                ? {
                    user: mail.user,
                    pass: mail.password,
                  }
                : undefined,
          },

          defaults: {
            from: `"${mail.defaultName}" <${mail.defaultEmail}>`,
          },

          template: {
            dir: join(
              process.cwd(),
              'src/modules/email/templates',
            ),
            adapter: new HandlebarsAdapter(
              undefined,
              {
                inlineCssEnabled: true,
              },
            ),
            options: {
              strict: true,
            },
          },

          options: {
            partials: {
              dir: join(
                process.cwd(),
                'src/modules/email/templates/partials',
              ),
              options: {
                strict: true,
              },
            },
          },
        };
      },
    }),
  ],

  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
