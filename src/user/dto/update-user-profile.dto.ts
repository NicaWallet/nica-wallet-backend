import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateUserProfileDto {
    @ApiProperty({ description: 'First name of the user', example: 'John' })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({ description: 'Middle name of the user', example: 'Doe' })
    @IsOptional()
    middle_name?: string;

    @ApiProperty({ description: 'First surname of the user', example: 'Doe' })
    @IsOptional()
    first_surname?: string;

    @ApiProperty({ description: 'Second surname of the user', example: 'Doe' })
    @IsOptional()
    second_surname?: string;

    @ApiProperty({ description: 'Phone number of the user', example: '123456789' })
    @IsOptional()
    phone_number?: string;

    @ApiProperty({ description: 'Birthdate of the user', example: '1990-01-01' })
    @IsOptional()
    @IsString() 
    birthdate?: string;
}