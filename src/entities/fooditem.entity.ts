import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('food_items')
export class FoodItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sell_price: number;

  @Column()
  import_price: number;

  @Column()
  description: string;

  @Column({ type: 'longblob' }) // Lưu dữ liệu nhị phân
  image: Buffer;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  created_update: Date;

  @Column({ default: 1 })
  status: number;

  @Column()
  stock: number;
}
