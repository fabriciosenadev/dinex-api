import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { ActivationController } from './activation.controller';
import { Activation } from './activation.entity';
import { ActivationMiddleware } from './activation.middleware';
import { ActivationService } from './activation.service';

@Module({
    controllers: [ActivationController],
    imports: [
        TypeOrmModule.forFeature([Activation]),
        UsersModule,
        EmailModule,
        CategoriesModule,
    ],
    providers: [ActivationService],
    exports: [ActivationService],
})
export class ActivationModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ActivationMiddleware.validateActivation)
            .forRoutes({ path: 'activate/', method: RequestMethod.POST });
    }
}
