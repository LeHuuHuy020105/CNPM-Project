import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PurchaseController } from './purchase.controller';
import { PurchaseOrderService } from './purchase.service';
import { FoodService } from '../food/food.service';
import { UserService } from '../user/user.service';
import { SupplierService } from '../supplier/supplier.service';
import { PurchaseDetailService } from '../purchase_detail/purchase_detail.service';
import { PurchaseOrder } from '../entities/purchase.entity';
import { PurchaseOrderDetail } from '../entities/purchase_order_detail.entity';
import { Supplier } from '../entities/supplier.entity';
import { User } from '../entities/user.entity';
import { FoodItem } from '../entities/fooditem.entity';
import { Category } from '../entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseOrder,
      PurchaseOrderDetail,
      Supplier,
      User,
      FoodItem,
      Category, // Thêm Category để cung cấp CategoryRepository
    ]),
    ConfigModule,
  ],
  controllers: [PurchaseController],
  providers: [
    PurchaseOrderService,
    FoodService,
    UserService,
    SupplierService,
    PurchaseDetailService,
  ],
})
export class PurchaseModule {}
