import { IsEmail, IsNotEmpty, IsString, IsOptional, IsDateString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'First name of the user', required: true, example: 'John' })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({ description: 'First surname of the user', required: true, example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    first_surname: string;

    @ApiProperty({ description: 'Second surname of the user', required: false, example: 'Smith' })
    @IsOptional()
    @IsString()
    second_surname?: string;

    @ApiProperty({ description: 'Email of the user', required: true, example: 'mail@mail.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Phone number of the user', required: false, example: '1234567890' })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ description: 'Password of the user', required: true, example: 'password123' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ description: 'Birthdate of the user (format: YYYY-MM-DD)', required: true, example: '1990-01-01' })
    @IsNotEmpty()
    @IsDateString()
    birthdate: string;

    @ApiProperty({ description: 'Role ID of the user', required: false, example: 1 })
    @IsOptional()
    @IsInt()
    role_id?: number;
}
