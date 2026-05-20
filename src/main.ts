import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule }
  from 'nest-winston';

import { winstonConfig }
  from './config/winston.config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder }
  from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';






async function bootstrap() {
  const app =
    await NestFactory.create(AppModule);

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  // CORS
  app.enableCors({

    origin: [
      '*',
      'http://localhost:5173'
    ],

    credentials: true,
  });


  // SWAGGER

  const config =
    new DocumentBuilder()

      .setTitle('HyTrack API')

      .setDescription('HyTrack Backend APIs')

      .setVersion('1.0')

      .addBearerAuth()

      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );

app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 5000);
  console.log(
    `✅ Server running on port ${process.env.PORT ?? 5000}`,
  );
}
bootstrap();
