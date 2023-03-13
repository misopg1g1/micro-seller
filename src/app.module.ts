import { Module } from '@nestjs/common';
// import {TypeOrmModule} from '@nestjs/typeorm';
import { dbCongif } from './shared/config/dbconfig';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { MockModule } from './mock/mock.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot(dbCongif),
    HealthcheckModule,
    MockModule,
  ],
})
export class AppModule {}
