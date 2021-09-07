import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayMethodLaunchModule } from 'src/pay-method-launch/pay-method-launch.module';
import { Launch } from './launch.entity';
import { LaunchesController } from './launches.controller';
import { LaunchesMiddleware } from './launches.middleware';
import { LaunchesService } from './launches.service';

@Module({
    controllers: [LaunchesController],
    imports: [TypeOrmModule.forFeature([Launch]), PayMethodLaunchModule],
    providers: [LaunchesService],
    exports: [LaunchesService],
})
export class LaunchesModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LaunchesMiddleware.validateLaunch)
            .forRoutes({ path: '/launches/', method: RequestMethod.POST });
    }
}
