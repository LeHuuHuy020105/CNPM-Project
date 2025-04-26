import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create_category_dto';
import { UpdateCategoryDto } from './dto/update_category_dto';
import { AuthGuard } from 'src/auth/auth-guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
  @Get(':id')
  getCategoryById(@Param('id') id: string): Promise<any> {
    return this.categoryService.findById(Number(id));
  }

  @Post()
  create(@Body() createCategoryDTO: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDTO);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDTO: UpdateCategoryDto,
  ) {
    return this.categoryService.update(Number(id), updateCategoryDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.delete(Number(id));
  }
}
