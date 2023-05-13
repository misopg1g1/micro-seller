import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { QueryFailedError, Repository } from 'typeorm';
import { VisitEntity } from './visit.entity';
import { S3Service } from 'src/shared/aws/storage.service';
import { VisitDto } from './visit.dto';
import { plainToInstance } from 'class-transformer';
import { SellerService } from '../seller/seller.service';
import { SellerEntity } from '../seller/seller.entity';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private readonly visitRepository: Repository<VisitEntity>,
    @InjectRepository(SellerEntity)
    private readonly sellerRepository: Repository<SellerEntity>,
    private readonly sellerService: SellerService,
    private storageService: S3Service,
  ) {}

  async findAll(
    skip = 0,
    relations: boolean,
    take?: number,
  ): Promise<VisitEntity[]> {
    let options: object = { skip, relations: relations ? ['seller'] : [] };
    if (take) {
      options = { ...options, take: take };
    }
    return await this.visitRepository.find(options);
  }

  async findOne(id: string, relations: boolean): Promise<VisitEntity> {
    let visit: VisitEntity | undefined = undefined;
    try {
      visit = await this.visitRepository.findOne({
        where: { id: id },
        relations: relations ? ['seller'] : [],
      });
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
    if (!visit) {
      throw new BusinessLogicException(
        'La visita con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    }
    return visit;
  }

  async create(createVisitDto: VisitDto) {
    const base64Data: string = createVisitDto.img_base64_data;
    let [image_url, key] = [
      'https://kiranametro.com/admin/public/size_primary_images/no-image.jpg',
      undefined,
    ];
    try {
      [image_url, key] = base64Data
        ? await this.storageService.uploadImage(base64Data)
        : [image_url, undefined];
    } catch (e) {
      if (e instanceof BusinessLogicException) {
        throw e;
      }
    }
    const visitObj = {
      ...createVisitDto,
      image_url,
    };
    delete visitObj.img_base64_data;
    const visitEntity = plainToInstance(VisitEntity, visitObj);
    visitEntity.seller = await this.sellerService.findOne(
      createVisitDto.seller_id,
      false,
    );
    try {
      return await this.visitRepository.save(visitEntity);
    } catch (e) {
      await this.storageService.deleteImage(key);
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }
  }

  async update(id: string, obj: object) {
    const persistedVisit: VisitEntity = await this.visitRepository.findOne({
      where: { id },
    });
    if (!persistedVisit)
      throw new BusinessLogicException(
        'La visita con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );

    const newObj = {};
    const visitKeys = [
      'visit_date',
      'description',
      'order_id',
      'img_base64_data',
    ];
    for (const key_present of Object.keys(obj)) {
      if (visitKeys.includes(key_present)) {
        if (key_present === 'img_base64_data') {
          const base64Data: string = obj[key_present];
          let [image_url, key] = [
            'https://kiranametro.com/admin/public/size_primary_images/no-image.jpg',
            undefined,
          ];
          try {
            [image_url, key] = base64Data
              ? await this.storageService.uploadImage(base64Data)
              : [image_url, undefined];
          } catch (e) {
            if (e instanceof BusinessLogicException) {
              throw e;
            }
          }
          newObj['image_url'] = image_url;
        } else newObj[key_present] = obj[key_present];
      }
    }
    if (Object.keys(newObj).length > 0) {
      await this.visitRepository.update(id, newObj);
    }

    return await this.visitRepository.findOne({
      where: { id },
    });
  }
}
