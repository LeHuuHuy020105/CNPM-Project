import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { AuthGuard } from 'src/auth/auth-guard';
import { CreateUserDto } from './dto/create_user_dto';
import { UpdateUserDto } from './dto/update_user_dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserById(@Param('id') id: string): Promise<any> {
    return this.userService.findUserById(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }
}
