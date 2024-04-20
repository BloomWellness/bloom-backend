import { Injectable } from '@nestjs/common';
import { CreateCbtDto } from './dto/create-cbt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateCbtDto } from './dto/rate-cbt.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CbtService {

  constructor(private emailService: EmailService, private readonly prisma: PrismaService) {}

  async createCBTMethod(createCbtDto: CreateCbtDto) {
    await this.prisma.cbt.create({
      data: {
        title: createCbtDto.title,
      },
    });
  }
  
  async getAllCBTMethods() {
    const cbtMethods = await this.prisma.cbt.findMany();
    return cbtMethods.map((cbtMethod) => {
      return {
        id: cbtMethod.id,
        title: cbtMethod.title,
      };
    }
    );
  }

  async rateCbtMethod(rateCBTDto: RateCbtDto) {
    await this.emailService.emailCbtRating(rateCBTDto.cbtMethod, rateCBTDto.comment, rateCBTDto.rate);
  }

}
