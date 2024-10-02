import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for User Response.
 */
export class UserResponseDto {
    /**
     * Unique identifier for the user.
     */
    @ApiProperty({ description: 'Unique identifier for the user.', example: 1 })
    user_id: number;

    /**
     * First name of the user.
     */
    @ApiProperty({ description: 'First name of the user.', example: 'John' })
    first_name: string;

    /**
     * Middle name of the user (optional).
     */
    @ApiProperty({ description: 'Middle name of the user (optional).', required: false, example: 'Doe' })
    middle_name?: string;

    /**
     * First surname of the user.
     */
    @ApiProperty({ description: 'First surname of the user.', example: 'Doe' })
    first_surname: string;

    /**
     * Second surname of the user (optional).
     */
    @ApiProperty({ description: 'Second surname of the user (optional).', required: false, example: 'Smith' })
    second_surname?: string;

    /**
     * Email address of the user.
     */
    @ApiProperty({ description: 'Email address of the user.', example: 'mail@mail.com' })
    email: string;

    /**
     * Phone number of the user (optional).
     */
    @ApiProperty({ description: 'Phone number of the user (optional).', required: false, example: '1234567890' })
    phone_number?: string;

    /**
     * Birthdate of the user.
     */
    @ApiProperty({ description: 'Birthdate of the user.', example: '1990-01-01' })
    birthdate?: Date;

    /**
     * Timestamp when the user was created.
     */
    @ApiProperty({ description: 'Timestamp when the user was created.', example: '2021-01-01T00:00:00.000Z' })
    created_at: Date;

    /**
     * Timestamp when the user was last updated.
     */
    @ApiProperty({ description: 'Timestamp when the user was last updated.', example: '2021-01-01T00:00:00.000Z' })
    updated_at: Date;
}