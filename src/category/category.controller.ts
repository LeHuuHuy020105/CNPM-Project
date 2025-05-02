import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create_category_dto';
import { UpdateCategoryDto } from './dto/update_category_dto';
import { AuthGuard } from 'src/auth/auth-guard';
import { FoodItem } from 'src/entities/fooditem.entity';
import { ApiQuery } from '@nestjs/swagger';
import { FilterCategoryDto } from './dto/filter_category_dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query() query: FilterCategoryDto): Promise<any> {
    return this.categoryService.findAll(query);
  }
  @Get(':id')
  getCategoryById(@Param('id') id: string): Promise<any> {
    return this.categoryService.findById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('imageFood', {
      storage: storageConfig('FoodImage'),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        const allowedExtArr = ['.jpg', '.png', '.jpeg'];
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Wrong extension type. Accepted file ext are: ${allowedExtArr.toString()}`;
          cb(null, false);
        } else {
          const fileSize = parseInt(req.headers['content-length']);
          if (fileSize > 1024 * 1024 * 5) {
            req.fileValidationError = `File size is too large. Accepted file size is less than 5MB `;
          } else {
            cb(null, true);
          }
        }
      },
    }),
  )
  create(
    @Req() req: any,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Category> {
    console.log(createCategoryDto);
    console.log(file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.categoryService.create(
      createCategoryDto,
      file.destination + '/' + file.filename,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDTO: UpdateCategoryDto,
  ) {
    return this.categoryService.update(Number(id), updateCategoryDTO);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.categoryService.delete(Number(id));
  }
}
