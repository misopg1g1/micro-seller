import { Test, TestingModule } from '@nestjs/testing';
import { SellerVisitController } from './seller-visit.controller';

describe('SellerVisitController', () => {
  let controller: SellerVisitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerVisitController],
    }).compile();

    controller = module.get<SellerVisitController>(SellerVisitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
