import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubcategoryDTO {
    @ApiProperty({ description: 'Name of the subcategory' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'ID of the category' })
    @IsNotEmpty()
    @IsNumber()
    category_id: number;
}
