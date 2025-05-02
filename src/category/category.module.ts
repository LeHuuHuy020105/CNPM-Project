import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from '../entities/category.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    ConfigModule, // Thêm để cung cấp Repository<Category>
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService], // Thêm nếu cần dùng CategoryService ở module khác
})
export class CategoryModule {}
