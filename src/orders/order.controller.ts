import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dtos';
import { Order, Restaurant, User } from 'src/typeorm';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Handles the HTTP POST request to create a new order.
   * @param createOrderDto - The DTO (Data Transfer Object) containing the order information.
   * @param req - The request object.
   * @returns A promise that resolves to a string indicating the success of the operation.
   */
  @Post()
  @UsePipes(new ValidationPipe())
  addOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ): Promise<string> {
    return this.orderService.createOrder(createOrderDto, req);
  }

  /**
   * Handles the HTTP GET request to retrieve all orders.
   * @returns A promise that resolves to an array of Order objects.
   */
  @Get()
  getAllOrders(): Promise<Order[]> {
    return this.orderService.getOrders();
  }

  /**
   * Handles the HTTP GET request to retrieve orders belonging to the current user.
   * @param req - The request object.
   * @returns A promise that resolves to an array of User objects with their associated orders and order items.
   */
  @Get('myorders')
  getOrder(@Request() req): Promise<User[]> {
    return this.orderService.getUserOrder(req);
  }

  /**
   * Handles the HTTP GET request to retrieve orders associated with a specific restaurant.
   * @param restaurantId - The ID of the restaurant.
   * @param req - The request object.
   * @returns A promise that resolves to an array of Restaurant objects with their associated orders and order items.
   */
  @Get('restaurant/:id')
  getRestaurantOrder(
    @Param('id') restaurantId: string,
    @Request() req,
  ): Promise<Restaurant[]> {
    return this.orderService.getRestaurantOrder(restaurantId, req);
  }

  /**
   * Handles the HTTP PATCH request to cancel an order.
   * @param orderId - The ID of the order to cancel.
   * @returns A promise that resolves to a string indicating the success of the operation.
   */
  @Patch(':id')
  cancelOrder(@Param('id') orderId: string): Promise<string> {
    return this.orderService.cancelOrder(orderId);
  }

  /**
   * Handles the HTTP PATCH request to mark an order as completed.
   * @param orderId - The ID of the order to complete.
   * @param req - The request object.
   * @returns A promise that resolves to a string indicating the success of the operation.
   */
  @Patch('restaurant/:id')
  completeOrder(@Param('id') orderId: string, @Request() req): Promise<string> {
    return this.orderService.completeOrder(orderId, req);
  }
}
