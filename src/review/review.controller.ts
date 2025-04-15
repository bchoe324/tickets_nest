import { Controller, Post, Get, UseGuards, Body, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review-dto';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const userId = req.user.id;
    console.log(userId, createReviewDto);

    return this.reviewService.createReview(createReviewDto, userId);
  }

  @Get()
  getAllReviews() {
    return this.reviewService.getAllReviews();
  }

  @Get('recent')
  getRecentReviews() {
    return this.reviewService.getRecentReviews();
  }

  @Get('myreview')
  getMyReviews() {}
}
