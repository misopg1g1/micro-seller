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

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(VisitEntity)
    private readonly visitRepository: Repository<VisitEntity>,
    private storageService: S3Service,
  ) {}

  // async findAll(): Promise<VisitEntity[]> {
  //   return await this.visitRepository.find({
  //     relations: ['seller'],
  //   });
  // }

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

  // async findOne(id: string): Promise<VisitEntity> {
  //   const visit: VisitEntity = await this.visitRepository.findOne({
  //     where: { id },
  //     relations: ['seller'],
  //   });
  //   if (!visit)
  //     throw new BusinessLogicException(
  //       'La visita con el id dado no fue encontrada',
  //       BusinessError.NOT_FOUND,
  //     );
  //   return visit;
  // }

  async findOne(
    id: string, 
    relations: boolean
    ): Promise<VisitEntity> {
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
        'La visita con el id dado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return visit;
  }

  // async create(visit: VisitEntity): Promise<VisitEntity> {
  //   return await this.visitRepository.save(visit);
  // }

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
    try {
      return await this.visitRepository.save(visitEntity);
    } catch (e) {
      await this.storageService.deleteImage(key);
      if (e instanceof QueryFailedError) {
        throw new BusinessLogicException(e.message, BusinessError.BAD_REQUEST);
      }
    }  
  }

  async update(id: string, visit: VisitEntity): Promise<VisitEntity> {
    const persistedVisit: VisitEntity = await this.visitRepository.findOne({
      where: { id },
    });
    if (!persistedVisit)
      throw new BusinessLogicException(
        'La visita con el id dado no fue encontrada',
        BusinessError.NOT_FOUND,
      );
    return await this.visitRepository.save({
      ...persistedVisit,
      ...visit,
    });
  }
}