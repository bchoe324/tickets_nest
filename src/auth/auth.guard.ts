import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

interface AuthenticateRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticateRequest>();
    const { authorization } = req.headers;
    if (!authorization) {
      console.log('111');
      throw new UnauthorizedException('No Authorization header');
    }
    const [type, token] = authorization.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      console.log('222');
      throw new UnauthorizedException('Invalid Authorization header format');
    }
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) {
      console.log('333');
      throw new UnauthorizedException('Invalid token');
    }
    req.user = {
      id: data.user.id,
      email: data.user.email,
      createdAt: new Date(data.user.created_at),
    } as User;
    return true;
  }
}
