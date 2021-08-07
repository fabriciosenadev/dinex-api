import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryUser } from "./category-user.entity";

@Injectable()
export class CategoriesUsersService {
    constructor(
        @InjectRepository(CategoryUser) private repository: Repository<CategoryUser>
    ) { }

    public async addCategoryRelationToUser(categoryId: number, userId: string) {
        try {
            const relation = await this.repository.create({
                category_id: categoryId,
                user_id: userId
            });
            await this.repository.save(relation);
        } catch (error) {
            console.log(error);
            const msg = "Error adding category relation to user";
            throw new HttpException({status: 500, error: msg}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findCategoryRelationToUser(categoryId: number, userId: string) {
        return await this.repository.findOne({
            category_id: categoryId,
            user_id: userId,
            deleted_at: null
        });
    }
}