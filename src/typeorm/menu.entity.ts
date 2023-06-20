import { Restaurant } from './restaurant.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
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
  description: string;

  @Column({
    nullable: false,
    default: '',
  })
  image: string;

  @Column({
    nullable: false,
    default: 0,
  })
  price: number;

  @ManyToOne(() => Restaurant, { cascade: true })
  restaurant: Restaurant;
}
