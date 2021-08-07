import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";

@Controller()
export class CategoriesController {
    constructor(private categoryService: CategoriesService) { }

    @Post('categories/')
    async createCategory(@Body() data: any) {
        const { category, userId } = data;
        return await this.categoryService.createCategory(category, userId);
    }

    @Delete('categories/:id')
    async deleteCategory(@Param() params, @Body() data) {
        return await this.categoryService.deleteCategory(params.id, data.userId);
    }
}