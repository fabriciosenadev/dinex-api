import { Body, Controller, Post } from "@nestjs/common";
import { Cryptography } from "src/shared/cryptography";

@Controller()
export class EpTestController {
    @Post('test/encrypt')
    async encrypt(@Body() data: any) {
        const { pass1, pass2 } = data;
        const encryptPass1 = await Cryptography.doEncrypt(pass1);
        const encryptPass2 = await Cryptography.doEncrypt(pass2);
        
        return { encryptPass1, encryptPass2 };
    }
}