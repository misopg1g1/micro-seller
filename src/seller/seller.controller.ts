import { Body, Controller, Patch, Post, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { SellerService } from './seller.service';

@Controller('mock')
export class SellerController {
  constructor(private sellerService: SellerService) {}
  @ApiBody({})
  @Post()
  async mock_post(@Body() body: any) {
    return this.sellerService.mockLogic(body);
  }

  @ApiBody({})
  @Put()
  async mock_put(@Body() body: any) {
    return this.sellerService.mockLogic(body);
  }

  @ApiBody({})
  @Patch()
  async mock_patch(@Body() body: any) {
    return this.sellerService.mockLogic(body);
  }
}
