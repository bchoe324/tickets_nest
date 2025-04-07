import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket-dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  async getAllTickets() {
    return await this.prisma.ticket.findMany();
  }
  async getMonthlyTickets(year: number, month: number) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    return await this.prisma.ticket.findMany({
      where: {
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });
  }
  async getATicket(ticketId: string): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    });
    if (!ticket) {
      throw new NotFoundException(
        `ticket ID: ${ticketId}의 티켓 정보가 존재하지 않습니다.`,
      );
    }
    return ticket;
  }
  async createTicket(createTicketDto: CreateTicketDto) {
    return await this.prisma.ticket.create({
      data: { ...createTicketDto, userId: 'ddd' },
    });
  }
  async updateTicket(ticketId: string) {
    const beforeUpdateData = await this.prisma.ticket
      .findUnique({
        where: {
          id: ticketId,
        },
      })
      .catch((error) => console.log(error));
    if (!beforeUpdateData) {
      throw new NotFoundException(
        `ticket ID: ${ticketId}의 티켓 정보가 존재하지 않습니다.`,
      );
    }
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {},
    });
  }
  async deleteTicket(ticketId: string): Promise<void> {
    await this.prisma.ticket.delete({
      where: {
        id: ticketId,
      },
    });
  }
}
