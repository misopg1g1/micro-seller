import { SellerEntity } from "src/seller/seller.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum IdentificationTypeEnum {
    PASAPORTE = 'PASAPORTE',
    NIT = 'NIT',
    DNI = 'DNI',
    RUT = 'RUT',
    CEDULA_DE_EXTRANJERIA = 'CEDULA DE EXTRANJERIA',
  }

@Entity()
export class IdentificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    number: string;
    @Column()
    type: IdentificationTypeEnum;
}