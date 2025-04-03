import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TicketModule } from './ticket/ticket.module';
import { ReviewModule } from './review/review.module';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { StorageService } from './storage/storage.service';
import { StorageController } from './storage/storage.controller';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [PrismaModule, TicketModule, ReviewModule, AuthModule, StorageModule],
  controllers: [AppController, StorageController],
  providers: [AppService, SupabaseService, StorageService],
})
export class AppModule {}
