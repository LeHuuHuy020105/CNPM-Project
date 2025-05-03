import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PurchaseOrderService } from './purchase.service';
import { CreatePurchaseOrderDto } from './dto/create_purchase_order_dto';
import { PurchaseOrder } from 'src/entities/purchase.entity';
import { AuthGuard } from 'src/auth/auth-guard';
import { UpdatePurchaseOrderDto } from './dto/update_purchase_order_dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Req() req: any,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(
      createPurchaseOrderDto,
      req.user_data.id,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<UpdateResult> {
    return this.purchaseOrderService.update(Number(id), updatePurchaseOrderDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.purchaseOrderService.delete(Number(id));
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any> {
    return this.purchaseOrderService.findById(Number(id));
  }
}
