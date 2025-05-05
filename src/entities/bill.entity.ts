import { BillStatus } from 'src/constants/bill_status';
import { PaymentMethod } from 'src/constants/type_payment';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { Order } from './order.entity';
@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Table, (table) => table.bills, { nullable: true })
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @ManyToMany(() => Order, (order) => order.bills)
  @JoinTable({
    name: 'bill_orders',
    joinColumn: { name: 'bill_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'order_id', referencedColumnName: 'id' },
  })
  orders: Order[];
}
