import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule],
  providers: [SubcategoryService],
  controllers: [SubcategoryController],
  exports: [SubcategoryService]
})
export class SubcategoryModule { }
