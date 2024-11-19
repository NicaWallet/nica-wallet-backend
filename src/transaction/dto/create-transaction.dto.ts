import { IsInt, IsNumber, IsPositive, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty({
    description: "The amount of the transaction",
    example: 100.5,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: "The ID of the category",
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  category_id: number;

  @ApiProperty({
    description: "The ID of the subcategory",
    example: 2,
  })
  @IsInt()
  @IsNotEmpty()
  subcategory_id: number;

  @ApiProperty({
    description: "The ID of the classification",
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  classification_id: number;
}
