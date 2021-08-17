import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/category.entity";
import { Repository } from "typeorm";
import { CategoryUser } from "./category-user.entity";

@Injectable()
export class CategoriesUsersService {
    constructor(
        @InjectRepository(CategoryUser) private categoryUserRepository: Repository<CategoryUser>
    ) { }

    public async addCategoryRelationToUser(categoryId: number, userId: string) {
        try {
            const relation = await this.categoryUserRepository.create({
                category_id: categoryId,
                user_id: userId
            });
            await this.categoryUserRepository.save(relation);
        } catch (error) {
            console.log(error);
            const msg = "Error adding category relation to user";
            throw new HttpException({ status: 500, error: msg }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async findCategoryRelationToUser(categoryId: number, userId: string) {
        return await this.categoryUserRepository.findOne({
            category_id: categoryId,
            user_id: userId,
            deleted_at: null
        });
    }

    public async addStandardCategoriesToUser(userId: string, standardCategories: Category[]) {
        try {
            for (const standardCategory of standardCategories) {
                const relation = await this.categoryUserRepository.create({
                    category_id: standardCategory.id,
                    user_id: userId
                });
                await this.categoryUserRepository.save(relation);
            }
        } catch (error) {
            console.log(error);
            const msg = "Error adding standard categories to user";
            throw new HttpException({ status: 500, error: msg }, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}