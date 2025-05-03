import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { FoodModule } from './food/food.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseController } from './purchase/purchase.controller';
import { PurchaseService } from './purchase/purchase.service';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(),
    CategoryModule,
    FoodModule,
    SupplierModule,
    PurchaseModule,
  ],
  controllers: [AppController, PurchaseController],
  providers: [AppService, PurchaseService],
})
export class AppModule {}
