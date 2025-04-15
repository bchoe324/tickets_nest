import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review-dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async getAllReviews() {
    return await this.prisma.review.findMany({
      take: 30,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        show: true,
      },
    });
  }
  async getRecentReviews() {
    return await this.prisma.review.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        show: true,
      },
    });
  }
  async getMyReviews(userId: string) {
    // 리뷰 없으면 빈 배열 반환
    return await this.prisma.review.findMany({
      where: {
        userId: userId,
      },
    });
  }
  async createReview(createReviewDto: CreateReviewDto, userId: string) {
    try {
      let show = await this.prisma.show.findUnique({
        where: { id: createReviewDto.show.id },
      });
      if (!show) {
        show = await this.prisma.show.create({
          data: createReviewDto.show,
        });
      }
      await this.prisma.review.create({
        data: {
          userId: userId,
          showId: show.id,
          recommend: createReviewDto.recommend,
          review: createReviewDto.review,
        },
      });
      return {
        message: '티켓 정보 등록',
      };
    } catch (error) {
      console.log(error);
    }
  }
  async deleteReview(reviewId: string) {
    await this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
