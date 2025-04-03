import { Controller, Get } from '@nestjs/common';
import { TicketService } from './ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }
}
