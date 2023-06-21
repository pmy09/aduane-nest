import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
  async createOrder(createOrderDto: CreateOrderDto) {
    const orderData: Order = {
      id: uuidv4(),
      price: 0,
      order_item: [],
      restaurant: createOrderDto.restaurantId,
      user: createOrderDto.userId,
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
  }

  getOrders() {
    return this.orderRepository.find({ relations: ['order_item'] });
  }

  getUserOrder(userId: string) {
    return this.userRepository.find({
      where: { id: userId },
      select: ['name'],
      relations: ['order', 'order.order_item'],
    });
  }

  getRestaurantOrder(restaurantId: string): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { id: restaurantId },
      select: ['name'],
      relations: ['order', 'order.order_item'],
    });
  }

  async cancelOrder(orderId: string) {
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
  }

  async completeOrder(orderId: string) {
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
  }

  //   async updateMenu(menuId: string, updateMenuDto: CreateMenuDto) {
  //     const menu = await this.findMenu(menuId);
  //     if (updateMenuDto.name) {
  //       menu.name = updateMenuDto.name;
  //     }
  //     if (updateMenuDto.description) {
  //       menu.description = updateMenuDto.description;
  //     }
  //     if (updateMenuDto.image) {
  //       menu.image = updateMenuDto.image;
  //     }
  //     if (updateMenuDto.price) {
  //       menu.price = updateMenuDto.price;
  //     }
  //     return this.orderRepository.save(menu);
  //   }

  //   async deleteMenu(menuId: string) {
  //     const menu = await this.findMenu(menuId);
  //     this.orderRepository.delete(menu);
  //   }

  //   private async findMenu(id: string) {
  //     const menu = await this.orderRepository.findOneBy({ id });
  //     if (!menu) {
  //       throw new NotFoundException('Could not find menu.');
  //     }
  //     return menu;
  //   }
}
