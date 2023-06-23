/**
 * Represents an item within an order.
 */
export class OrderItem {
  /**
   * Creates an instance of the OrderItem class.
   * @param id - The unique identifier of the order item.
   * @param orderId - The ID of the order to which the item belongs.
   * @param name - The name or description of the item.
   * @param price - The price of the item.
   */
  constructor(
    public id: string,
    public orderId: string,
    public name: string,
    public price: number,
  ) {}
}
