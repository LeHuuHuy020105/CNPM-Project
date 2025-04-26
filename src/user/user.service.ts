import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create_user_dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update_user_dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'created_update',
      ],
    });
  }
  async findUserById(id: number): Promise<any> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(creatUserDto: CreateUserDto): Promise<User> {
    const hasPassword = await bcrypt.hash(creatUserDto.password, 10);
    return await this.userRepository.save(creatUserDto);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
