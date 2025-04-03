import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  getAllTickets() {
    return this.prisma.ticket.findMany();
  }
}
