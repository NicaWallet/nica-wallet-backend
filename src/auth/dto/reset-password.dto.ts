import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "The new password for the user.",
    example: "newPassword123",
  })
  @IsString({ message: "New password must be a string" })
  @IsNotEmpty({ message: "New password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  newPassword: string;

  @ApiProperty({
    description: "The token sent to the user to reset their password.",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYyNjIwNjIwMCwiZXhwIjoxNjI2MjA5ODAwfQ.1",
  })
  @IsString({ message: "Token must be a string" })
  @IsNotEmpty({ message: "Token is required" })
  token: string;
}
