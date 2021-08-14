import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
    controllers: [],
    imports: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
