import { HttpException, HttpStatus } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

export class WebToken {
    public static async decodeToUserId(authorization: string) {
        await this.verifyAuthorization(authorization);

        const [, token] = authorization.split(' ');

        return jwt.verify(
            token,
            process.env.SECRET,
            (error, decoded) => {
                if (error)
                    throw new HttpException({ status: 500, error }, HttpStatus.INTERNAL_SERVER_ERROR);

                return decoded.id;
            });
    }

    public static async generate(id: string) {
        return jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 3600 * 24 // expires in a day
        });
    }

    private static async verifyAuthorization(token: string) {
        if (!token)
            throw new HttpException({ status: 401, error: "No token provided" }, HttpStatus.UNAUTHORIZED);
    }
}