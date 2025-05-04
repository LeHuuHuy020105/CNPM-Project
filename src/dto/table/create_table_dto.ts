import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  @IsNotEmpty()
  capcity: number;
}
