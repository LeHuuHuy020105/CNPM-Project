import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillStatus } from 'src/constants/bill_status';
import { TableStatus } from 'src/constants/table_status';
import { OrderType } from 'src/constants/type_order';
import { CreateOrderDto } from 'src/dto/order/create_order_dto';
import { CreateOrderDetailDto } from 'src/dto/order_detail/create_order_detail';
import { FoodItem } from 'src/entities/fooditem.entity';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { Table } from 'src/entities/table.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
  ) {}

  async create(
    idTable: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    console.log(idTable);
    const table = await this.tableRepository.findOneBy({
      id: idTable,
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${idTable} not found`);
    }
    table.status = TableStatus.OCCUPIED;
    await this.tableRepository.update(idTable, table);
    const order = this.orderRepository.create({
      type: OrderType.DINE_IN,
      totalPrice: 0,
      table,
    });
    return await this.orderRepository.save(order);
  }

  async getCurrentOrder(idTable: number): Promise<any> {
    return await this.orderRepository.findOne({
      where: {
        table: { id: idTable },
        status: BillStatus.UNPAID,
      },
    });
  }

  async addFoodToOrder(
    idTable: number,
    orderDetailDtos: CreateOrderDetailDto[],
  ): Promise<any> {
    // Kiểm tra bàn
    const table = await this.tableRepository.findOneBy({
      id: idTable,
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${idTable} not found`);
    }

    // Tìm Order chưa thanh toán
    const currentOrder = await this.getCurrentOrder(idTable);
    if (!currentOrder) {
      throw new NotFoundException(
        `No unpaid order found for table ID ${idTable}`,
      );
    }

    let totalPriceToAdd = 0;

    // Xử lý từng OrderDetailDto
    for (const dto of orderDetailDtos) {
      // Kiểm tra món ăn
      const foodItem = await this.foodItemRepository.findOneBy({
        id: dto.foodItemId,
      });
      if (!foodItem) {
        throw new NotFoundException(
          `Food item with ID ${dto.foodItemId} not found`,
        );
      }
      if (foodItem.stock < dto.quantity) {
        throw new HttpException(
          `Insufficient stock for ${foodItem.name}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Debug: Log giá trị
      console.log(
        'foodItem.sell_price:',
        foodItem.sell_price,
        'typeof:',
        typeof foodItem.sell_price,
      );
      console.log(
        'dto.quantity:',
        dto.quantity,
        'typeof:',
        typeof dto.quantity,
      );
      console.log(
        'currentOrder.totalPrice (before):',
        currentOrder.totalPrice,
        'typeof:',
        typeof currentOrder.totalPrice,
      );

      // Tính giá món
      const priceToAdd = foodItem.sell_price * dto.quantity;
      if (isNaN(priceToAdd)) {
        throw new BadRequestException(
          `Invalid price or quantity for food item ID ${dto.foodItemId}`,
        );
      }
      totalPriceToAdd += priceToAdd;

      // Tạo và lưu OrderDetail
      const orderDetail = this.orderDetailRepository.create({
        order: currentOrder,
        foodItem,
        quantity: dto.quantity,
      });
      await this.orderDetailRepository.save(orderDetail);

      // Cập nhật stock
      foodItem.stock -= dto.quantity;
      await this.foodItemRepository.save(foodItem);
    }

    // Cập nhật totalPrice
    currentOrder.totalPrice = Number(
      (currentOrder.totalPrice + totalPriceToAdd).toFixed(2),
    );
    console.log('totalPriceToAdd:', totalPriceToAdd);
    console.log('currentOrder.totalPrice (after):', currentOrder.totalPrice);

    await this.orderRepository.save(currentOrder);

    // Trả về Order với quan hệ
    return this.orderRepository.findOne({
      where: { id: currentOrder.id },
      relations: ['table', 'orderDetails', 'orderDetails.foodItem'],
    });
  }
}
