import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket-dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }
  @Get('monthly')
  getMonthlyTickets(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    if (!year || !month) {
      throw new Error('Year and month are required');
    }
    return this.ticketService.getMonthlyTickets(year, month);
  }
  @Post()
  createTicket(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketService.createTicket(createTicketDto);
  }
}
