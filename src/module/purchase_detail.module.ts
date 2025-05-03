import { Module } from '@nestjs/common';
import { PurchaseDetailController } from '../controller/purchase_detail/purchase_detail.controller';
import { PurchaseDetailService } from '../service/purchase_detail/purchase_detail.service';

@Module({
  controllers: [PurchaseDetailController],
  providers: [PurchaseDetailService],
})
export class PurchaseDetailModule {}
