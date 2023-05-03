import { Injectable } from '@nestjs/common';

@Injectable()
export class SellerService {
  mockLogic = (body: any) => {
    return body;
  };
}
