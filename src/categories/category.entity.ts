import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dx_categories")
export class Category {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    name: string;

    @Column()
    applicable: number;

    @Column()
    is_custom: number;

    @CreateDateColumn()
    created_at: Date;
}