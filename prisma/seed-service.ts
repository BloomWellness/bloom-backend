import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { seedData } from 'src/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const existingEntries = await this.prisma.cbt.findMany();

    if (existingEntries.length === 0) {
      console.log('Seeding journal entries...');
      await Promise.all(
        seedData.map(async (data) => {
          await this.prisma.cbt.create({ data });
        })
      );
      console.log('Seeding completed.');
    } else {
      console.log('Journal entries already exist. Skipping seeding.');
    }
  }
}
