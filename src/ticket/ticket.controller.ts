import {
  Req,
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { Request } from 'express';
import { UpdateTicketDto } from './dto/update-ticket-dto';

@UseGuards(JwtAuthGuard)
@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly uploadService: UploadService,
  ) {}

  @Get()
  getAllTickets() {
    return this.ticketService.getAllTickets();
  }

  @Get('monthly')
  getMonthlyTickets(
    @Query('year') year: number,
    @Query('month') month: number,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;
    if (!year || !month) {
      throw new BadRequestException('Year and month are required');
    }
    return this.ticketService.getMonthlyTickets(year, month, userId);
  }

  @Get(':ticketId')
  getATicket(
    @Req() req: Request & { user: { id: string } },
    @Param('ticketId') ticketId: string,
  ) {
    const userId = req.user.id;
    return this.ticketService.getATicket(ticketId, userId);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image'))
  async createTicket(
    @UploadedFile() file: Express.Multer.File,
    @Body() createTicketDto: CreateTicketDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;

    const imageUrl = await this.uploadService.uploadImageFile(file, userId);
    return this.ticketService.createTicket(createTicketDto, imageUrl, userId);
  }

  @Patch(':ticketId')
  @UseInterceptors(FileInterceptor('image'))
  async updateTicket(
    @Body() updateTicketDto: UpdateTicketDto,
    @Req() req: Request & { user: { id: string } },
    @Param('ticketId') ticketId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const userId = req.user.id;

    const imageUrl = file
      ? await this.uploadService.uploadImageFile(file, userId)
      : null;

    return this.ticketService.updateTicket(
      userId,
      ticketId,
      updateTicketDto,
      imageUrl,
    );
  }

  @Delete(':ticketId')
  async deleteTicket(
    @Req() req: Request & { user: { id: string } },
    @Param('ticketId') ticketId: string,
  ) {
    const userId = req.user.id;
    return this.ticketService.deleteTicket(userId, ticketId);
  }
}
