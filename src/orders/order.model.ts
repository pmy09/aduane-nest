export class Order {
  constructor(
    public id: string,
    public restaurantId: string,
    public userId: string,
    public price: number,
    public status: Status,
  ) {}
}

export enum Status {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
