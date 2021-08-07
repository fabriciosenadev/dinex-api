import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { EptestModule } from './eptest/eptest.module';
import { ConfigModule } from '@nestjs/config';
import { Category } from './categories/category.entity';
import { CategoriesUsersModule } from './categories-users/categories-users.module';
import { AuthModule } from './auth/auth.module';
import { CategoryUser } from './categories-users/category-user.entity';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 
                process.env.NODE_ENV === 'test' 
                ? "./src/database/database.test.db" 
                :"./dist/database/dinex.db",
            logging: true,
            synchronize: true,
            entities: [User, Category, CategoryUser],
            migrationsTableName: 'migrations_table',
            migrations: [
               "./src/database/migrations/**.ts"
            ],
            cli: {
               "migrationsDir": "src/database/migrations"
            }
        }),
        EptestModule, 
        UsersModule,
        CategoriesModule,
        CategoriesUsersModule,
        AuthModule
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule { }