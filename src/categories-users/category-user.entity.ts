import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "src/categories/category.entity";
import { User } from "src/users/user.entity";

@Entity('dx_categories_users')
export class CategoryUser {
    @PrimaryGeneratedColumn()
    readonly id: number;

    @Column()
    user_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    category_id: number;

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;
    
    @CreateDateColumn()
    created_at: Date;

    @DeleteDateColumn({
        type: 'datetime',
        nullable: true
    })
    deleted_at: Date;
}