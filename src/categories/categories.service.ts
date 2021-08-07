import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesUsersService } from "src/categories-users/categories-users.service";
import { IsCustom } from "src/shared/enums/IsCustom";
import { Category } from "./category.entity";
import { CategoryRepository } from "./category.repository";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoryRepository: CategoryRepository,
        private categoriesUsersService: CategoriesUsersService
    ) { }
    public async createCategory(category: Category, userId: string) {
        let categoryCandidate: Category;

        const alreadyExists = await this.categoryRepository.find({
            name: category.name
        });

        if (alreadyExists.length === 0) {
            category.is_custom = IsCustom.Yes;
            categoryCandidate = await this.categoryRepository.create(category);
            console.log(categoryCandidate);
            await this.categoryRepository.save(categoryCandidate);
        }
        else
            categoryCandidate = alreadyExists[0];

        const newCategory = categoryCandidate;

        await this.addCategoryRelationToUser(newCategory.id, userId);

        return newCategory;
    }

    public async deleteCategory(categoryId: number, userId: string) {
        const category = await this.categoriesUsersService.findCategoryRelationToUser(categoryId, userId);
        if (!category)
            throw new HttpException({ status: 404, error: "Categoria não encontrada" }, HttpStatus.NOT_FOUND);

        await this.categoryRepository.delete(category);

    }

    private async addCategoryRelationToUser(categoryId: number, userId: string) {
        const alreadyExists = await this.categoriesUsersService.findCategoryRelationToUser(categoryId, userId);
        if (alreadyExists)
            throw new HttpException({ status: 409, error: "Categoria ja existe" }, HttpStatus.CONFLICT);

        await this.categoriesUsersService.addCategoryRelationToUser(categoryId, userId);
    }
}