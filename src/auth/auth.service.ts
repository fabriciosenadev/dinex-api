import { HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cryptography } from "src/shared/cryptography";
import { WebToken } from "src/shared/webtoken";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";

export class AuthService {
    constructor(
        @InjectRepository(User) private readonly authRepository: Repository<User>
    ) { }

    public async login(email: string, password: string) {
        const user = await this.authRepository.findOne({
            email
        });

        if (!user) {
            const notFound = "Usuário não localizado";
            throw new HttpException({ status: 401, error: notFound }, HttpStatus.UNAUTHORIZED);
        }

        const decryptedPassword = await Cryptography.doDecrypt(user.password);
        const decryptedReceivedPass = await Cryptography.doDecrypt(password);

        if (decryptedPassword !== decryptedReceivedPass) {
            const wrongCredentials = "Usuário ou senha está/ estão incorreto(s)";
            throw new HttpException({ status: 401, error: wrongCredentials }, HttpStatus.UNAUTHORIZED);
        }

        const { id } = user;
        return await WebToken.generate(id);
    }
}