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
import { AddFoodOrderDto } from 'src/dto/order/add_food_order_dto';
import { CreateOrderDto } from 'src/dto/order/create_order_dto';
import { CreateOrderDetailDto } from 'src/dto/order_detail/create_order_detail';
import { FoodItem } from 'src/entities/fooditem.entity';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { Table } from 'src/entities/table.entity';
import { DataSource, Repository } from 'typeorm';

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
    private readonly dataSource: DataSource,
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
    await this.tableRepository.update(idTable, table);
    const order = this.orderRepository.create({
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
    orderDetailDto: AddFoodOrderDto,
  ): Promise<any> {
    // Check table
    const table = await this.tableRepository.findOneBy({ id: idTable });
    if (!table) {
      throw new NotFoundException(`Table with ID ${idTable} not found`);
    }

    // Find unpaid order
    const currentOrder = await this.getCurrentOrder(idTable);
    if (!currentOrder) {
      throw new NotFoundException(
        `No unpaid order found for table ID ${idTable}`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalPriceToAdd = 0;

      // Process each OrderDetailDto
      for (const dto of orderDetailDto.foods) {
        // Check food item with SELECT FOR UPDATE to prevent race conditions
        const foodItem = await queryRunner.manager.findOne(FoodItem, {
          where: { id: dto.foodItemId },
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

        // Calculate price
        const priceToAdd = foodItem.sell_price * dto.quantity;
        if (isNaN(priceToAdd)) {
          throw new BadRequestException(
            `Invalid price or quantity for food item ID ${dto.foodItemId}`,
          );
        }
        totalPriceToAdd += priceToAdd;

        // Create and save OrderDetail
        const orderDetail = this.orderDetailRepository.create({
          // order: currentOrder,
          foodItem,
          quantity: dto.quantity,
        });
        console.log(orderDetail);
        await queryRunner.manager.save(OrderDetail, orderDetail);

        // Update stock
        foodItem.stock -= dto.quantity;
        await queryRunner.manager.save(FoodItem, foodItem);
      }

      // Update totalPrice with precise calculation
      currentOrder.totalPrice = Number(
        (currentOrder.totalPrice + totalPriceToAdd).toFixed(2),
      );
      await queryRunner.manager.save(Order, currentOrder);

      await queryRunner.commitTransaction();

      // Return Order with relations
      return this.orderRepository.findOne({
        where: { id: currentOrder.id },
        relations: ['table', 'orderDetails', 'orderDetails.foodItem'],
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error instanceof HttpException
        ? error
        : new BadRequestException(
            `Failed to add food to order: ${error.message}`,
          );
    } finally {
      await queryRunner.release();
    }
  }
}
