import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { join } from 'path';

import mailConfig from '../../../config/mail.config';
import { EmailService } from './email.service';

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
        const config = configService.get('mail');

        const templateDir = join(
          process.cwd(),
          'dist',
          'templates',
        );

        console.log('Template Dir:', templateDir);

        return {
          transport: {
            host: config.host,
            port: Number(config.port),
            secure: config.secure,
            auth: {
              user: config.user,
              pass: config.password,
            },
          },

          defaults: {
            from: `"${config.defaultName}" <${config.defaultEmail}>`,
          },

          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
