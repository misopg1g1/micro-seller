import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { CreateSellerDto } from './seller.dto';
import { SellerEntity } from './seller.entity';
import { plainToInstance } from 'class-transformer';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('sellers')
export class SellerController {
  constructor(private sellerService: SellerService) {}

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'relations', required: false, type: Boolean || String })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.sellerService.findAll(skip, transformedRelations, take);
  }

  @Get(':user_id')
  @ApiQuery({ name: 'relations', required: false, type: Boolean || String })
  async findOne(
    @Param('user_id') seller_id: string,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.sellerService.findOne(seller_id, transformedRelations);
  }

  @Post()
  async create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @ApiBody({})
  @Put(':user_id')
  async update(@Param('user_id') user_id: string, @Body() body: object) {
    return this.sellerService.update(user_id, body);
  }
}
