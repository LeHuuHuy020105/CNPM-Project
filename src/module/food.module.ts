import { Module } from '@nestjs/common';
import { FoodController } from '../food/food.controller';
import { FoodService } from '../food/food.service';
import { ConfigModule } from '@nestjs/config';
import { FoodItem } from 'src/entities/fooditem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodItem]),
    TypeOrmModule.forFeature([Category]),
    ConfigModule,
  ],
  controllers: [FoodController],
  providers: [FoodService, CategoryService],
})
export class FoodModule {}
