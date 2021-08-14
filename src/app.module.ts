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
import { ActivationModule } from './activation/activation.module';
import { Activation } from './activation/activation.entity';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: false,
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_PASS,
                },
            },
            defaults: {
                from: process.env.EMAIL_NAME + ' <' + process.env.EMAIL_ADDRESS + '>',
            },
            template: {
                dir: process.env.TEMPLATE_PATH,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                }
            },
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database:
                process.env.NODE_ENV === 'test'
                    ? "./src/database/database.test.db"
                    : "./dist/database/dinex.db",
            logging: true,
            synchronize: true,
            entities: [User, Category, CategoryUser, Activation],
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
        AuthModule,
        ActivationModule,
        EmailModule
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule { }
