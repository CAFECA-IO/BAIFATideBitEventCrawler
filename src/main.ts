import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client'

async function bootstrap() {
  const prisma = new PrismaClient();
  const result = await prisma.account_versions.findMany({
    where: {
      id: {
        lte: 10,
        gte: 1
      }
    }
  });
  console.log(result);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
