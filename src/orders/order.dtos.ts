import { OrderItem } from './order_items.model';

export class CreateOrderDto {
  restaurantId: string;
  userId: string;
  items: Array<OrderItem>;
}
