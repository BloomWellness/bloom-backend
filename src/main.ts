import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from 'prisma/seed-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder().addBearerAuth()
    .setTitle('Bloom')
    .setDescription('The Bloom API description')
    .setVersion('1.0')
    .addTag('bloom')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.listen(3000);
}
bootstrap();
