import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  providers: [TicketService],
  controllers: [TicketController],
})
export class TicketModule {
  constructor() {
    console.log('🧩 TicketModule loaded');
  }
}
