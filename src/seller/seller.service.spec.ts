import { Test, TestingModule } from '@nestjs/testing';
import { SellerService } from './seller.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { IdentificationEntity, IdentificationTypeEnum } from '../identification/identification.entity';
import { VisitEntity } from '../visit/visit.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker'
import { ZoneEnum } from './seller.entity'
import { CreateSellerDto } from './seller.dto';
import { plainToInstance } from 'class-transformer';

describe('SellerService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: SellerService;
  let sellerRepository: Repository<SellerEntity>;
  let sellerList: SellerEntity[];

  const seedDatabase = async () => {
    await sellerRepository.clear();
    sellerList = [];
    for (let i = 0; i < 5; i++) {
      const seller: SellerEntity = await sellerRepository.save({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        sales_commission: faker.datatype.number({min:1 , max:100}),
        status: faker.datatype.boolean(),
        created_at: faker.datatype.datetime().toISOString(),
        updated_at: faker.datatype.datetime().toISOString(),
        deleted_at: faker.datatype.datetime().toISOString(),
        zone: faker.helpers.arrayElement(Object.values(ZoneEnum)),
        visits: []
      });
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
      providers: [SellerService],
      imports: [
        TypeOrmModule.forFeature(entities),
        TypeOrmModule.forRoot(options()),
      ],
    }).compile();

    service = module.get<SellerService>(SellerService);
    sellerRepository = module.get<Repository<SellerEntity>>(
      getRepositoryToken(SellerEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all sellers', async () => {
    const sellers: SellerEntity[] = await service.findAll(0,true,10);
    expect(sellers).not.toBeNull();
    expect(sellers).toHaveLength(sellerList.length);
  });

  it('findOne should return a seller by id', async () => {
    const storedSeller: SellerEntity = sellerList[0];
    const seller: SellerEntity = await service.findOne(
      storedSeller.id,true
    );
    expect(seller).not.toBeNull();
    expect(seller.status).toEqual(storedSeller.status);
    expect(seller.sales_commission).toEqual(storedSeller.sales_commission);
    expect(seller.created_at).toEqual(storedSeller.created_at);
    expect(seller.updated_at).toEqual(storedSeller.updated_at);
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(() =>
      service.findOne(faker.datatype.uuid(), true),
    ).rejects.toHaveProperty(
      'message',
      'El vendedor con el user_id dado no fue encontrado',
    );
  });

  it('create should return a new seller', async () => {
    const sellerDto: CreateSellerDto = plainToInstance(CreateSellerDto,{
      identification: {
        id: '',
        number: faker.datatype.string(),
        type: faker.helpers.arrayElement(Object.values(IdentificationTypeEnum))
      },
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      sales_commission: faker.datatype.number({min:1 , max:100}),
      status: faker.datatype.boolean(),
      created_at: faker.datatype.datetime().toISOString(),
      updated_at: faker.datatype.datetime().toISOString(),
      deleted_at: faker.datatype.datetime().toISOString(),
      zone: faker.helpers.arrayElement(Object.values(ZoneEnum)),
      visits:[], 
    });
    const newSeller: SellerEntity = await service.create(sellerDto);
    expect(newSeller).not.toBeNull();

    const storedSeller: SellerEntity = await sellerRepository.findOne({
      where: { id: newSeller.id },
    });
    expect(storedSeller).not.toBeNull();
    expect(storedSeller.first_name).toEqual(newSeller.first_name);
    expect(storedSeller.last_name).toEqual(newSeller.last_name);
    expect(storedSeller.created_at).toEqual(newSeller.created_at);
    expect(storedSeller.updated_at).toEqual(newSeller.updated_at);
  });

  it('update should modify an existing seller', async () => {
    const seller: SellerEntity = sellerList[0];
    seller.sales_commission = faker.datatype.number({min:0, max:100});
    const updatedSeller: SellerEntity = await service.update(
      seller.id,
      seller,
    );
    expect(updatedSeller).not.toBeNull();
    const storedSeller: SellerEntity = await sellerRepository.findOne({
      where: { id: seller.id },
    });
    expect(storedSeller).not.toBeNull();
    expect(storedSeller.sales_commission).toEqual(seller.sales_commission);
  });
});

