import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './visit.entity';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { S3Service } from 'src/shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';
import { SellerService } from '../seller/seller.service';
import { SellerEntity } from '../seller/seller.entity';
import { IdentificationEntity } from '../identification/identification.entity';

@Module({
  providers: [VisitService, S3Service, ConfigService, SellerService],
  imports: [
    TypeOrmModule.forFeature([VisitEntity, SellerEntity, IdentificationEntity]),
  ],
  controllers: [VisitController],
  exports: [VisitService],
})
export class VisitModule {}
