import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { dbCongif } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { SellerModule } from './seller/seller.module';
import { VisitModule } from './visit/visit.module';
import { IdentificationModule } from './identification/identification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbCongif),
    HealthcheckModule,
    SellerModule,
    VisitModule,
    IdentificationModule,
  ],
})
export class AppModule {}
