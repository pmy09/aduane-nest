/**
 * Represents an order.
 */
export class Order {
  /**
   * Creates an instance of the Order class.
   * @param {string} id - The ID of the order.
   * @param {string} restaurantId - The ID of the restaurant associated with the order.
   * @param {string} userId - The ID of the user who placed the order.
   * @param {number} price - The price of the order.
   * @param {Status} status - The status of the order.
   */
  constructor(
    public id: string,
    public restaurantId: string,
    public userId: string,
    public price: number,
    public status: Status,
  ) {}
}

/**
 * Enum representing the possible statuses for an order.
 */
export enum Status {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
