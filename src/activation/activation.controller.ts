import { Body, Controller, Post } from "@nestjs/common";
import { ActivationService } from "./activation.service";

@Controller()
export class ActivationController {
    constructor(
        private readonly activationService: ActivationService,
    ) {}
    
    @Post("activate/")
    public async activate(@Body() data: any) {
        const { email, activationCode } = data;
        await this.activationService.activateUser(email, activationCode);
    }

    @Post("send-activation/")
    public async sendActivation(@Body() data: any) {
        const { email } = data;
        return await this.activationService.sendActivation(email);
    }
}