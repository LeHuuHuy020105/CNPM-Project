import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  In,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { PurchaseOrder } from '../../entities/purchase.entity';
import { Supplier } from '../../entities/supplier.entity';
import { User } from '../../entities/user.entity';
import { FoodItem } from '../../entities/fooditem.entity';
import { PurchaseOrderDetail } from '../../entities/purchase_order_detail.entity';
import { CreatePurchaseOrderDto } from '../../dto/purchase/create_purchase_order_dto';
import { PurchaseOrderStatus } from '../../constants/purchase_order_status';
import { identity } from 'rxjs';
import { UpdatePurchaseOrderDto } from '../../dto/purchase/update_purchase_order_dto';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FoodItem)
    private foodItemRepository: Repository<FoodItem>,
    @InjectRepository(PurchaseOrderDetail)
    private purchaseOrderDetailRepository: Repository<PurchaseOrderDetail>,
    private dataSource: DataSource,
  ) {}

  async create(
    createPurchaseOrderDto: CreatePurchaseOrderDto,
    userId: number,
  ): Promise<PurchaseOrder> {
    // Validate request body
    if (!createPurchaseOrderDto) {
      throw new HttpException(
        'Request body is undefined',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { supplierId, details } = createPurchaseOrderDto;

    if (
      !supplierId ||
      !details ||
      !Array.isArray(details) ||
      details.length === 0
    ) {
      throw new HttpException(
        'Invalid request body: supplierId and details are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate Supplier
    const supplier = await this.supplierRepository.findOneBy({
      id: supplierId,
    });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierId} not found`);
    }

    // Validate User
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate FoodItems
    const foodItemIds = details.map((detail) => detail.foodItemId);
    const foodItems = await this.foodItemRepository.findBy({
      id: In(foodItemIds),
    });

    const foundFoodItemIds = foodItems.map((item) => item.id);
    for (const detail of details) {
      if (!foundFoodItemIds.includes(detail.foodItemId)) {
        throw new NotFoundException(
          `FoodItem with ID ${detail.foodItemId} not found`,
        );
      }
    }

    try {
      // Tạo PurchaseOrder
      const purchaseOrder = await this.purchaseOrderRepository.save({
        supplier: supplier as Supplier,
        user: user as User,
        status: PurchaseOrderStatus.PENDING,
      });

      // Tạo PurchaseOrderDetails
      const purchaseOrderDetails = details.map((detail) => {
        var foodItem = foodItems.filter((x) => x.id === detail.foodItemId)[0];
        const detailEntity = new PurchaseOrderDetail();
        detailEntity.product = foodItem; // Sửa từ product thành foodItem
        detailEntity.quantity = detail.quantity;
        detailEntity.purchaseOrder = purchaseOrder;
        return detailEntity;
      });

      const result =
        await this.purchaseOrderDetailRepository.save(purchaseOrderDetails);
      return purchaseOrder;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Cannot create purchase order: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<UpdateResult> {
    return this.purchaseOrderRepository.update(id, updatePurchaseOrderDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.purchaseOrderRepository.delete(id);
  }

  async findById(id: number): Promise<any> {
    return this.purchaseOrderDetailRepository.findOneBy({ id });
  }
}
