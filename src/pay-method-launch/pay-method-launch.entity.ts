import { Launch } from "src/launches/launch.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('dx_pay_methods_launches')
export class PayMethodLaunch {
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column()
    pay_method: number;

    @OneToOne(() => Launch)
    @JoinColumn({ name: 'launch_id' })
    launch: Launch;

    @Column()
    launch_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({
        type: 'datetime',
        nullable: true,
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: 'datetime',
        nullable: true,
    })
    deleted_at: Date;
}