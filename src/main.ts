import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(express.static(join(__dirname, '..', 'views')));

  const httpAdapter = app.getHttpAdapter();
  const isExpress = httpAdapter.getType() === 'express';
  const isFastify = httpAdapter.getType() === 'fastify';

  if (isExpress) {
    console.log('Express is used as the HTTP server.');
  } else if (isFastify) {
    console.log('Fastify is used as the HTTP server.');
  } else {
    console.log('Unknown HTTP server.');
  }

  app.setViewEngine('hbs');

  await app.listen(3000);
}

bootstrap();
