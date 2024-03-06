import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { syncDB } from './sync_tidebit_db';
import { parser } from './event_parser';
import { AppModule } from './app/app.module';

const API_PORT = process.env.API_PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(+API_PORT);
    // syncDB();
    parser();
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
  
bootstrap();

