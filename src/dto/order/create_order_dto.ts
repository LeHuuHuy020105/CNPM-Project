import {
  ArrayNotEmpty,
  IsEnum,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderDetailDto } from '../order_detail/create_order_detail';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { OrderType } from 'src/constants/type_order';

export class CreateOrderDto {
  @IsEnum(OrderType)
  @IsOptional()
  @ApiProperty({
    description: 'Order type',
    example: OrderType.DINE_IN,
    enum: OrderType,
    default: OrderType.DINE_IN,
  })
  type: OrderType.DINE_IN;
}
