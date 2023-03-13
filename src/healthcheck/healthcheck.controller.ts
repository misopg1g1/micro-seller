import { Controller, Get, Post, Body, Put, Patch } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('health')
export class HealthcheckController {
  constructor(private healthcheckService: HealthcheckService) {}

  @Get()
  async health() {
    return await this.healthcheckService.health();
  }
}
