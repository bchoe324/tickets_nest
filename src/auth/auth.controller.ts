import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { AuthLoginDto } from './dto/auth-login-dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('join')
  createUser(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.createUser(authCredentialsDto);
  }
  @Post('login')
  async getUserLogin(
    @Body() authLoginDto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.getUserLogin(authLoginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return {
      message: '로그인 성공',
    };
  }
  @UseGuards(AuthGuard)
  @Get('user')
  getUserInfo(@Req() req: Request & { user: { id: string } }) {
    return this.authService.getUserInfo(req.user.id);
  }
}
