import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateBudgetDto } from "./create-budget.dto";
import { IsOptional, IsNumber, IsDateString } from "class-validator";

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {
  @ApiProperty({ description: "Cantidad del presupuesto", required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: "Fecha de inicio del presupuesto en formato ISO", required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: "Fecha de finalización del presupuesto en formato ISO", required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
