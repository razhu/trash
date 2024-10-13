import helmet from 'helmet';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AuthorizationGuard } from './common/guards';
import { HttpExceptionFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthorizationGuard(reflector));

  app.enableCors({ origin: '*' }); // TODO: Restrict CORS to specific domain(s) for prod
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: { reportOnly: true },
    }),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api');

  // Global validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: true,
    }),
  );

  // Swagger configuration with Bearer auth
  const config = new DocumentBuilder()
    .setTitle('Pando Electric Gen 2 API')
    .setDescription('API documentation for Pando Electric Gen 2')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // Register the global filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Start server
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
void bootstrap();
