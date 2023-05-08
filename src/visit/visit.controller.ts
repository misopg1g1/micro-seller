import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptors';
import { VisitService } from './visit.service';
import { VisitDto } from './visit.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Get()
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'relations', required: false, type: Boolean })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.visitService.findAll(skip, transformedRelations, take);
  }

  @Get(':visit_id')
  @ApiQuery({ name: 'relations', required: false, type: Boolean })
  async findOne(
    @Param('visit_id') visit_id: string,
    @Query('relations') relations: any = false,
  ) {
    let transformedRelations = relations;
    if (typeof relations === 'string') {
      transformedRelations = JSON.parse(relations.toLowerCase());
    }
    return await this.visitService.findOne(visit_id, transformedRelations);
  }

  @Post()
  async create(@Body() visitDto: VisitDto) {
    return await this.visitService.create(visitDto);
  }

  @ApiBody({})
  @Put(':visit_id')
  async update(@Param('visit_id') visit_id: string, @Body() body: object) {
    return await this.visitService.update(visit_id, body);
  }
}
