import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class CustomParseIntPipe implements PipeTransform<string | number, number> {
  transform(value: string | number): number {
    const val = typeof value === "string" ? parseInt(value, 10) : value;

    if (isNaN(val)) {
      throw new BadRequestException("Validation failed (numeric string or number is expected)");
    }

    return val;
  }
}
