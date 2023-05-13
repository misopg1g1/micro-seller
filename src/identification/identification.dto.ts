import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdentificationTypeEnum } from './identification.entity';

export class IdentificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsEnum(IdentificationTypeEnum)
  @IsNotEmpty()
  type: IdentificationTypeEnum;
}