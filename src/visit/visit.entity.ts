import { SellerEntity } from "src/seller/seller.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VisitEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    visit_date: string;
    @Column()
    image_url: string;
    @Column()
    description: string;
    @Column()
    order_id: string;
    @ManyToOne(() => SellerEntity, seller => seller.visits)
    seller: SellerEntity;
}