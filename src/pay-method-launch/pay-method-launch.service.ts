import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PayMethodLaunch } from "./pay-method-launch.entity";

@Injectable()
export class PayMethodLaunchService {
    constructor(
        @InjectRepository(PayMethodLaunch) private payMethodLaunch: Repository<PayMethodLaunch>,
    ) { }

    public async addPayMethodRelationToLaunch(payMethodLaunch: PayMethodLaunch) {
        const newPayMethodLaunch = await this.payMethodLaunch.create(payMethodLaunch);
        return await this.payMethodLaunch.save(newPayMethodLaunch);
    }
}