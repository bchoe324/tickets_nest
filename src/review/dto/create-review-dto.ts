import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class ShowDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  poster: string;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;

  @IsString()
  theater: string;
}

export class CreateReviewDto {
  @ValidateNested()
  @Type(() => ShowDto)
  show: ShowDto;

  @Type(() => Boolean)
  @IsBoolean()
  recommend: boolean;

  @IsString()
  review: string;
}
