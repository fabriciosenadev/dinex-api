import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayMethodLaunch } from './pay-method-launch.entity';
import { PayMethodLaunchService } from './pay-method-launch.service';

@Module({
    controllers: [],
    imports: [TypeOrmModule.forFeature([PayMethodLaunch])],
    providers: [PayMethodLaunchService],
    exports: [PayMethodLaunchService],

})
export class PayMethodLaunchModule {}
