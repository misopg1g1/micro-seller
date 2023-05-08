import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SellerEntity } from 'src/seller/seller.entity';

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
  @ManyToOne(() => SellerEntity, (seller) => seller.visits)
  @JoinColumn()
  seller: SellerEntity;
}
