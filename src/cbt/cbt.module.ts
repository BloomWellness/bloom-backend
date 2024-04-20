import { Module } from '@nestjs/common';
import { CbtService } from './cbt.service';
import { CbtController } from './cbt.controller';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [CbtController],
  providers: [CbtService, PrismaService, EmailService],
})
export class CbtModule {}
