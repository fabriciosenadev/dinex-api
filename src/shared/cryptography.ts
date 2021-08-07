import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as crypto from "crypto-js";

@Injectable()
export class Cryptography{
    public static async doEncrypt(string: string) {
        try {            
            const encrypted = await crypto.AES.encrypt(
                string.trim(),
                process.env.PASS_KEY
            ).toString()

            return encrypted;
        } catch (error) {
            let msg = "Error to encrypt" + error;
            throw new HttpException({status: 400, error: msg}, HttpStatus.BAD_REQUEST);
        }
    }
    public static async doDecrypt(string: string){
        try {
            const decrypted = await crypto.AES.decrypt(
                string.trim(),
                process.env.PASS_KEY
            ).toString(crypto.enc.Utf8);

            return decrypted;
        } catch (error) {
            console.log("error:"+error);
            let msg = "Error to decrypt" + error;
            throw new HttpException({status: 400, error: msg}, HttpStatus.BAD_REQUEST);
        }
    }
}
