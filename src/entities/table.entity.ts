import { TableStatus } from 'src/constants/table_status';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Bill } from './bill.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string;

  @Column({
    type: 'enum',
    enum: TableStatus,
    default: TableStatus.EMPTY,
  })
  status: TableStatus;

  @Column({ nullable: true })
  qr_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Order, (purchaseOrder) => purchaseOrder.table)
  orders: Order[];

  @OneToMany(() => Bill, (bill) => bill.table, { nullable: true })
  bills: Bill[];
}
