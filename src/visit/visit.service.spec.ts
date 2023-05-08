import { Test, TestingModule } from '@nestjs/testing';
import { VisitService } from './visit.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './visit.entity';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { SellerEntity } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { SellerService } from '../seller/seller.service';

describe('VisitService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: VisitService;

  beforeEach(async () => {
    const options = () => {
      return {
        ...TypeOrmTestingConfig(),
        entities: entities,
      };
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisitService, S3Service, ConfigService, SellerService],
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
