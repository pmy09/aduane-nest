import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { OrderItem } from './order_items.model';

/**
 * Data transfer object for creating an order.
 */
export class CreateOrderDto {
  /**
   * The ID of the restaurant associated with the order.
   * @type {string}
   * @notEmpty - The restaurant ID must not be empty.
   */
  @IsNotEmpty()
  restaurantId: string;

  /**
   * An array of order items representing the items included in the order.
   * @type {Array<OrderItem>}
   * @isNotEmptyObject - The items array must not be empty.
   */
  @IsNotEmptyObject()
  items: Array<OrderItem>;
}
