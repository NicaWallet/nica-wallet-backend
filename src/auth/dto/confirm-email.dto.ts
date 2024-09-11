import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({ example: 'token123', description: 'Confirmation token sent via email' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
