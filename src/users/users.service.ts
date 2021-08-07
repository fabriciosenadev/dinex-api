import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: UserRepository
    ) { }

    async createUser(newUser: User) {
        const user = await this.userRepository.create(newUser);
        await this.userRepository.save(user);
        return user;
    }
}