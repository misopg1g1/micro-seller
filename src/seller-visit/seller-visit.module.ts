import { Module } from '@nestjs/common';
import { SellerVisitService } from './seller-visit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from 'src/seller/seller.entity';
import { VisitEntity } from 'src/visit/visit.entity';
import { SellerVisitController } from './seller-visit.controller';
import { SellerModule } from 'src/seller/seller.module';
import { VisitModule } from 'src/visit/visit.module';

@Module({
  providers: [SellerVisitService],
  exports: [SellerVisitService],
  imports: [
    TypeOrmModule.forFeature([SellerEntity, VisitEntity]),
    SellerModule,
    VisitModule,
  ],
  controllers: [SellerVisitController]
})
export class SellerVisitModule {}
