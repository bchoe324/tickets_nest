import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { endOfMonth, lastDayOfMonth, startOfMonth } from 'date-fns';
import { UpdateTicketDto } from './dto/update-ticket-dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}
  // @Get
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

  // @Post
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

  // @Patch
  async updateTicket(
    userId: string,
    ticketId: string,
    updateTicketDto: UpdateTicketDto,
    imageUrl: string | null,
  ) {
    const newData: Prisma.TicketUpdateInput = { ...updateTicketDto };
    const beforeUpdateData = await this.prisma.ticket
      .findUnique({
        where: {
          id: ticketId,
          userId: userId,
        },
      })
      .catch((error) => console.log(error));
    if (!beforeUpdateData) {
      throw new NotFoundException(
        `ticket ID: ${ticketId}의 티켓 정보가 존재하지 않습니다.`,
      );
    }
    // 새 이미지 업로드 url이 있으면
    if (imageUrl) {
      newData.imageUrl = imageUrl;
      if (beforeUpdateData.imageUrl)
        if (beforeUpdateData.imageUrl) {
          await this.uploadService.deleteImageFile(beforeUpdateData.imageUrl);
        }
    }
    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: newData,
    });
  }

  // @Delete
  async deleteTicket(userId: string, ticketId: string): Promise<void> {
    const data = await this.prisma.ticket
      .findUnique({
        where: {
          id: ticketId,
          userId: userId,
        },
      })
      .catch((error) => console.log(error));
    if (!data) {
      throw new NotFoundException(
        `ticket ID: ${ticketId}의 티켓 정보가 존재하지 않습니다.`,
      );
    }
    // image 있으면 storage에서 삭제
    if (data.imageUrl) {
      await this.uploadService.deleteImageFile(data.imageUrl);
    }
    await this.prisma.ticket
      .delete({
        where: {
          id: ticketId,
          userId: userId,
        },
      })
      .catch((error) => console.log(error));
  }
}
