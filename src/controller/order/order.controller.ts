import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';
import { CreateCategoryDto } from 'src/dto/category/create_category_dto';
import { AddFoodOrderDto } from 'src/dto/order/add_food_order_dto';
import { CreateOrderDto } from 'src/dto/order/create_order_dto';
import { CreateOrderDetailDto } from 'src/dto/order_detail/create_order_detail';
import { Order } from 'src/entities/order.entity';
import { OrderService } from 'src/service/order/order.service';
import { TableService } from 'src/service/table/table.service';

@ApiTags('orders')
@Controller('table')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private tableService: TableService,
  ) {}

  @Post(':idTable/menu')
  @Public()
  create(
    @Param('idTable') idTable: string,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.create(Number(idTable), createOrderDto);
  }

  @Get(':idTable/order/qr')
  @Public()
  getQR(@Param('idTable') idTable: string): Promise<any> {
    // TODO: lay order hien tai
    return this.tableService.getQRCode(Number(idTable));
  }
  @Get(':idTable/order')
  @Public()
  getCurrenOrder(@Param('idTable') idTable: string): Promise<any> {
    return this.orderService.getCurrentOrder(Number(idTable));
  }

  @Post(':idTable/order/add-item')
  @Public()
  addFoodToOrder(
    @Param('idTable') idTable: string,
    @Body() orderDetailDto: AddFoodOrderDto,
  ): Promise<any> {
    return this.orderService.addFoodToOrder(Number(idTable), orderDetailDto);
  }
}
