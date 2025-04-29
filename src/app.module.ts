import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TicketModule } from './ticket/ticket.module';
import { ReviewModule } from './review/review.module';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    TicketModule,
    ReviewModule,
    AuthModule,
    SupabaseModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
