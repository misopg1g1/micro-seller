import { ApiProperty } from "@nestjs/swagger";
import { SellerEntity, ZoneEnum } from "./seller.entity";
import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsDateString, 
    IsBoolean, 
    ValidateNested,
} from "class-validator";
import { IdentificationDto } from "../identification/identification.dto";
import { Type } from "class-transformer";

export class SellerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly user_id: string;

    @ApiProperty()
    @IsString()
    readonly first_name: string;

    @ApiProperty()
    @IsString()
    readonly last_name: string;

    @ApiProperty()
    @IsNumber()
    readonly sales_commission: number;

    @ApiProperty()
    @IsBoolean()
    readonly status: boolean;

    @ApiProperty()
    @IsDateString()
    readonly created_at: string;

    @ApiProperty()
    @IsDateString()
    readonly updated_at: string;

    @ApiProperty()
    @IsDateString()
    readonly deleted_at: string;

    @ApiProperty()
    @IsString()
    readonly zone: ZoneEnum;

    @ValidateNested()
    @Type(() => IdentificationDto)
    readonly identification: IdentificationDto;
}

export class CreateSellerDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly user_id: string;

    @ApiProperty()
    @IsString()
    readonly first_name: string;

    @ApiProperty()
    @IsString()
    readonly last_name: string;

    @ApiProperty()
    @IsString()
    readonly zone: ZoneEnum;

    @ValidateNested()
    @Type(() => IdentificationDto)
    readonly identification: IdentificationDto;    
}

export class UpdateSellerDto {

    @ApiProperty()
    @IsString()
    readonly first_name: string;

    @ApiProperty()
    @IsString()
    readonly last_name: string;

    @ApiProperty()
    @IsNumber()
    readonly sales_commission: number;

    @ApiProperty()
    @IsBoolean()
    readonly status: boolean;    

    @ApiProperty()
    @IsString()
    readonly zone: ZoneEnum;
}