import { Test, TestingModule } from '@nestjs/testing';
import { SellerService } from './seller.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { VisitEntity } from '../visit/visit.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SellerService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: SellerService;

  beforeEach(async () => {
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerService],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(options()),
      ],
    }).compile();

    service = module.get<SellerService>(SellerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
