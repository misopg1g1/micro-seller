import { Test, TestingModule } from '@nestjs/testing';
import { SellerVisitService } from './seller-visit.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { VisitEntity } from '../visit/visit.entity';
import { SellerService } from '../seller/seller.service';
import { VisitService } from '../visit/visit.service';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';

describe('SellerVisitService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: SellerVisitService;

  beforeEach(async () => {
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellerVisitService,
        SellerService,
        VisitService,
        S3Service,
        ConfigService,
      ],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(options()),
      ],
    }).compile();

    service = module.get<SellerVisitService>(SellerVisitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});