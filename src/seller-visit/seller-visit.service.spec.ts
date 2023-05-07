import { Test, TestingModule } from '@nestjs/testing';
import { SellerVisitService } from './seller-visit.service';

describe('SellerVisitService', () => {
  let service: SellerVisitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerVisitService],
    }).compile();

    service = module.get<SellerVisitService>(SellerVisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
