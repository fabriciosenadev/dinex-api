import { HttpException, HttpStatus } from "@nestjs/common";
import { body, check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export class ActivationMiddleware {
    public static async validateActivation(request: Request, response: Response, _next: NextFunction) {
        await check('email')
            .exists()
            .withMessage('E-mail é obrigatório')
            .isEmail()
            .withMessage('E-mail não é válido')
            .run(request);

        await body('activationCode').custom(async (code) => {
            if (code.length !== 6 || isNaN(code))
                throw new Error('Código de ativação inválido');

            return true;
        }).run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            const errors = result.array();
            const msg = errors[0].msg;
            throw new HttpException({ status: 400, error: msg }, HttpStatus.BAD_REQUEST);
        }

        _next();
    }
}
