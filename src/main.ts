import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const port = process.env.PORT;

async function bootstrap() {
  console.log('🔥 Starting Nest Factory...');
  const app = await NestFactory.create(AppModule);
  console.log('✅ NestFactory created');

  const corsOptions: CorsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      console.log('🌐 Incoming request origin:', origin);
      callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  };

  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());

  console.log('🚀 About to start listening...');
  if (!port) {
    throw new Error('🚨 Missing PORT environment variable');
  }
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Listening on port ${port}`);
  console.log('✅ Nest application successfully started');
}
bootstrap();
