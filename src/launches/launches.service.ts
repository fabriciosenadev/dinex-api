import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PayMethodLaunch } from "src/pay-method-launch/pay-method-launch.entity";
import { PayMethodLaunchService } from "src/pay-method-launch/pay-method-launch.service";
import { Repository } from "typeorm";
import { Launch } from "./launch.entity";

@Injectable()
export class LaunchesService {
    constructor(
        @InjectRepository(Launch) private launchRepository: Repository<Launch>,
        private payMethodLaunchService: PayMethodLaunchService,
    ) { }

    public async createLaunch(launch: Launch, payMethodLaunch: PayMethodLaunch, userId: string) {
        launch.user_id = userId;
        const newLaunch = await this.launchRepository.create(launch);        
        await this.launchRepository.save(newLaunch);

        if (payMethodLaunch !== undefined) {
            payMethodLaunch.launch_id = newLaunch.id;
            const newPayMethod = await this.addPayMethodLaunch(payMethodLaunch);
            return { launch: newLaunch, payMethodLaunch: newPayMethod };
        }
        else
            return { launch: newLaunch }
    }

    private async addPayMethodLaunch(payMethodLaunch: PayMethodLaunch) {
        return await this.payMethodLaunchService.addPayMethodRelationToLaunch(payMethodLaunch);
    }
}