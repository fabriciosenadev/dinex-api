import { Body, Post } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post("/login/")
    public async login(@Body() data: any) {
        const { email, password } = data;
        const token = await this.authService.login(email, password);
        return { token };
    }
}