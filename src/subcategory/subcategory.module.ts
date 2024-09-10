import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';

@Module({
  providers: [SubcategoryService],
  controllers: [SubcategoryController]
})
export class SubcategoryModule {}
