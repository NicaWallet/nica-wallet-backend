import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDTO {
    @ApiProperty({ description: 'Name of the category' })
    @IsNotEmpty()
    @IsString()
    name: string;

}
