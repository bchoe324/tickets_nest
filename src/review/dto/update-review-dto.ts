import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  recommend?: boolean;

  @IsString()
  @IsOptional()
  review?: string;
}
