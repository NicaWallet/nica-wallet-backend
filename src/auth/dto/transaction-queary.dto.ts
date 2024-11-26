import { IsOptional, IsInt, IsBoolean } from "class-validator";

export class TransactionQueryDto {
  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;

  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
