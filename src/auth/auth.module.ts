import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController],
    imports: [UsersModule],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) { 
        consumer
            .apply(AuthMiddleware.validateLogin)
            .forRoutes({ path: '/auth/', method: RequestMethod.POST});
    }
}
