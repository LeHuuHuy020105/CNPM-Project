import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseOrderDetail } from './purchase_order_detail.entity';
import { User } from './user.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Chờ xử lí' })
  status: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders) // Sửa thành purchaseOrders
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(
    () => PurchaseOrderDetail,
    (detailPurchase) => detailPurchase.purchaseOrder,
  )
  purchaseOrderDetails: PurchaseOrderDetail[]; // Sửa tên thuộc tính

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  created_update: Date;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;
}
