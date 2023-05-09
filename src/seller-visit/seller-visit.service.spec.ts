import { Test, TestingModule } from '@nestjs/testing';
import { SellerVisitService } from './seller-visit.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SellerEntity, ZoneEnum } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { VisitEntity } from '../visit/visit.entity';
import { SellerService } from '../seller/seller.service';
import { VisitService } from '../visit/visit.service';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';

describe('SellerVisitService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: SellerVisitService;
  let sellerRepository: Repository<SellerEntity>;
  let visitRepository: Repository<VisitEntity>;
  let sellerList: SellerEntity[];

  const createMockVisit = () => ({
    visit_date: faker.datatype.datetime().toISOString(),
    image_url: faker.image.imageUrl(),
    description: faker.lorem.sentence(),
    order_id: faker.datatype.uuid(),
    customer_id: faker.datatype.uuid(),
  })
  const createMockSeller = (): object => ({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    sales_commission: faker.datatype.number({min:1 , max:100}),
    status: faker.datatype.boolean(),
    created_at: faker.datatype.datetime().toISOString(),
    updated_at: faker.datatype.datetime().toISOString(),
    deleted_at: faker.datatype.datetime().toISOString(),
    zone: faker.helpers.arrayElement(Object.values(ZoneEnum)),
  });

  const seedDatabase = async () => {
    sellerList = [];
    for (let i = 0; i < 3; i++) {
      const mockVisit = plainToInstance(
        VisitEntity,
        createMockVisit(),
      );
      const mockSeller = plainToInstance(
        SellerEntity,
        createMockSeller(),
      );
      mockSeller.visits = [mockVisit];
      const visit = await visitRepository.save(
        mockVisit,
      );
      const seller = await sellerRepository.save(mockSeller);
      sellerList.push(seller);
    }
  };
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
    sellerRepository = module.get<Repository<SellerEntity>>(
      getRepositoryToken(SellerEntity),
    );
    visitRepository = module.get<Repository<VisitEntity>>(
      getRepositoryToken(VisitEntity),
    );
    await sellerRepository.clear();
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all visits for a seller', async () => {
    const storedSeller: SellerEntity = sellerList[0];
    const visits: VisitEntity[] = await service.findVisitsFromSeller(
      sellerList[0].id
    );
    expect(visits).not.toBeNull();
    expect(visits[0].order_id).toEqual(storedSeller.visits[0].order_id);
  });

  it('findAll should return an exception', async () => {
    await expect(() =>
      service.findVisitsFromSeller(''),
    ).rejects.toHaveProperty(
      'message',
      'El vendedor con el user_id dado no fue encontrado',
    );
  });

  it('findOne should return a visit for a seller', async () => {
    const storedSeller: SellerEntity = sellerList[0];
    const visit: VisitEntity = await service.findVisitFromSeller(
      sellerList[0].id,
      sellerList[0].visits[0].id
    );
    expect(visit).not.toBeNull();
    expect(visit.order_id).toEqual(storedSeller.visits[0].order_id);
  });
});
