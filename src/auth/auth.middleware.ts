import { HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { check, body, validationResult } from "express-validator";
import { Cryptography } from "../shared/cryptography";

export class AuthMiddleware {
    public static async validateLogin(request: Request, response: Response, _next: NextFunction) {
        await check('email')
            .exists()
            .isEmail()
            .withMessage('Informe um e-mail válido')
            .run(request);

        await body('password').custom(async (value) => {
            const decryptedPassword = await Cryptography.doDecrypt(value);
            if (decryptedPassword.length < 6)
                throw new Error('Informe a senha correta');

            return true;
        }).run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            const errors = result.array();
            const msg = errors[0].msg;
            throw new HttpException({status:401, error: msg}, HttpStatus.UNAUTHORIZED);
        }

        _next();
    }
}