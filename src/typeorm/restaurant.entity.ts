import { Menu } from './menu.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  location: string;

  @OneToMany(() => Menu, (menu) => menu.restaurant)
  @JoinColumn()
  menu: Menu[];

  @OneToMany(() => Order, (order) => order.restaurant)
  @JoinColumn()
  order: Order[];
}
