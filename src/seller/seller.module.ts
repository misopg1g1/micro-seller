import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { IdentificationEntity } from 'src/identification/identification.entity';
import { VisitEntity } from 'src/visit/visit.entity';

@Module({
  providers: [SellerService],
  controllers: [SellerController],
  exports: [SellerService],
  imports: [
    TypeOrmModule.forFeature([
      SellerEntity,
      IdentificationEntity,
      VisitEntity,
    ])
  ],
})
export class SellerModule {}
