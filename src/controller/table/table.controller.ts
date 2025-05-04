import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateTableDto } from 'src/dto/table/create_table_dto';
import { Table } from 'src/entities/table.entity';
import { TableService } from 'src/service/table/table.service';

@Controller('table')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  @Roles('Admin')
  create(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return this.tableService.create(createTableDto);
  }
}
