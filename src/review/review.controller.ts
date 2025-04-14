import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
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

    return this.reviewService.createReview(createReviewDto, userId);
  }
}
