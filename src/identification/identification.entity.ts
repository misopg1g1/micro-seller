import { SellerEntity } from "src/seller/seller.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class IdentificationEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    number: string;
    @Column()
    type: string;
    @OneToOne(() => SellerEntity, seller => seller.identification)
    seller: SellerEntity;
}