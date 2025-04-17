import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review-dto';
import { UpdateReviewDto } from './dto/update-review-dto';

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
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId: userId,
      },
      include: {
        show: true,
      },
    });
  }
  async getAReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: {
        id: reviewId,
        userId: userId,
      },
      include: {
        show: true,
      },
    });
    if (!review) {
      console.log('review ID: ${reviewId}의 정보가 존재하지 않습니다.');
      throw new NotFoundException(
        `review ID: ${reviewId}의 정보가 존재하지 않습니다.`,
      );
    }
    return review;
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
  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    const beforeUpdateData = await this.prisma.review
      .findUnique({
        where: {
          userId: userId,
          id: reviewId,
        },
      })
      .catch((error) => console.log(error));
    if (!beforeUpdateData) {
      throw new NotFoundException(
        `review ID: ${reviewId}의 정보가 존재하지 않습니다.`,
      );
    }
    return await this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: { ...updateReviewDto },
    });
  }

  async deleteReview(userId: string, reviewId: string) {
    await this.prisma.review
      .delete({
        where: {
          id: reviewId,
          userId: userId,
        },
      })
      .catch((error) => console.log(error));
  }
}
