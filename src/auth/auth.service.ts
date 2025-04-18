import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthLoginDto } from './dto/auth-login-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto) {
    const { email, password, name } = authCredentialsDto;
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name },
      },
    });
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    const userId = data.user?.id;
    if (!userId) {
      throw new Error('User ID not found from Supabase');
    }
    return await this.prisma.user.create({
      data: {
        id: userId,
        email,
        name,
      },
    });
  }
  async getUserLogin(authLoginDto: AuthLoginDto) {
    const { email, password } = authLoginDto;
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw new UnauthorizedException(error.message);
    } else if (!data.user) {
      throw new UnauthorizedException('User not found');
    }
    const payload = {
      id: data.user.id,
      email: data.user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  async deleteUser(userId: string) {
    const { error } = await this.supabase.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error(`Supabase user delete failed: ${error.message}`);
    }
    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
  async refreshToken() {}
  async getUserInfo(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }
  async updateUserInfo() {}
}
