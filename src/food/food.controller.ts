import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
import { AuthGuard } from 'src/auth/auth-guard';
import { CreateCategoryDto } from 'src/category/dto/create_category_dto';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dto/create_food_dto';
import { FilterFoodDto } from './dto/filter_food_dto';
import { ApiQuery } from '@nestjs/swagger';
import { FoodItem } from 'src/entities/fooditem.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createFoodDto: CreateFoodDto): Promise<FoodItem> {
    return this.foodService.create(createFoodDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'items_per_page', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({
    name: 'search_by',
    required: false,
    enum: ['name'],
  }) // Chỉ định các trường hợp lệ
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({
    name: 'min_price',
    required: false,
  })
  @ApiQuery({ name: 'max_price', required: false })
  findAll(@Query() query: FilterFoodDto): Promise<any> {
    console.log(query);
    return this.foodService.findAll(query);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.foodService.delete(Number(id));
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getFoodByID(@Param('id') id: string): Promise<any> {
    return this.foodService.findById(Number(id));
  }

  @Post(':foodID/upload-image-food')
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
  ) // trung voi field name khi fontend truyen len
  uploadAvatar(
    @Param('foodID') foodID: string,
    @Req()
    req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateResult> {
    console.log('upload image category');
    console.log('user data ', req.user_data);
    console.log(file);
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError);
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.foodService.updateImage(
      Number(foodID),
      file.destination + '/' + file.filename,
    );
  }
}
