import { OrderStatus } from 'src/constants/order_status';
import { OrderType } from 'src/constants/type_order';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { OrderDetail } from './order_detail.entity';
import { Bill } from './bill.entity';
import { BillStatus } from 'src/constants/bill_status';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: BillStatus,
    default: BillStatus.UNPAID,
  })
  status: BillStatus;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  totalPrice: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Table, (table) => table.orders, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  orderDetails: OrderDetail[];

  @ManyToMany(() => Bill, (bill) => bill.orders)
  bills: Bill[];
}
