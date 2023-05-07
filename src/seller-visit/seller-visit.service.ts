import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from '../seller/seller.entity';
import { SellerService } from '../seller/seller.service';
import { VisitEntity } from '../visit/visit.entity';
import { VisitService } from '../visit/visit.service';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class SellerVisitService {
  constructor(
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
    @InjectRepository(VisitEntity)
    private visitRepository: Repository<VisitEntity>,
    private sellerService: SellerService,
    private visitService: VisitService,
  ) {}

  async addVisitToSeller(user_id: string, visit_id: string): Promise<SellerEntity> {
    const seller: SellerEntity = await this.sellerService.findOne(user_id, true);
    if (!seller)
      throw new BusinessLogicException(
        'El vendedor con el user_id no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    const visit: VisitEntity = await this.visitService.findOne(visit_id, true);
    if (!visit)
      throw new BusinessLogicException(
        'La visita con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    seller.visits.push(visit);
    return await this.sellerRepository.save(seller);
  }

  async findVisitsFromSeller(user_id: string): Promise<VisitEntity[]> {
    const seller: SellerEntity = await this.sellerService.findOne(user_id, true);
    if (!seller)
      throw new BusinessLogicException(
        'El vendedor con el user_id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    return seller.visits;
  }

  async findVisitFromSeller(
    user_id: string,
    visit_id: string,
  ): Promise<VisitEntity> {
    const seller: SellerEntity = await this.sellerService.findOne(user_id, true);
    if (!seller)
      throw new BusinessLogicException(
        'La visita con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return this.findVisitInSeller(visit_id, seller);
  }

  private findVisitInSeller(
    visit_id: string, 
    seller: SellerEntity
  ): VisitEntity {
    const interestVisit: VisitEntity = seller.visits.find(
      (me) => me.id === visit_id,
    );
    if (!interestVisit)
      throw new BusinessLogicException(
        'The member with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return interestVisit;
  }
}