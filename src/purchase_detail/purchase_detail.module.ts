import { Module } from '@nestjs/common';
import { PurchaseDetailController } from './purchase_detail.controller';
import { PurchaseDetailService } from './purchase_detail.service';

@Module({
  controllers: [PurchaseDetailController],
  providers: [PurchaseDetailService]
})
export class PurchaseDetailModule {}
