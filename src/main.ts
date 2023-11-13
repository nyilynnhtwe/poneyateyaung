import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './libs/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

async function bootstrap() {
  //create app from app module
  const app = await NestFactory.create(AppModule);

  // setting up things on app
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // app.use(morgan('dev'));
  app.use(
    morgan('common', {
      stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {
        flags: 'a',
      }),
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  // PORT
  const PORT = process.env.PORT || 5500;

  // api documentation
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Pone Yate Yaung API')
    .setDescription('Pone Yate Yaung api documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(PORT, '192.168.68.123');
}
bootstrap();
