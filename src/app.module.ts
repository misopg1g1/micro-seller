import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbCongif } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { SellerModule } from './seller/seller.module';
import { VisitModule } from './visit/visit.module';
import { SellerVisitModule } from './seller-visit/seller-visit.module';
import { SellerEntity } from './seller/seller.entity';
import { VisitEntity } from './visit/visit.entity';
import { IdentificationEntity } from './identification/identification.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbCongif,
      entities: [SellerEntity, VisitEntity, IdentificationEntity],
    }),
    HealthcheckModule,
    SellerModule,
    SellerVisitModule,
    VisitModule,
  ],
})
export class AppModule {}
