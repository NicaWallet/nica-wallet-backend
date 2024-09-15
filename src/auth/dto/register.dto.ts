import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'First name of the user' })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({ description: 'First surname of the user' })
    @IsNotEmpty()
    @IsString()
    first_surname: string;

    @ApiProperty({ description: 'Second surname of the user', required: false })
    @IsOptional()
    @IsString()
    second_surname?: string;

    @ApiProperty({ description: 'Email of the user' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Phone number of the user', required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ description: 'Password of the user' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: 'Birthdate of the user (format: YYYY-MM-DD)' })
    @IsNotEmpty()
    @IsDateString() 
    birthdate: string;
}


