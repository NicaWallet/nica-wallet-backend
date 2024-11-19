import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { CreateClassificationDTO } from "./create-classification.dto";

export class UpdateClassificationDTO extends PartialType(CreateClassificationDTO) {
    @ApiProperty({ description: 'Name of the classification', required: false })
    @IsOptional()
    @IsString()
    name?: string;
}
