import { Module } from '@nestjs/common';
import { UserController } from '../controller/user/user.controller';
import { UserService } from '../service/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Order } from 'src/entities/order.entity';
import { OrderController } from 'src/controller/order/order.controller';
import { OrderService } from 'src/service/order/order.service';
import { Table } from 'src/entities/table.entity';
import { FoodItem } from 'src/entities/fooditem.entity';
import { TableService } from 'src/service/table/table.service';
import { OrderDetail } from 'src/entities/order_detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Table, FoodItem, OrderDetail]),
    ConfigModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, TableService, OrderService],
})
export class OrderModule {}
