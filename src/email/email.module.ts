import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: Number('587'),
        secure: false,
        auth: {
          user: 'testuser9644@gmail.com',
          pass: 'wlsnalrqeepqsygg',
        },
      },
      defaults: {
        from: '"Bloom" testuser9644@gmail.com',
      },
    }),
  ],
  controllers: [],
  providers: [EmailService],
})
export class EmailModule {}
