import { HttpException, HttpStatus } from "@nestjs/common";
import { body, check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Cryptography } from "src/shared/cryptography";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "./user.repository";

export class UsersMiddleware {
    public static async validateNewUser(request: Request, response: Response, _next: NextFunction) {
        await check('full_name')
            .exists()
            .withMessage('Nome completo é obrigatório')
            .isLength({ min: 10 })
            .withMessage('Nome muito curto, por favor informe nome completo')
            .run(request);

        await check('email')
            .exists()
            .withMessage('E-mail é obrigatório')
            .isEmail()
            .withMessage('E-mail não é válido')
            .run(request);

        await body('password').custom(async (value) => {
            const decryptedPassword = await Cryptography.doDecrypt(value);
            if (decryptedPassword.length < 6)
                throw new Error('Senha deve ter pelo meno 6 caracteres');

            return true;
        }).run(request);

        await body('verifyPass').custom(async (value, { req }) => {
            const decryptedVerifyPass = await Cryptography.doDecrypt(value);
            const decryptedPassword = await Cryptography.doDecrypt(req.body.password);
            if (decryptedVerifyPass !== decryptedPassword)
                throw new Error('Senha e confirmação devem ser iguais');

            return true;
        }).run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            const errors = result.array();
            const msg = errors[0].msg;
            throw new HttpException({ status: 400, error: msg }, HttpStatus.BAD_REQUEST);
        }

        const userRepository = getCustomRepository(UserRepository);
        const hasUser = await userRepository.findOne({ email: request.body.email });
        if (hasUser)
            throw new HttpException({ status: 400, error: "Usuário ja cadastrado!" }, HttpStatus.BAD_REQUEST);

        _next();
    }
}
