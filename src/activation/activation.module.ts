import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ActivationController } from './activation.controller';
import { Activation } from './activation.entity';
import { ActivationService } from './activation.service';

@Module({
    controllers: [ActivationController],
    imports: [TypeOrmModule.forFeature([Activation]), UsersModule],
    providers: [ActivationService],
    exports: [ActivationService],
})
export class ActivationModule {}
