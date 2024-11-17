import { IsISO8601, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetActiveBudgetsDto {
  @ApiProperty({
    description: "The start date for the active budgets",
    example: "2023-01-01",
  })
  @IsNotEmpty()
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    description: "The end date for the active budgets",
    example: "2023-12-31",
  })
  @IsNotEmpty()
  @IsISO8601()
  endDate: string;
}
