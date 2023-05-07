import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Put, 
  Query, 
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptors';
import { 
  SellerDto,
  CreateSellerDto,
  UpdateSellerDto,
} from './seller.dto';
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
  @ApiQuery({name: 'relations', required: false, type: Boolean || String})
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

  @ApiBody({})
  @Post()
  async create(@Body() createSellerDto: CreateSellerDto) {
    const sellerDto: SellerDto = {
      user_id: createSellerDto.user_id,
      identification: createSellerDto.identification,
      first_name: createSellerDto.first_name,
      last_name: createSellerDto.last_name,
      sales_commission: 10,
      zone: createSellerDto.zone,
      status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: '',
    };
    return this.sellerService.create(sellerDto);
  }

  @ApiBody({})
  @Put(':user_id')
  async update(
    @Param('user_id') user_id: string,
    @Body() updateSellerDto: UpdateSellerDto,
  ) {
    const storedSeller: SellerEntity =
      await this.sellerService.findOne(user_id, false);
    const sellerDto: SellerDto = {
      first_name: updateSellerDto.first_name,
      last_name: updateSellerDto.last_name,
      identification: storedSeller.identification,
      sales_commission: updateSellerDto.sales_commission,
      status: updateSellerDto.status,
      created_at: storedSeller.created_at,
      updated_at: new Date().toISOString(),
      deleted_at: storedSeller.deleted_at,
      user_id: storedSeller.user_id,
      zone: updateSellerDto.zone,
    };
    const seller: SellerEntity = plainToInstance(
      SellerEntity,
      sellerDto,
    );
    seller.user_id = user_id;
    return this.sellerService.update(user_id, seller);
  }
}
