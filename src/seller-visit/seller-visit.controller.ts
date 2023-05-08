import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { VisitDto } from 'src/visit/visit.dto';
import { VisitEntity } from 'src/visit/visit.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptors';
import { SellerVisitService } from './seller-visit.service';

@Controller('sellers')
@UseInterceptors(BusinessErrorsInterceptor)
export class SellerVisitController {
  constructor(private readonly sellerVisitService: SellerVisitService) {}

  // @Post(':user_id/visits/:visit_id')
  // async addVisitSeller(
  //   @Param('user_id') user_id: string,
  //   @Param('visit_id') visit_id: string,
  // ) {
  //   return await this.sellerVisitService.addVisitToSeller(user_id, visit_id);
  // }

  @Get(':user_id/visits/:visit_id')
  async findMemberFromClub(
    @Param('user_id') user_id: string,
    @Param('visit_id') visit_id: string,
  ) {
    return await this.sellerVisitService.findVisitFromSeller(user_id, visit_id);
  }

  @Get(':user_id/visits')
  async findVisitsFromSeller(@Param('user_id') user_id: string) {
    return await this.sellerVisitService.findVisitsFromSeller(user_id);
  }
}
