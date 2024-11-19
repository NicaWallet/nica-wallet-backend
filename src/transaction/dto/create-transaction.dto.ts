import { IsInt, IsNumber, IsPositive, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

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

  @ApiProperty({
    description: "The ID of the recurring transaction",
    example: 4,
    required: false,
  })
  @IsInt()
  @IsOptional()
  recurring_transaction_id?: number;

  @ApiProperty({
    description: "The type of the transaction",
    example: TransactionType.INCOME,
  })
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;
}
