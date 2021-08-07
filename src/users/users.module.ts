import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { UsersMiddleware } from './users.middleware';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
    controllers: [UsersController],
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UsersMiddleware.validateNewUser)
            .forRoutes({ path: '/users/', method: RequestMethod.POST });
    }
}
