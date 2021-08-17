import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesUsersService } from "src/categories-users/categories-users.service";
import { IsCustom } from "./enums/iscustom";
import { Category } from "./category.entity";
import { CategoryRepository } from "./category.repository";
import { Applicable } from "./enums/applicable";

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

    public async bindStandardCategories(userId: string) {
        const hasStandardCategories = await this.hasStandardCategories();
        if (!hasStandardCategories) {
            await this.AddStandardCategories();
        }

        const standardCategories = await this.categoryRepository.find({
            is_custom: IsCustom.No
        });

        this.categoriesUsersService.addStandardCategoriesToUser(userId, standardCategories);
    }

    private async addCategoryRelationToUser(categoryId: number, userId: string) {
        const alreadyExists = await this.categoriesUsersService.findCategoryRelationToUser(categoryId, userId);
        if (alreadyExists)
            throw new HttpException({ status: 409, error: "Categoria ja existe" }, HttpStatus.CONFLICT);

        await this.categoriesUsersService.addCategoryRelationToUser(categoryId, userId);
    }

    private async hasStandardCategories() {
        const allStandardCategories = await this.categoryRepository.find({
            is_custom: IsCustom.No
        });
        return allStandardCategories.length > 0;
    }

    private async AddStandardCategories() {
        const salary = await this.categoryRepository.create({
            name: "Salário",
            applicable: Applicable.In,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(salary);

        const food = await this.categoryRepository.create({
            name: "Alimentação",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(food);

        const beauty = await this.categoryRepository.create({
            name: "Beleza",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(beauty);

        const education = await this.categoryRepository.create({
            name: "Educação",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(education);

        const laser = await this.categoryRepository.create({
            name: "Lazer",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(laser);

        const health = await this.categoryRepository.create({
            name: "Saúde",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        })
        await this.categoryRepository.save(health);

        const transport = await this.categoryRepository.create({
            name: "Transporte",
            applicable: Applicable.Out,
            is_custom: IsCustom.No,
        });
        await this.categoryRepository.save(transport);
    }
}