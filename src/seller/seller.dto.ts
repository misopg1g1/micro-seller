import { ApiProperty } from '@nestjs/swagger';

import {IsNotEmpty, IsString, IsUUID} from 'class-validator';

export class CreateSellerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly id: string;
}
