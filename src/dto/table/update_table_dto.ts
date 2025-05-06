import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { TableStatus } from 'src/constants/table_status';

export class UpdateTableDto {
  @IsInt()
  @IsOptional()
  capcity: number;

  @IsEnum(TableStatus)
  @IsOptional()
  @ApiProperty({
    enum: TableStatus,
  })
  type: TableStatus;
}
