import { PartialType } from "@nestjs/swagger";
import { CreateSubcategoryDTO } from "./create-subcategory.dto";

export class UpdateSubcategoryDTO extends PartialType(CreateSubcategoryDTO) {
}