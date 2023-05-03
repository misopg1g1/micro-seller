import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from '../../seller/seller.entity';
import { VisitEntity } from 'src/visit/visit.entity';
import { IdentificationEntity } from 'src/identification/identification.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'memory',
    dropSchema: true,
    entities: [SellerEntity, VisitEntity, IdentificationEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([SellerEntity]),
];
