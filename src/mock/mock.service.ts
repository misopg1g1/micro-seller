import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  mockLogic = (body: any) => {
    return body;
  };
}
