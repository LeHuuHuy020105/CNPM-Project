import { IsOptional, IsString, Min, ValidateIf } from 'class-validator';

export class FilterFoodDto {
  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString()
  item_per_page: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  search_by: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @Min(0)
  @ValidateIf((o) => o.max_price !== undefined)
  min_price?: number;

  @IsOptional()
  @Min(0)
  @ValidateIf((o) => o.min_price !== undefined)
  max_price?: number;
}
