import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { syncDB } from './sync_tide_db';
import { parser } from './event_parser';

const API_PORT = process.env.API_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(+API_PORT);
  // syncDB();
  parser();
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
