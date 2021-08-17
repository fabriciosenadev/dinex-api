import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesService } from "src/categories/categories.service";
import { EmailService } from "src/email/email.service";
import { UsersService } from "src/users/users.service";
import { Repository } from "typeorm";
import { Activation } from "./activation.entity";

@Injectable()
export class ActivationService {
    constructor(
        @InjectRepository(Activation) private readonly activationRepository: Repository<Activation>,
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly categoryService: CategoriesService,
    ) { }

    public async activateUser(email: string, activationCode: string) {
        const user = await this.usersService.getUserByEmail(email);
        const registeredCode = await this.getActivationCode(user.id);
        const index = registeredCode.length - 1;

        if (registeredCode[index].activation_code !== activationCode) {
            throw new HttpException({ status: 400, error: "Código de ativação inválido" }, HttpStatus.BAD_REQUEST);
        }

        user.is_active = true;
        await this.usersService.updateUser(user);

        await this.categoryService.bindStandardCategories(user.id);
        
        await this.clearActivationCodes(user.id);

        return {};
    }

    public async sendActivation(email: string) {
        const user = await this.usersService.getUserByEmail(email);
        const activationCode = await this.generateActivationCode();
        await this.setActivationCode(user.id, activationCode);
        
        return await this.emailService.sendActivationEmail(activationCode, user.full_name, email);
    }

    private async getActivationCode(userId: string) {
        return await this.activationRepository.find({
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