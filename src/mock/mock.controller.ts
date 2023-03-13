import { Body, Controller, Patch, Post, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { MockService } from './mock.service';

@Controller('mock')
export class MockController {
  constructor(private mockService: MockService) {}
  @ApiBody({})
  @Post()
  async mock_post(@Body() body: any) {
    return this.mockService.mockLogic(body);
  }

  @ApiBody({})
  @Put()
  async mock_put(@Body() body: any) {
    return this.mockService.mockLogic(body);
  }

  @ApiBody({})
  @Patch()
  async mock_patch(@Body() body: any) {
    return this.mockService.mockLogic(body);
  }
}
