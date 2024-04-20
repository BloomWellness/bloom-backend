import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DateJournalRequestBody {
    @ApiProperty(
        {
            description: 'Date of the mood entry. Must be in UTC with the format YYYY-MM-DDTHH:MM:SSZ LIKE 2024-04-17T23:00:00.000Z and just set time hour minute to 0',
            type: 'string',
            required: true
        }
    )
    @IsString()
    date:   string;
}