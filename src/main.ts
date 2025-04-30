import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  console.log('🔥 Starting Nest Factory...');
  const app = await NestFactory.create(AppModule);
  console.log('✅ NestFactory created');

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://tickets-ten-pi.vercel.app',
        'http://localhost:3000',
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  console.log('🚀 About to start listening...');

  await app.listen(process.env.PORT ?? 8080, '0.0.0.0');
  console.log('✅ Nest application successfully started');
}
bootstrap();
