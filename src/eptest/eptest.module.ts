import { Module } from '@nestjs/common';
import { EpTestController } from './eptest.controller';

@Module({
    controllers: [EpTestController]
})
export class EptestModule {}
