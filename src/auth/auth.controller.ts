import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { AuthLoginDto } from './dto/auth-login-dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

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
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: true,
      sameSite: 'none',
    });
    return {
      message: 'ok',
    };
  }
  @Post('test-login')
  async getTestUserLogin(@Res({ passthrough: true }) res: Response) {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PW;
    if (!email || !password) {
      throw new Error(
        'TEST_EMAIL or TEST_PW environment variables are not set',
      );
    }
    const { accessToken, refreshToken } = await this.authService.getUserLogin({
      email,
      password,
    });
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      secure: true,
      sameSite: 'none',
    });
    return {
      message: 'ok',
    };
  }

  @Post('refresh')
  refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const authHeader = req.headers['authorization'];
    const refreshToken: string | null =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload = this.jwtService.verify<{ id: string; email: string }>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );
      const newAccessToken = this.jwtService.sign(
        {
          id: payload.id,
          email: payload.email,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );
      return {
        newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  @Get('user')
  getUserInfo(@Req() req: Request) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('No access token');
    }
    try {
      const payload = this.jwtService.verify<{ id: string; email: string }>(
        accessToken,
        {
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );
      console.log(payload);
      return this.authService.getUserInfo(payload.id);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
