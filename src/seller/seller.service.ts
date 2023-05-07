import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerEntity } from './seller.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { 
  BusinessError, 
  BusinessLogicException 
} from '../shared/errors/business-errors';
import { IdentificationDto } from '../identification/identification.dto';
import { IdentificationEntity } from '../identification/identification.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { CreateSellerDto, SellerDto } from './seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(IdentificationEntity)
    private identificationRepository: Repository<IdentificationEntity>,
  ) {}

  async findAll(skip = 0, relations: boolean, take?: number) {
    let options: object = {
      skip,
      relations: relations ? ['identification', 'visits'] : [],
    };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.sellerRepository.find(options);
  }

  async findOne(user_id: string, relations: boolean) {
    let seller: SellerEntity | undefined = undefined;
    try {
      seller = await this.sellerRepository.findOne({
        where: { user_id },
        relations: relations ? ['identification', 'visits'] : [],
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
    if (!seller) {
      throw new BusinessLogicException(
        'El vendedor con el user_id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return seller;
  }

  async create(sellerDto: SellerDto) {
    let identificationEntity = plainToInstance(
      IdentificationEntity,
      sellerDto.identification,
    );
    const sellerEntity = plainToInstance(SellerEntity, sellerDto);
    const existingSeller: SellerEntity =
      await this.sellerRepository.findOne({
        where: { user_id: sellerDto.user_id },
      });
    const existingIdSeller: SellerEntity =
      await this.sellerRepository.findOne({
        where: { identification: sellerDto.identification },
      });      
    if (existingSeller) {
      throw new BusinessLogicException(
        'Ya existe un vendedor con ese numero de usuario',
        BusinessError.PRECONDITION_FAILED,
      );
    }    
    if (existingIdSeller) {
      throw new BusinessLogicException(
        'Ya existe un vendedor con ese numero de identificación',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    identificationEntity = await this.identificationRepository.save(
      identificationEntity,
    );
    sellerEntity.identification = identificationEntity;
    return await this.sellerRepository.save(sellerEntity);           
  }  

  async update(
    user_id: string,
    seller: SellerEntity,
  ): Promise<SellerEntity> {
    const persistedSeller: SellerEntity =
      await this.sellerRepository.findOne({
        where: { user_id },
      });
    if (!persistedSeller) {
      throw new BusinessLogicException(
        'El vendedor con el user_id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.sellerRepository.save({
      ...persistedSeller,
      ...seller,
    });
  }

}
