import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestBody {
  @ApiProperty({
    description: 'Use Verify API Response Id',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty({
    description: 'Password of the user',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  password: string;
  @ApiProperty({
    description: 'Name of the user',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  name: string;
}
