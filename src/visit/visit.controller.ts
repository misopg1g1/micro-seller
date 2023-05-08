import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptors';
import { VisitService } from './visit.service';
import { GetVisitDto, VisitDto } from './visit.dto';
import { VisitEntity } from './visit.entity';
import { plainToInstance } from 'class-transformer';
import {ApiBody, ApiQuery} from '@nestjs/swagger';

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
    @Query('relations') relations = false,
  ) {
    const transformedRelations = JSON.parse(String(relations));
    const visits = await this.visitService.findAll(
      skip,
      transformedRelations,
      take,
    );
    return plainToInstance(GetVisitDto, visits);
  }

  @Get(':visit_id')
  @ApiQuery({ name: 'relations', required: false, type: Boolean })
  async findOne(
    @Param('visit_id') visit_id: string,
    @Query('relations') relations = false,
  ) {
    const transformedRelations = JSON.parse(String(relations));
    const visit = await this.visitService.findOne(
      visit_id,
      transformedRelations,
    );
    return plainToInstance(GetVisitDto, visit);
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
