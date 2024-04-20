import { ApiProperty } from "@nestjs/swagger";


export class LoginRequestBody {
    @ApiProperty(
        {
            description: 'Email of the user',
            type: 'string',
            required: true
        }
    )
    email: string;
    @ApiProperty(
        {
            description: 'Password of the user',
            type: 'string',
            required: true
        }
    )
    password: string;
}