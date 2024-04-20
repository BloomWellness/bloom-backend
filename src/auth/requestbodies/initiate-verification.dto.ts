import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";


export class InitiateVerificationRequestBody{
    @ApiProperty(
        {
            description: 'Email of the user',
            type: 'string',
            required: true
        }
    )
    @IsEmail()
    email: string;
}