import { OrderItem } from './order_item.entity';
import { Status } from '../orders/order.model';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: Status;

  @Column({
    nullable: false,
    default: 0,
  })
  price: number;

  @OneToMany(() => OrderItem, (order_item) => order_item.order)
  @JoinColumn()
  order_item: OrderItem[];

  @ManyToOne(() => Restaurant, { cascade: true })
  restaurant: Restaurant['id'];

  @ManyToOne(() => User, { cascade: true })
  user: User['id'];
}
