import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { OrderItem } from './order_items.model';

export class CreateOrderDto {
  @IsNotEmpty()
  restaurantId: string;

  @IsNotEmptyObject()
  items: Array<OrderItem>;
}
