import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesUsersModule } from 'src/categories-users/categories-users.module';
import { CategoriesUsersService } from 'src/categories-users/categories-users.service';
import { CategoriesController } from './categories.controller';
import { CategoriesMiddleware } from './categories.middleware';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';

@Module({
    controllers: [CategoriesController],
    imports: [TypeOrmModule.forFeature([Category]), CategoriesUsersModule],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CategoriesMiddleware.validateNewCategory)
            .forRoutes({ path: '/categories/', method: RequestMethod.POST })
            .apply(CategoriesMiddleware.prepareToDeleteCategory)
            .forRoutes({ path: '/categories/{id}', method: RequestMethod.DELETE });        
    }
}


