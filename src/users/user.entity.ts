import { Column, Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from "uuid";

@Entity("dx_users")
export class User {
    @PrimaryColumn()
    readonly id: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_on: Date;

    @UpdateDateColumn({
        type: "datetime",
        nullable: true
    })
    updated_on: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid();
        }
    }
}