import { Injectable, Scope, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable({ scope: Scope.DEFAULT, durable: true })
export class PrismaService extends PrismaClient implements OnModuleInit {
  static logger = new Logger();
  async onModuleInit() {
    console.log('Connecting to Database');
    await this.$connect();
    console.log('Database connection successful');
  }
}
