import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { endOfMonth, lastDayOfMonth, startOfMonth } from 'date-fns';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  async getAllTickets() {
    return await this.prisma.ticket.findMany();
  }
  async getMonthlyTickets(year: number, month: number, userId: string) {
    const startDay = startOfMonth(new Date(year, month, 1));
    const lastDay = endOfMonth(new Date(year, month, 1));
    return await this.prisma.ticket.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDay,
          lte: lastDay,
        },
      },
    });
  }
  async getATicket(ticketId: string, userId: string): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id: ticketId,
        userId: userId,
      },
    });
    if (!ticket) {
      throw new NotFoundException(
        `ticket ID: ${ticketId}의 티켓 정보가 존재하지 않습니다.`,
      );
    }
    return ticket;
  }
  async createTicket(
    createTicketDto: CreateTicketDto,
    imageUrl: string,
    userId: string,
  ) {
    const { title, date, cast, theater, seat, price, site, review } =
      createTicketDto;

    await this.prisma.ticket.create({
      data: {
        title,
        date,
        cast,
        theater,
        seat,
        price,
        site,
        review,
        imageUrl,
        userId,
      },
    });
    return {
      message: '티켓 정보 등록',
    };
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
