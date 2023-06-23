import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderItem, Restaurant, User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './order.dtos';
import { Status } from './order.model';
import { v4 as uuidv4 } from 'uuid';

/**
 * The OrderService handles operations related to orders in the application.
 */
@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * Creates a new order based on the provided order data.
   * @param createOrderDto - The DTO (Data Transfer Object) containing the order information.
   * @param req - The request object containing the authenticated user information.
   * @returns A string indicating the success of the operation.
   */
  async createOrder(createOrderDto: CreateOrderDto, req): Promise<string> {
    // Extract the authenticated user ID from the request
    const { sub } = req.user;

    // Create a new Order object with the provided data
    const orderData: Order = {
      id: uuidv4(),
      price: 0,
      order_item: [],
      restaurant: createOrderDto.restaurantId,
      user: sub,
      status: Status.PENDING,
    };

    // Create a new Order entity and save it to the database
    const newOrder = this.orderRepository.create(orderData);
    await this.orderRepository.save(newOrder);

    // Iterate over the order items and save them to the database
    createOrderDto.items.forEach(async (item) => {
      const data: OrderItem = {
        id: uuidv4(),
        name: item.name,
        price: item.price,
        order: orderData.id,
      };
      newOrder.price += item.price;
      await this.orderItemRepository.save(data);
    });

    // Update the order's price in the database
    this.orderRepository.update({ id: newOrder.id }, { price: newOrder.price });

    return 'Order created';
  }

  /**
   * Retrieves all orders from the database.
   * @returns A promise that resolves to an array of Order objects.
   */
  getOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['order_item'] });
  }

  /**
   * Retrieves orders belonging to a specific user.
   * @param req - The request object containing the authenticated user information.
   * @returns A promise that resolves to an array of User objects with their associated orders and order items.
   */
  getUserOrder(req): Promise<User[]> {
    const { sub } = req.user;
    return this.userRepository.find({
      where: { id: sub },
      select: ['name'],
      relations: ['order', 'order.order_item'],
    });
  }

  /**
   * Retrieves orders associated with a specific restaurant.
   * @param restaurantId - The ID of the restaurant.
   * @param req - The request object containing the authenticated user information.
   * @returns A promise that resolves to an array of Restaurant objects with their associated orders and order items.
   * @throws UnauthorizedException if the user does not have the 'chef' role.
   */
  getRestaurantOrder(restaurantId: string, req): Promise<Restaurant[]> {
    const { role } = req.user;
    if (role == 'chef') {
      return this.restaurantRepository.find({
        where: { id: restaurantId },
        select: ['name'],
        relations: ['order', 'order.order_item'],
      });
    }
    throw new UnauthorizedException();
  }

  /**
   * Cancels an order with the specified ID.
   * @param orderId - The ID of the order to cancel.
   * @returns A string indicating the success of the operation.
   * @throws BadRequestException if the order is not found, or if it is already completed or cancelled.
   */
  async cancelOrder(orderId: string): Promise<string> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (order.status == Status.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed order');
    }
    if (order.status == Status.CANCELLED) {
      throw new BadRequestException('Order already cancelled');
    }
    await this.orderRepository.update(
      { id: order.id },
      { status: Status.CANCELLED },
    );
    return 'Order cancelled';
  }

  /**
   * Marks an order as completed.
   * @param orderId - The ID of the order to complete.
   * @param req - The request object containing the authenticated user information.
   * @returns A string indicating the success of the operation.
   * @throws UnauthorizedException if the user does not have the 'chef' role.
   * @throws BadRequestException if the order is not found or if it has been cancelled.
   */
  async completeOrder(orderId: string, req): Promise<string> {
    const { role } = req.user;
    if (role == 'chef') {
      const order = await this.orderRepository.findOneBy({ id: orderId });
      if (!order) {
        throw new BadRequestException('Order not found');
      }
      if (order.status == Status.CANCELLED) {
        throw new BadRequestException('Order has been cancelled');
      }
      await this.orderRepository.update(
        { id: order.id },
        { status: Status.COMPLETED },
      );
      return 'Order Completed';
    }
    throw new UnauthorizedException();
  }
}
