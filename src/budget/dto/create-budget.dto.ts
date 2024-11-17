import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsDateString } from "class-validator";

export class CreateBudgetDto {
  @ApiProperty({ description: "ID de la categoría asociada al presupuesto" })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: "Cantidad del presupuesto" })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ description: "Fecha de inicio del presupuesto en formato ISO" })
  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @ApiProperty({ description: "Fecha de finalización del presupuesto en formato ISO" })
  @IsNotEmpty()
  @IsDateString()
  end_date: string;
}