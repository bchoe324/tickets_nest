import { Body, Controller, Get, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket-dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }
  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }
}
