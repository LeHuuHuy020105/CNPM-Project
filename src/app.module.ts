import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/user.module';
import { AuthModule } from './module/auth.module';
import { CategoryModule } from './module/category.module';
import { FoodModule } from './module/food.module';
import { SupplierModule } from './module/supplier.module';
import { PurchaseModule } from './module/purchase.module';
import { PurchaseDetailModule } from './module/purchase_detail.module';
import { dataSourceOption } from '../db/data-source';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOption),
    UserModule,
    AuthModule,
    CategoryModule,
    FoodModule,
    SupplierModule,
    PurchaseModule,
    PurchaseDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
