import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TwoFactorAuthDto {
  @ApiProperty({ example: '123456', description: 'The two-factor authentication code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
