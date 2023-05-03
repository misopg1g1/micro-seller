import { IdentificationEntity } from "src/identification/identification.entity";
import { VisitEntity } from "src/visit/visit.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SellerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    first_name: string;
    @Column()
    last_name: string;
    @Column()
    sales_commission: number;
    @Column()
    status: boolean;
    @Column()
    created_at: string;
    @Column()
    updated_at: string;
    @Column()
    deleted_at: string;
    @OneToMany(() => VisitEntity, visit => visit.seller)
    visits: VisitEntity[];
    @OneToOne(() => IdentificationEntity, identification => identification.seller)
    @JoinColumn()
    identification: IdentificationEntity;
}