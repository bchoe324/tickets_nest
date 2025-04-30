import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return `<title>Tickets 서버</title>
    <h2>Tickets 서버</h2>`;
  }
}
