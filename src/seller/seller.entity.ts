import { IdentificationEntity } from "src/identification/identification.entity";
import { VisitEntity } from "src/visit/visit.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


export enum ZoneEnum {
    ZONA_CENTRO = 'ZONA CENTRO',
    ZONA_ESTE = 'ZONA ESTE',
    ZONA_OESTE = 'ZONA OESTE',
    ZONA_NORTE = 'ZONA NORTE',
    ZONA_SUR = 'ZONA SUR ',
  }

@Entity()
export class SellerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

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

    @Column({nullable: true})
    updated_at: string;

    @Column({nullable: true})
    deleted_at: string;

    @Column({nullable: true})
    zone: ZoneEnum;

    @OneToMany(() => VisitEntity, visit => visit.seller)
    @JoinColumn()
    visits: [VisitEntity];
    
    @OneToOne(() => IdentificationEntity)
    @JoinColumn()
    identification: IdentificationEntity;
}