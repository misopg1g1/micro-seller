import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  async health() {
    return 'Im alive!!!';
  }
}
