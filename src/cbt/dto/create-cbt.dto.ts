import { IsString } from "class-validator";

export class CreateCbtDto {
    @IsString()
    title: string;
}
