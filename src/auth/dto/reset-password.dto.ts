import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
    @ApiProperty({
        description: 'The email address of the user who forgot their password.',
        example: 'newPassword123',
    })
    newPassword: string;
}