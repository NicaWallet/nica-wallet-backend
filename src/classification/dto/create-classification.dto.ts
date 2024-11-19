import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassificationDTO {
    @ApiProperty({ description: 'Name of the classification' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
