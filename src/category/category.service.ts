import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create_category_dto';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDTO: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save(createCategoryDTO);
  }

  async findById(id: number): Promise<any> {
    return await this.categoryRepository.findOneBy({ id });
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      select: [
        'id',
        'name',
        'description',
        'status',
        'created_at',
        'created_update',
      ],
    });
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.categoryRepository.delete(id);
  }

  async update(
    id: number,
    updateCategoryDTO: CreateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.categoryRepository.update(id, updateCategoryDTO);
  }
}
