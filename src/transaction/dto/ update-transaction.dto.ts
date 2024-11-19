import { PartialType } from "@nestjs/mapped-types";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsDateString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @ApiProperty({
    description: "The updated date of the transaction",
    example: "2024-09-20T00:00:00.000Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  date?: string; // Asegúrate de que el tipo de dato coincida con el modelo de Prisma (DateTime)
}
