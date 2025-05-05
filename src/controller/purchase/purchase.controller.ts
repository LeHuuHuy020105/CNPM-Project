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
import { PurchaseOrderService } from '../../service/purchase/purchase.service';
import { CreatePurchaseOrderDto } from '../../dto/purchase/create_purchase_order_dto';
import { PurchaseOrder } from 'src/entities/purchase.entity';
import { AuthGuard } from 'src/auth/auth-guard';
import { UpdatePurchaseOrderDto } from '../../dto/purchase/update_purchase_order_dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Public } from 'src/auth/decorator/public.decorator';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @Public()
  create(
    @Req() req: any,
    @Body() createPurchaseOrderDto: CreatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    return this.purchaseOrderService.create(
      createPurchaseOrderDto,
      req.user_id,
    );
  }

  @Put(':id')
  @Roles('Admin', 'User')
  update(
    @Param('id') id: string,
    @Body() updatePurchaseOrderDto: UpdatePurchaseOrderDto,
  ): Promise<UpdateResult> {
    return this.purchaseOrderService.update(Number(id), updatePurchaseOrderDto);
  }

  @Delete(':id')
  @Roles('Admin', 'User')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.purchaseOrderService.delete(Number(id));
  }

  @Get(':id')
  @Public()
  findById(@Param('id') id: string): Promise<any> {
    return this.purchaseOrderService.findById(Number(id));
  }
}
