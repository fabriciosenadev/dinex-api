import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Activation } from "./activation.entity";

@Injectable()
export class ActivationService {
    constructor(
        @InjectRepository(Activation) private readonly activationRepository: Repository<Activation>,
        private readonly usersService: UsersService
    ) { }

    public async activateUser(email: string, activationCode: string) {
        const user = await this.usersService.getUserByEmail(email);
        const registeredCode = await this.getActivationCode(user.id);

        if (registeredCode.activation_code !== activationCode) {
            throw new HttpException({ status: 400, error: "Invalid activation code" }, HttpStatus.BAD_REQUEST);
        }

        user.is_active = true;
        await this.usersService.updateUser(user);

        await this.clearActivationCodes(user.id);
        
        return {};
    }

    public async sendActivation(email: string) {
        const user = await this.usersService.getUserByEmail(email);
        const activationCode = await this.generateActivationCode();
        await this.setActivationCode(user.id, activationCode);

        // await this.usersService.sendActivationEmail(email, activationUrl);

        return activationCode; // temporary
    }

    private async getActivationCode(userId: string) {
        return await this.activationRepository.findOne({
            user_id: userId
        });
    }

    private async setActivationCode(userId: string, activationCode: string) {
        
        const activation = await this.activationRepository.create({
            user_id: userId,
            activation_code: activationCode
        });
        await this.activationRepository.save(activation);
    }

    private async clearActivationCodes(userId: string) {
        await this.activationRepository.delete({
            user_id: userId
        });
    }


    private async generateActivationCode() {
        var arr = [];
        while (arr.length < 6) {
            var r = Math.floor(Math.random() * 9) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        const code = arr.join('');
        return code;
    }
}