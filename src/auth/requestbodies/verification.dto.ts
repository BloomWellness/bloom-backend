import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


export class VerificationRequestBody{
    @ApiProperty(
        {
            description: 'Email of the user',
            type: 'string',
            required: true
        }
    )
    @IsEmail()
    email: string;
    @ApiProperty(
        {
            description: 'OTP of the user',
            type: 'number',
            required: true
        }
    )
    otc: number;
}