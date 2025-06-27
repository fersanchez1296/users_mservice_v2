import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: ['http://localhost:4000'],
    methods: 'GET,HEAD,PUT,PATCH,POST',
    credentials: true,
    transform: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Usuarios')
    .setDescription('Microservicio de usuarios del sistema Chermina')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs/usuarios', app, document);
  await app.listen(process.env.PORT ?? 4500);
}
bootstrap();
