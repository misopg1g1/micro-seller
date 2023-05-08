import { ApiProperty } from "@nestjs/swagger";
import { VisitEntity } from "./visit.entity";
import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsDateString, 
    IsBoolean, 
    ValidateNested,
    IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

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
}

export class GetVisitDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly image_url: string;

    @ApiProperty()
    @IsString()
    readonly description: string;

    @ApiProperty()
    @IsString()
    readonly order_id: string;

    @ApiProperty()
    @IsDateString()
    readonly visit_date: string;
}
