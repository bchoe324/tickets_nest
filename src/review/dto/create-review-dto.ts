import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class CreateReviewDto {
  show: {
    id: string;
    title: string;
    duration: string;
    theater: string;
    poster: string;
  };

  @Type(() => Boolean)
  @IsBoolean()
  recommend: boolean;

  @IsString()
  review: string;
}
