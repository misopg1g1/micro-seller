import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

const SWAGGER_TITLE = process.env.SWAGGER_TITLE || 'Seller';
const SWAGGER_DESCRIPTION =
  process.env.SWAGGER_DESCRIPTION || 'API para microservicio seller';
const ENABLE_SWAGGER = process.env.ENABLE_SWAGGER || true;
const API_VERSION = process.env.API_VERSION || '1';

function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_TITLE)
    .setDescription(SWAGGER_DESCRIPTION)
    .setVersion(API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`docs`, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (ENABLE_SWAGGER) {
    createSwagger(app);
  }

  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(3002);
}
bootstrap();
