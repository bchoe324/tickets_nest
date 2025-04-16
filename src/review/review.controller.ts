import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
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
  getMyReviews(@Req() req: Request & { user: { id: string } }) {
    const userId = req.user.id;
    return this.reviewService.getMyReviews(userId);
  }

  @Get(':reviewId')
  getAReview(
    @Req() req: Request & { user: { id: string } },
    @Param('reviewId') reviewId: string,
  ) {
    const userId = req.user.id;

    return this.reviewService.getAReview(userId, reviewId);
  }

  @Patch(':reviewId')
  updateReview(
    @Req() req: Request & { user: { id: string } },
    @Param('reviewId') reviewId: string,
  ) {}
}
