import { Menu } from './menu.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';

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

  @ManyToOne(() => User, { cascade: true })
  user: User['id'];
}
