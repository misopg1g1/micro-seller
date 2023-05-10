import { Test, TestingModule } from '@nestjs/testing';
import { VisitService } from './visit.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { VisitEntity } from './visit.entity';
import { S3Service } from '../shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { SellerEntity } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { VisitDto } from './visit.dto';
import { SellerService } from './../seller/seller.service'
import { plainToInstance } from 'class-transformer';

describe('VisitService', () => {
  const entities = [SellerEntity, IdentificationEntity, VisitEntity];
  let service: VisitService;
  let visitRepository: Repository<VisitEntity>;
  let sellerRepository: Repository<SellerEntity>;
  let visitList: VisitEntity[];
  const id_mock: string = faker.datatype.uuid();

  const createMockSeller = (): object => ({
    id: id_mock,
  });
  const seedDatabase = async () => {
    await visitRepository.clear();
    visitList = [];
    for (let i = 0; i < 5; i++) {
      const visit: VisitEntity = await visitRepository.save({
        visit_date: faker.datatype.datetime().toISOString(),
        image_url: faker.image.imageUrl(),
        description: faker.lorem.sentence(),
        order_id: faker.datatype.uuid(),
        customer_id: faker.datatype.uuid()
      });
      visitList.push(visit);
    }
    const mockSeller = plainToInstance(SellerEntity, createMockSeller());
    await sellerRepository.save(mockSeller)
  }

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
    visitRepository = module.get<Repository<VisitEntity>>(
      getRepositoryToken(VisitEntity),
    )
    sellerRepository = module.get<Repository<SellerEntity>>(
      getRepositoryToken(SellerEntity),
    )    
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all visit', async () => {
    const visits: VisitEntity[] = await service.findAll(0,true, 10);
    expect(visits).not.toBeNull();
    expect(visits).toHaveLength(visitList.length);
  });
  
  it('findOne should return a visit by vist_id', async () => {
    const storedVisit: VisitEntity = visitList[0];
    const visit: VisitEntity = await service.findOne(
      storedVisit.id, false
    );
    expect(visit).not.toBeNull();
    expect(visit.order_id).toEqual(storedVisit.order_id);
    expect(visit.image_url).toEqual(storedVisit.image_url);
    expect(visit.seller).toEqual(storedVisit.seller);
    expect(visit.visit_date).toEqual(storedVisit.visit_date);
  });

  it('findOne should throw an exception for an invalid visit_id', async () => {
    await expect(() =>
      service.findOne(faker.datatype.uuid(), false),
    ).rejects.toHaveProperty(
      'message',
      'La visita con el id dado no fue encontrada',
    );
  });

  it('create should return a new visit', async () => {
    const visitDto: VisitDto = {
      img_base64_data: '',
      description: faker.lorem.sentence(),
      order_id: faker.datatype.uuid(),
      visit_date: faker.datatype.datetime().toISOString(),
      seller_id: id_mock,
      customer_id: faker.datatype.uuid(),
    };
    const newVisit: VisitEntity = await service.create(visitDto);
    expect(newVisit).not.toBeNull();

    const storedVisit: VisitEntity = await visitRepository.findOne({
      where: { id: newVisit.id },
    });
    expect(storedVisit).not.toBeNull();
    expect(storedVisit.description).toEqual(newVisit.description);
    expect(storedVisit.order_id).toEqual(newVisit.order_id);
    expect(storedVisit.visit_date).toEqual(newVisit.visit_date);
    expect(storedVisit.image_url).toEqual(newVisit.image_url);
  });

  it('create should return an exception', async () => {
    const visitDto: VisitDto = {
      img_base64_data: '',
      description: faker.lorem.sentence(),
      order_id: faker.datatype.uuid(),
      visit_date: faker.datatype.datetime().toISOString(),
      seller_id: faker.datatype.uuid(),
      customer_id: faker.datatype.uuid(),
    };
    await expect(() =>
      service.create(visitDto),
    ).rejects.toHaveProperty(
      'message',
      'El vendedor con el user_id dado no fue encontrado',
  );
  });

  it('update should modify an existing visit', async () => {
    const visit: VisitEntity = visitList[0];
    visit.order_id = faker.datatype.uuid();
    const updatedVisit: VisitEntity = await service.update(
      visit.id,
      visit,
    );
    expect(updatedVisit).not.toBeNull();
    const storedVisit: VisitEntity = await visitRepository.findOne({
      where: { id: visit.id },
    });
    expect(storedVisit).not.toBeNull();
    expect(storedVisit.order_id).toEqual(visit.order_id);
  });

  it('update should modify an existing visit with image', async () => {
    const visit: VisitEntity = visitList[0];
    const visitObj = {
      "img_base64_data": "",
      "order_id": "jjjj"};
    const updatedVisit: VisitEntity = await service.update(
      visit.id,
      visitObj,
    );
    expect(updatedVisit).not.toBeNull();
    const storedVisit: VisitEntity = await visitRepository.findOne({
      where: { id: visit.id },
    });
    expect(storedVisit).not.toBeNull();
    expect(updatedVisit.image_url).toEqual('https://kiranametro.com/admin/public/size_primary_images/no-image.jpg');
  });

  it('update should modify throw an exception for an invalid visit', async () => {
    const visit: VisitEntity = visitList[0];
    visit.order_id = faker.datatype.uuid();
    await expect(() =>
      service.update(faker.datatype.uuid(), visit),
    ).rejects.toHaveProperty(
      'message',
      'La visita con el id dado no fue encontrada',
    );
  });
});

