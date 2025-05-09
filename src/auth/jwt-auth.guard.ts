import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    let token: string | null =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    console.log('token', token);
    if (!token && request.cookies?.access_token) {
      token = (request.cookies as Record<string, string>).access_token;
    }

    if (!token) {
      console.log('Token not found in cookies');
      throw new UnauthorizedException('Access token is missing');
    }
    try {
      const payload = this.jwtService.verify<{ id: string; email: string }>(
        token,
        {
          secret: process.env.JWT_ACCESS_SECRET,
        },
      );
      request.user = payload;
      console.log('jwt 인증 완료');
      return true;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
