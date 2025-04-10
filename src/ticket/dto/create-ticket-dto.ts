import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  cast: string;

  @IsString()
  theater: string;

  @IsString()
  seat: string;

  @IsString()
  site: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsString()
  review: string;
}
