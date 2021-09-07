import { HttpException, HttpStatus } from "@nestjs/common";
import { body, check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { WebToken } from "src/shared/webtoken";
import { Status } from "./enum/status";
import { PayMethod } from "src/pay-method-launch/enum/paymethod";

export class LaunchesMiddleware {
    public static async validateLaunch(request: Request, response: Response, _next: NextFunction) {
        const { authorization } = request.headers;        
        request.body.userId = await WebToken.decodeToUserId(authorization);

        await check('launch.date')
            .trim()
            .isDate()
            .withMessage('Data é obrigatória')
            .run(request);

        await check('launch.value')
            .exists()
            .withMessage('Valor é obrigatório')
            .isFloat({ gt: 0.0 })
            .withMessage('Valor não é válido')
            .run(request);

        await check('launch.category_id')
            .exists()
            .withMessage("Categoria é obrigatória")
            .isInt({ gt: 0 })
            .withMessage('Categoria não é válida')
            .run(request);

        await body('launch.status').custom(async (value) => {
            if (value !== Status.Paid && value !== Status.Pending && value !== Status.Received)
                throw new Error('Informe o status do lançamento');

            return true;
        }).run(request);

        const { payMethodLaunch } = request.body;
        if (payMethodLaunch !== undefined) {
            await body('payMethodLaunch.pay_method').custom(async (value) => {
                if (value !== PayMethod.Cash && value !== PayMethod.Debit && value !== PayMethod.Credit)
                    throw new Error('Informe uma Forma de pagamento');

                return true;
            }).run(request);
        }

        const result = validationResult(request);
        if (!result.isEmpty()) {
            const errors = result.array();
            const msg = errors[0].msg;
            throw new HttpException({ status: 400, error: msg }, HttpStatus.BAD_REQUEST);
        }

        _next();
    }
}