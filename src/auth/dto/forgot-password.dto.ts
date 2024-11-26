import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({
    description: "The email address of the user who forgot their password.",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Invalid email format" }) // Valida que sea un email
  @IsNotEmpty({ message: "Email is required" }) // Valida que no esté vacío
  email: string;
}
