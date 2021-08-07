import { Body } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('users/')
    createUser(@Body() data: any) {
        return this.userService.createUser(data);
    }
}