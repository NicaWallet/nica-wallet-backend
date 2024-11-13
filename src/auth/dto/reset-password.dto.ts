import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'The email address of the user who forgot their password.',
        example: 'newPassword123',
    })
    newPassword: string;

    @ApiProperty({
        description: 'The token sent to the user to reset their password.',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyNjIwNjIwMCwiZXhwIjoxNjI2MjA5ODAwfQ.1 ',
    })
    token: string;
}