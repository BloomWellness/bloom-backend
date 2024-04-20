import { ApiProperty } from "@nestjs/swagger";

export class MoodSetRequestBody {
    @ApiProperty(
        {
            description: 'Mood of the user. Must be one of the following: HAPPY, SAD, DEPRESSED, OK',
            type: 'string',
            required: true
        }
    )
    mood: string;

    @ApiProperty(
        {
            description: 'Date of the mood entry. Must be in UTC with the format YYYY-MM-DDTHH:MM:SSZ LIKE 2024-04-17T23:00:00.000Z and just set time hour minute to 0',
            type: 'string',
            required: true
        }
    )
    date: string;
}