import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { OrderType } from 'src/constants/type_order';
import { CreateOrderDetailDto } from '../order_detail/create_order_detail';
import { Type } from 'class-transformer';

export class CreateBillDto {
  @IsEnum(OrderType)
  @IsOptional()
  @ApiProperty({
    description: 'Order type',
    example: OrderType.DINE_IN,
    enum: OrderType,
    default: OrderType.DINE_IN,
  })
  type: OrderType.DINE_IN;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  orderDetails: CreateOrderDetailDto[];
}
