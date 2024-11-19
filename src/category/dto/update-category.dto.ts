import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateCategoryDTO } from "./create-category.dto ";

export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {
    @ApiProperty({ description: 'Name of the category', required: false })
    @IsOptional()
    @IsString()
    name?: string;
}
