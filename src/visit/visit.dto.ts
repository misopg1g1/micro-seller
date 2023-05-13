import { ApiProperty } from '@nestjs/swagger';
import { VisitEntity } from './visit.entity';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsBoolean,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

function getActualStringDate() {
  const d = new Date(Date.now());
  return d.toISOString();
}

export class VisitDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  img_base64_data = '';

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString()
  readonly order_id: string;

  @ApiProperty({ default: getActualStringDate() })
  @IsDateString()
  readonly visit_date: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly seller_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly customer_id: string;
}

