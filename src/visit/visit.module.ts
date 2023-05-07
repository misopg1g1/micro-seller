import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './visit.entity';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { S3Service } from 'src/shared/aws/storage.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [VisitService, S3Service, ConfigService],
  imports: [TypeOrmModule.forFeature([VisitEntity])],
  controllers: [VisitController],
  exports: [VisitService],
})
export class VisitModule {}
