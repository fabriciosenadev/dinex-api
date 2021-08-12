import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Cryptography } from "src/shared/cryptography";
import { WebToken } from "src/shared/webtoken";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService
    ) { }

    public async login(email: string, password: string) {
        const user = await this.usersService.getUserByEmail(email);
        await this.validateUser(user);
        await this.validatePassword(user.password, password);
        const { id } = user;
        return await WebToken.generate(id);
    }

    private async validateUser(user: User) {
        if (!user) {
            const notFound = "Usuário não localizado";
            throw new HttpException({ status: 401, error: notFound }, HttpStatus.UNAUTHORIZED);
        }

        if(user.is_active === false) {
            const notActive = "Usuário não ativo";
            throw new HttpException({ status: 401, error: notActive }, HttpStatus.UNAUTHORIZED);
        }
    }

    private async validatePassword(password: string, receivedPassword: string) {
        const decryptedPassword = await Cryptography.doDecrypt(password);
        const decryptedReceivedPass = await Cryptography.doDecrypt(receivedPassword);

        if (decryptedPassword !== decryptedReceivedPass) {
            const wrongCredentials = "Usuário ou senha está/ estão incorreto(s)";
            throw new HttpException({ status: 401, error: wrongCredentials }, HttpStatus.UNAUTHORIZED);
        }
    }
}