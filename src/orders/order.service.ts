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
  async createOrder(createOrderDto: CreateOrderDto, req): Promise<string> {
    const { sub } = req.user;
    const orderData: Order = {
      id: uuidv4(),
      price: 0,
      order_item: [],
      restaurant: createOrderDto.restaurantId,
      user: sub,
      status: Status.PENDING,
    };
    const newOrder = this.orderRepository.create(orderData);
    await this.orderRepository.save(newOrder);

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

    this.orderRepository.update({ id: newOrder.id }, { price: newOrder.price });
    return 'Order created';
  }

  getOrders() {
    return this.orderRepository.find({ relations: ['order_item'] });
  }

  getUserOrder(req): Promise<User[]> {
    const { sub } = req.user;
    return this.userRepository.find({
      where: { id: sub },
      select: ['name'],
      relations: ['order', 'order.order_item'],
    });
  }

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

  async cancelOrder(orderId: string): Promise<string> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (order.status == Status.COMPLETED) {
      throw new BadRequestException('Cannot cancelled a completed order');
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
