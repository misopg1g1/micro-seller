import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateNowDate, SellerEntity } from './seller.entity';
import { QueryFailedError, Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { IdentificationEntity } from '../identification/identification.entity';
import { plainToInstance } from 'class-transformer';
import { CreateSellerDto } from './seller.dto';
import { IdentificationDto } from '../identification/identification.dto';
import { validate } from 'class-validator';

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

  async findOne(id: string, relations: boolean) {
    let seller: SellerEntity | undefined = undefined;
    try {
      seller = await this.sellerRepository.findOne({
        where: { id },
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

  async create(sellerDto: CreateSellerDto) {
    const identificationEntity = await this.identificationRepository.save({});
    const sellerEntity = plainToInstance(SellerEntity, sellerDto);
    sellerEntity.identification = identificationEntity;
    try {
      return await this.sellerRepository.save(sellerEntity);
    } catch (e: any) {
      throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
    }
  }

  async update(id: string, obj: object) {
    const newObj = {};
    const sellerKeys = [
      'first_name',
      'last_name',
      'sales_commission',
      'status',
      'zone',
      'identification',
    ];
    for (const key of Object.keys(obj)) {
      if (sellerKeys.includes(key)) {
        if (key === 'identification') {
          const newIdentificationDto = plainToInstance(
            IdentificationDto,
            obj[key],
          );
          const errors = await validate(newIdentificationDto);
          if (errors.length > 0) {
            throw new BusinessLogicException(
              'La estructura del objeto de identificación no es correcta.',
              BusinessError.BAD_REQUEST,
            );
          }
          newObj[key] = await this.identificationRepository.save(
            newIdentificationDto,
          );
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    newObj['updated_at'] = generateNowDate();
    await this.sellerRepository.update(id, newObj);
    return await this.sellerRepository.findOne({
      where: { id },
      relations: ['identification'],
    });
  }
}
