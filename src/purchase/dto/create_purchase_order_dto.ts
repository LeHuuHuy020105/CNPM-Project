import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { PurchaseOrderDetailDto } from 'src/purchase_detail/dto/create_purchase_order_detail_dto';

export class CreatePurchaseOrderDto {
  @IsInt()
  @Min(1)
  supplierId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderDetailDto)
  details: PurchaseOrderDetailDto[];
}
