import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para permitir la comunicación segura entre el Monorepo
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Next.js (Storefront) y Vite (ERP)
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // Validación clínica estricta: Rechaza cualquier dato que no esté en los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Versionado de API para escalabilidad corporativa
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 Óptica API Core orquestando servicios en: http://localhost:${port}/api/v1`);
}
bootstrap();