import { Test, TestingModule } from '@nestjs/testing';
import { VisitService } from './visit.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { VisitEntity } from './visit.entity';

describe('VisitService', () => {
  const entities = [VisitEntity];
  let service: VisitService;

  beforeEach(async () => {
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitService],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(options()),
      ],
    }).compile();

    service = module.get<VisitService>(VisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
