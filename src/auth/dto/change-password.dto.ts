import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password of the user' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password for the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
