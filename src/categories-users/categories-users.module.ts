import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesUsersService } from './categories-users.service';
import { CategoryUser } from './category-user.entity';

@Module({
    controllers: [],
    imports: [TypeOrmModule.forFeature([CategoryUser])],
    providers: [CategoriesUsersService],
    exports: [CategoriesUsersService],
})
export class CategoriesUsersModule {}
