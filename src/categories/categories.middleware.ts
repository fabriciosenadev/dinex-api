import { HttpException, HttpStatus } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import { Applicable } from "./enums/applicable";
import { WebToken } from "src/shared/webtoken";


export class CategoriesMiddleware {
    public static async validateNewCategory(request: Request, response: Response, _next: NextFunction) {
        const { authorization } = request.headers;
        request.body.userId = await WebToken.decodeToUserId(authorization);

        await check('category.name')
            .exists()
            .withMessage('categoria é obrigatória')
            .isLength({ min: 4 })
            .withMessage('nome muito curto')
            .run(request);

        await body('category.applicable').custom(async (value) => {
            if (value !== Applicable.In && value !== Applicable.Out)
                throw new Error('Informe a aplicabilidade da categoria');

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

    public static async prepareToDeleteCategory(request: Request, response: Response, _next: NextFunction) {
        const { authorization } = request.headers;
        request.body.userId = await WebToken.decodeToUserId(authorization);

        _next();
    }
}