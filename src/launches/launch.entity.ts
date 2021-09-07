import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('dx_launches')
export class Launch {
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column()
    date: Date;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column()
    category_id: number;

    @Column({ nullable: true })
    description: string;

    @Column()
    value: number;

    @Column()
    status: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: string;

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