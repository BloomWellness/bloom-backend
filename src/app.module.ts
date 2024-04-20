import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './utils/constants';
import { CbtModule } from './cbt/cbt.module';
import { JournalModule } from './journal/journal.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SeedService } from 'prisma/seed-service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    EmailModule,
    // JwtModule.register({
    //   global: true,
    //   secret: jwtConstants.secret,
    //   signOptions: { expiresIn: '3600s' },
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CbtModule,
    JournalModule,
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule {}
