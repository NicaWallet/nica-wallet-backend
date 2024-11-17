import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteBudgetDto {
  @ApiProperty({ description: 'ID del presupuesto a eliminar' })
  @IsNotEmpty()
  @IsNumber()
  budget_id: number;
}
