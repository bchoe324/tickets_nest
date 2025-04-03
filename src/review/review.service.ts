import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async getAllReviews() {
    return await this.prisma.review.findMany();
  }
  async recentReviews() {
    return await this.prisma.review.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async createReview() {}
  async deleteReview() {}
}
