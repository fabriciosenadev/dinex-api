import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository
    ) { }

    public async createUser(newUser: User) {
        newUser.is_active = false;
        const user = await this.userRepository.create(newUser);
        await this.userRepository.save(user);
        user.password = null;
        return user;
    }

    public async getUserByEmail(email: string) {
        return await this.userRepository.findOne({ email });
    }
}