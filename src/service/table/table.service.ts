import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from 'src/entities/table.entity';
import { urlToQRCode } from 'helpers/qr_util';
import { CreateTableDto } from 'src/dto/table/create_table_dto';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table)
    private tableRepository: Repository<Table>,
  ) {}

  async create(createTableDto: CreateTableDto): Promise<Table> {
    const newTable = await this.tableRepository.save(createTableDto);

    // Tạo URL QR code với id
    const baseUrl = process.env.BASE_URL || 'http://localhost:9999';
    const qrCodeUrl = `${baseUrl}/table/${newTable.id}/menu`;

    // Cập nhật qr_code
    newTable.qr_code = qrCodeUrl;
    return this.tableRepository.save(newTable);
  }

  async generateQRCode(
    tableId: number,
  ): Promise<{ qrCodeUrl: string; qrCodeBase64: string }> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:9999';
    const qrCodeUrl = `${baseUrl}/table/${tableId}/menu`;
    const qrCodeBase64 = await urlToQRCode(qrCodeUrl);

    table.qr_code = qrCodeUrl;
    await this.tableRepository.save(table);

    return { qrCodeUrl, qrCodeBase64 };
  }

  async getQRCode(
    tableId: number,
  ): Promise<{ qrCodeUrl: string; qrCodeBase64: string }> {
    const table = await this.tableRepository.findOne({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    if (!table.qr_code) {
      throw new NotFoundException(`QR code for Table ${tableId} not generated`);
    }

    const qrCodeBase64 = await urlToQRCode(table.qr_code);
    return { qrCodeUrl: table.qr_code, qrCodeBase64 };
  }
}
